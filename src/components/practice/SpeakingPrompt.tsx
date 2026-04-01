"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, Square, Play, Pause, RotateCcw, ChevronRight, AlertCircle, Sparkles, Loader2, ShieldCheck } from "lucide-react";
import type { SpeakingContent, SpeakingEvaluationResult } from "@/types";

interface Props {
  content: SpeakingContent;
  submitted: boolean;
  onRecordingComplete: () => void;
  levelColor: string;
  level?: string;
  isPremium?: boolean;
}

type Phase = "idle" | "preparing" | "recording" | "recorded";

function getSupportedMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) return "audio/webm;codecs=opus";
  if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
  if (MediaRecorder.isTypeSupported("audio/mp4")) return "audio/mp4";
  return "";
}

export default function SpeakingPrompt({ content, submitted, onRecordingComplete, levelColor, level, isPremium }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [prepCountdown, setPrepCountdown] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [showSample, setShowSample] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [currentExaminerQ, setCurrentExaminerQ] = useState(0);
  const [examinerRecordings, setExaminerRecordings] = useState<Record<number, string>>({});

  // AI evaluation state
  const [evaluation, setEvaluation] = useState<SpeakingEvaluationResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const speakingTime = content.speaking_time_seconds ?? 60;
  const hasExaminerQs = content.examiner_questions && content.examiner_questions.length > 0;
  const isMultiQuestion = hasExaminerQs && content.examiner_questions!.length > 1;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      Object.values(examinerRecordings).forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicError(null);
      return stream;
    } catch {
      setMicError("无法访问麦克风。请在浏览器设置中允许麦克风权限后重试。");
      return null;
    }
  }, []);

  const startRecording = useCallback(
    async (stream: MediaStream) => {
      const mimeType = getSupportedMimeType();
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        audioBlobRef.current = blob;

        if (isMultiQuestion) {
          setExaminerRecordings((prev) => {
            const old = prev[currentExaminerQ];
            if (old) URL.revokeObjectURL(old);
            return { ...prev, [currentExaminerQ]: url };
          });
        } else {
          if (audioUrl) URL.revokeObjectURL(audioUrl);
          setAudioUrl(url);
        }
        setPhase("recorded");
      };

      recorder.start();
      setPhase("recording");
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const next = prev + 1;
          if (next >= speakingTime) {
            recorder.stop();
            if (timerRef.current) clearInterval(timerRef.current);
          }
          return next;
        });
      }, 1000);
    },
    [speakingTime, isMultiQuestion, currentExaminerQ, audioUrl]
  );

  const handleStart = async () => {
    const stream = await startMic();
    if (!stream) return;

    if (content.preparation_time_seconds) {
      setPhase("preparing");
      setPrepCountdown(content.preparation_time_seconds);

      let remaining = content.preparation_time_seconds;
      timerRef.current = setInterval(() => {
        remaining--;
        setPrepCountdown(remaining);
        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          startRecording(stream);
        }
      }, 1000);
    } else {
      startRecording(stream);
    }
  };

  const handleStop = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleReRecord = async () => {
    if (isMultiQuestion) {
      const old = examinerRecordings[currentExaminerQ];
      if (old) URL.revokeObjectURL(old);
      setExaminerRecordings((prev) => {
        const copy = { ...prev };
        delete copy[currentExaminerQ];
        return copy;
      });
    } else {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setPhase("idle");
    setRecordingTime(0);
    // Stop existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const handlePlayPause = () => {
    const url = isMultiQuestion ? examinerRecordings[currentExaminerQ] : audioUrl;
    if (!url) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setPlayProgress(0);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    } else {
      audioRef.current.src = url;
      audioRef.current.play();
      setIsPlaying(true);

      const updateProgress = () => {
        if (audioRef.current) {
          const pct = audioRef.current.duration
            ? (audioRef.current.currentTime / audioRef.current.duration) * 100
            : 0;
          setPlayProgress(pct);
        }
        animFrameRef.current = requestAnimationFrame(updateProgress);
      };
      updateProgress();
    }
  };

  const handleNextQuestion = () => {
    if (!isMultiQuestion) return;
    const total = content.examiner_questions!.length;
    if (currentExaminerQ < total - 1) {
      setCurrentExaminerQ(currentExaminerQ + 1);
      setPhase(examinerRecordings[currentExaminerQ + 1] ? "recorded" : "idle");
      setRecordingTime(0);
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    }
  };

  const handlePrevQuestion = () => {
    if (!isMultiQuestion || currentExaminerQ === 0) return;
    setCurrentExaminerQ(currentExaminerQ - 1);
    setPhase(examinerRecordings[currentExaminerQ - 1] ? "recorded" : "idle");
    setRecordingTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const handleComplete = () => {
    // Stop stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    onRecordingComplete();
  };

  const allRecorded = isMultiQuestion
    ? content.examiner_questions!.every((_, i) => !!examinerRecordings[i])
    : !!audioUrl;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const timeWarning = speakingTime - recordingTime <= 10 && phase === "recording";

  const handleEvaluation = async () => {
    if (!audioBlobRef.current) return;
    setEvaluating(true);
    setEvaluationError(null);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlobRef.current, "recording.webm");
      formData.append("level", level ?? "pet");
      formData.append("prompt", `${content.stem}\n\n${content.prompt}`);
      if (content.examiner_questions && content.examiner_questions.length > 0) {
        formData.append("part", content.examiner_questions.join("\n"));
      }

      const res = await fetch("/api/ai/speaking-evaluation", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "评估失败");
      }

      const result: SpeakingEvaluationResult = await res.json();
      setEvaluation(result);
    } catch (err) {
      setEvaluationError(err instanceof Error ? err.message : "评估失败，请稍后重试");
    } finally {
      setEvaluating(false);
    }
  };

  const DIMENSION_LABELS: { key: keyof SpeakingEvaluationResult["scores"]; label: string; desc: string; criteria: string[] }[] = [
    { key: "grammar_vocabulary", label: "语法词汇", desc: "Grammar & Vocabulary", criteria: ["语法是否准确", "词汇是否丰富多样"] },
    { key: "discourse_management", label: "话语管理", desc: "Discourse Management", criteria: ["回答是否连贯", "是否使用衔接词"] },
    { key: "pronunciation", label: "发音", desc: "Pronunciation", criteria: ["发音是否清晰", "语调是否自然"] },
    { key: "interactive_communication", label: "互动交际", desc: "Interactive Communication", criteria: ["回答是否充分", "是否主动拓展内容"] },
  ];

  // Submitted view: show playback + sample answer
  if (submitted) {
    return (
      <div className="space-y-6">
        <p className="text-base font-medium text-text-primary">{content.stem}</p>

        <div className="rounded-[--radius-md] border border-border-light bg-bg p-6">
          <p className="text-[15px] leading-relaxed text-text-primary whitespace-pre-line">
            {content.prompt}
          </p>
        </div>

        {hasExaminerQs && (
          <div className="space-y-3">
            {content.examiner_questions!.map((q, i) => (
              <div key={i} className="rounded-[--radius-md] border border-border-light bg-bg p-4">
                <p className="text-sm font-medium text-text-secondary mb-2">
                  Question {i + 1}: {q}
                </p>
                {(isMultiQuestion ? examinerRecordings[i] : audioUrl) && (
                  <button
                    onClick={() => {
                      const url = isMultiQuestion ? examinerRecordings[i] : audioUrl;
                      if (!url) return;
                      const audio = new Audio(url);
                      audio.play();
                    }}
                    className="inline-flex items-center gap-2 text-sm font-medium"
                    style={{ color: levelColor }}
                  >
                    <Play size={14} />
                    播放录音
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {!hasExaminerQs && audioUrl && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const audio = new Audio(audioUrl);
                audio.play();
              }}
              className="inline-flex items-center gap-2 text-sm font-medium"
              style={{ color: levelColor }}
            >
              <Play size={14} />
              播放你的录音
            </button>
          </div>
        )}

        {content.sample_answer && (
          <div className="rounded-[--radius-md] border-2 border-ket/30 bg-ket-light/50 p-6">
            <button
              onClick={() => setShowSample(!showSample)}
              className="flex w-full items-center justify-between text-left"
            >
              <h4 className="text-[15px] font-semibold text-ket">参考回答</h4>
              <span className="text-sm text-ket">{showSample ? "收起" : "展开查看"}</span>
            </button>
            {showSample && (
              <div className="mt-4 rounded-[--radius-sm] bg-white/70 p-4">
                <p className="text-[15px] leading-relaxed text-text-primary whitespace-pre-line">
                  {content.sample_answer}
                </p>
              </div>
            )}
          </div>
        )}

        {/* AI Speaking Evaluation */}
        {!evaluation && (
          <div className="rounded-[--radius-md] border-2 border-fce/30 bg-fce-light/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-fce" />
                <h4 className="text-[15px] font-semibold text-fce">AI 口语评估</h4>
              </div>
              {isPremium ? (
                <button
                  onClick={handleEvaluation}
                  disabled={evaluating}
                  className="inline-flex items-center gap-2 rounded-[--radius-pill] bg-fce px-4 py-2 text-sm font-medium text-white hover:bg-fce/90 disabled:opacity-60"
                >
                  {evaluating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      评估中...
                    </>
                  ) : (
                    "开始评估"
                  )}
                </button>
              ) : (
                <a
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-fce hover:underline"
                >
                  升级解锁
                </a>
              )}
            </div>
            <p className="mt-2 text-sm text-text-secondary">
              {isPremium
                ? "AI 将转写你的录音并从语法词汇、话语管理、发音、互动交际四个维度评分"
                : "高级会员可使用 AI 评估，获得语音转写和剑桥标准四维评分"}
            </p>
            {evaluationError && (
              <p className="mt-3 text-sm text-red-500">{evaluationError}</p>
            )}
          </div>
        )}

        {/* AI Evaluation result */}
        {evaluation && (
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Score card — left */}
            <div className="rounded-[--radius-md] border border-border bg-bg-card p-6 lg:col-span-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-fce" />
                <h4 className="text-sm font-semibold text-fce">AI 评分</h4>
              </div>
              <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-text-tertiary">
                <ShieldCheck size={12} className="text-ket" />
                Cambridge Speaking 官方评分维度
              </p>

              {/* Total score */}
              <div className="mt-5 text-center">
                <div
                  className="text-5xl font-bold text-text-primary"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {Object.values(evaluation.scores).reduce((a, b) => a + b, 0)}
                  <span className="text-lg font-normal text-text-tertiary"> / 20</span>
                </div>
                <p className="mt-1 text-sm text-text-secondary">
                  {(level ?? "pet").toUpperCase()} Speaking
                </p>
              </div>

              {/* Dimension scores with bars */}
              <div className="mt-6 space-y-4">
                {DIMENSION_LABELS.map(({ key, label, desc, criteria }) => {
                  const score = evaluation.scores[key];
                  const needsImprovement = score <= 3;
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-text-secondary">{label}</span>
                          <span className="ml-1.5 text-[11px] text-text-tertiary">{desc}</span>
                        </div>
                        <span className="font-medium text-text-primary">
                          {score}/5
                        </span>
                      </div>
                      <div className="mt-1.5">
                        <div className="h-2 flex-1 rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${(score / 5) * 100}%`, backgroundColor: "#8B5CF6" }}
                          />
                        </div>
                      </div>
                      {needsImprovement && (
                        <p className="mt-1 text-[11px] leading-snug text-text-tertiary">
                          待提升：{criteria.join("、")}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Overall feedback */}
              <p className="mt-6 rounded-lg bg-fce-light/60 p-3 text-xs leading-relaxed text-text-secondary">
                {evaluation.overall_feedback_zh}
              </p>
              {evaluation.overall_feedback_en && (
                <p className="mt-2 rounded-lg bg-bg p-3 text-xs leading-relaxed text-text-tertiary italic">
                  {evaluation.overall_feedback_en}
                </p>
              )}
            </div>

            {/* Transcript + annotations + improved — right */}
            <div className="space-y-6 lg:col-span-3">
              {/* Transcript */}
              <div className="rounded-[--radius-md] border border-border bg-bg-card p-6">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-fce" />
                  <h4 className="text-sm font-semibold text-fce">语音转写</h4>
                </div>
                <div className="mt-4 rounded-lg bg-bg p-4">
                  <p className="text-[15px] leading-relaxed text-text-primary whitespace-pre-line">
                    {evaluation.transcript}
                  </p>
                </div>
              </div>

              {/* Annotations */}
              {evaluation.annotations.length > 0 && (
                <div className="rounded-[--radius-md] border border-border bg-bg-card p-6">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-fce" />
                    <h4 className="text-sm font-semibold text-fce">逐句批注</h4>
                  </div>

                  <div className="mt-5 space-y-4">
                    {evaluation.annotations.map((ann, i) => (
                      <div key={i} className="rounded-lg border border-border-light bg-bg p-4">
                        {/* Original with strikethrough */}
                        <p className="text-[15px] text-text-primary">
                          <span className={`mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white ${
                            ann.type === "error" ? "bg-red-400" : ann.type === "improvement" ? "bg-amber-400" : "bg-ket"
                          }`}>
                            {i + 1}
                          </span>
                          {ann.type === "good" ? (
                            <span>{ann.original}</span>
                          ) : (
                            <span className="line-through decoration-red-300/60">{ann.original}</span>
                          )}
                        </p>
                        {/* Comment */}
                        <p className="mt-2 pl-7 text-sm font-medium text-fce">
                          {ann.comment_zh}
                        </p>
                        {/* Suggestion */}
                        {ann.suggestion && ann.type !== "good" && (
                          <p className="mt-1.5 pl-7 text-sm text-ket">
                            → {ann.suggestion}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improved response — directly shown */}
              {evaluation.improved_response && (
                <div className="rounded-[--radius-md] border border-border bg-bg-card p-6">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-ket" />
                    <h4 className="text-sm font-semibold text-ket">AI 改进版回答</h4>
                  </div>
                  <div className="mt-4 rounded-lg bg-ket-light/40 p-4">
                    <p className="text-[15px] leading-relaxed text-text-primary whitespace-pre-line">
                      {evaluation.improved_response}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {content.tips_zh && (
          <div className="rounded-[--radius-md] border-2 border-blue/20 bg-blue-light/50 p-6">
            <button
              onClick={() => setShowTips(!showTips)}
              className="flex w-full items-center justify-between text-left"
            >
              <h4 className="text-[15px] font-semibold text-blue">答题技巧</h4>
              <span className="text-sm text-blue">{showTips ? "收起" : "展开查看"}</span>
            </button>
            {showTips && (
              <div className="mt-4 rounded-[--radius-sm] bg-white/70 p-4">
                <p className="text-[15px] leading-relaxed text-text-primary whitespace-pre-line">
                  {content.tips_zh}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Active recording view
  return (
    <div className="space-y-6">
      {/* Stem */}
      <p className="text-base font-medium text-text-primary">{content.stem}</p>

      {/* Prompt */}
      <div className="rounded-[--radius-md] border border-border-light bg-bg p-6">
        <p className="text-[15px] leading-relaxed text-text-primary whitespace-pre-line">
          {content.prompt}
        </p>
      </div>

      {/* Image for Part 3 */}
      {content.image_url && (
        <div className="rounded-[--radius-md] border border-border-light overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.image_url}
            alt="Speaking prompt image"
            className="w-full max-h-80 object-contain bg-bg"
          />
        </div>
      )}

      {/* Examiner questions: show current question */}
      {hasExaminerQs && (
        <div className="rounded-[--radius-md] border-2 p-5" style={{ borderColor: `${levelColor}40` }}>
          {isMultiQuestion && (
            <p className="text-xs font-medium text-text-tertiary mb-2">
              Question {currentExaminerQ + 1} / {content.examiner_questions!.length}
            </p>
          )}
          <p className="text-[15px] font-medium text-text-primary">
            {content.examiner_questions![currentExaminerQ]}
          </p>
        </div>
      )}

      {/* Mic error */}
      {micError && (
        <div className="flex items-start gap-3 rounded-[--radius-md] bg-red-50 p-4 text-red-600">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm">{micError}</p>
        </div>
      )}

      {/* Recording controls */}
      <div className="flex flex-col items-center gap-6 py-4">
        {phase === "idle" && (
          <button
            onClick={handleStart}
            className="flex h-20 w-20 items-center justify-center rounded-full text-white transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: levelColor }}
          >
            <Mic size={32} />
          </button>
        )}

        {phase === "preparing" && (
          <div className="flex flex-col items-center gap-4">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full border-4"
              style={{ borderColor: levelColor }}
            >
              <span
                className="text-3xl font-bold"
                style={{ fontFamily: "var(--font-display)", color: levelColor }}
              >
                {prepCountdown}
              </span>
            </div>
            <p className="text-sm text-text-secondary">准备时间…录音即将开始</p>
          </div>
        )}

        {phase === "recording" && (
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleStop}
              className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-white transition-transform hover:scale-105 active:scale-95"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-30" />
              <Square size={28} className="relative z-10" />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              <span
                className={`text-lg font-mono font-semibold tabular-nums ${timeWarning ? "text-red-500" : "text-text-primary"}`}
              >
                {formatTime(recordingTime)} / {formatTime(speakingTime)}
              </span>
            </div>
            {timeWarning && (
              <p className="text-sm text-red-500 font-medium">即将结束录音</p>
            )}
          </div>
        )}

        {phase === "recorded" && (
          <div className="w-full max-w-sm space-y-4">
            {/* Playback */}
            <div className="flex items-center gap-3 rounded-[--radius-md] border border-border bg-bg-card p-4">
              <button
                onClick={handlePlayPause}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: levelColor }}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </button>
              <div className="flex-1">
                <div className="h-1.5 w-full rounded-full bg-border-light">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${playProgress}%`, backgroundColor: levelColor }}
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleReRecord}
                className="inline-flex items-center gap-2 rounded-[--radius-pill] border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:bg-bg"
              >
                <RotateCcw size={14} />
                重新录音
              </button>
              {isMultiQuestion && currentExaminerQ < content.examiner_questions!.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-2 rounded-[--radius-pill] px-5 py-2 text-sm font-medium text-white"
                  style={{ backgroundColor: levelColor }}
                >
                  下一题
                  <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="inline-flex items-center gap-2 rounded-[--radius-pill] px-5 py-2 text-sm font-medium text-white"
                  style={{ backgroundColor: levelColor }}
                >
                  完成录音
                </button>
              )}
            </div>
          </div>
        )}

        {phase === "idle" && (
          <p className="text-sm text-text-secondary">
            {content.preparation_time_seconds
              ? `点击开始，${content.preparation_time_seconds} 秒准备后自动录音`
              : "点击开始录音"}
          </p>
        )}
      </div>

      {/* Multi-question navigation */}
      {isMultiQuestion && phase !== "preparing" && phase !== "recording" && (
        <div className="flex items-center justify-center gap-2">
          {content.examiner_questions!.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentExaminerQ(i);
                setPhase(examinerRecordings[i] ? "recorded" : "idle");
                if (audioRef.current) {
                  audioRef.current.pause();
                  setIsPlaying(false);
                }
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all ${
                i === currentExaminerQ
                  ? "text-white"
                  : examinerRecordings[i]
                    ? "border-2 text-text-primary"
                    : "border border-border text-text-tertiary"
              }`}
              style={
                i === currentExaminerQ
                  ? { backgroundColor: levelColor }
                  : examinerRecordings[i]
                    ? { borderColor: levelColor, color: levelColor }
                    : undefined
              }
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Overall complete button for multi-question */}
      {isMultiQuestion && allRecorded && phase === "recorded" && currentExaminerQ === content.examiner_questions!.length - 1 && (
        <div className="flex justify-center pt-2">
          <p className="text-sm text-ket font-medium">所有问题已录音完成，可以提交</p>
        </div>
      )}

      {/* Prev button for multi-question */}
      {isMultiQuestion && currentExaminerQ > 0 && phase !== "recording" && phase !== "preparing" && (
        <div className="flex justify-center">
          <button
            onClick={handlePrevQuestion}
            className="text-sm text-text-tertiary hover:text-text-secondary transition-colors"
          >
            ← 上一题
          </button>
        </div>
      )}
    </div>
  );
}
