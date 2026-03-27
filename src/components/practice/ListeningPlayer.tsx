"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface Props {
  audioUrl: string;
  levelColor: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ListeningPlayer({ audioUrl, levelColor }: Props) {
  const soundRef = useRef<import("howler").Howl | null>(null);
  const rafRef = useRef<number>(0);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [seek, setSeek] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const updateSeek = useCallback(() => {
    if (soundRef.current && soundRef.current.playing()) {
      setSeek(soundRef.current.seek());
      rafRef.current = requestAnimationFrame(updateSeek);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    import("howler").then(({ Howl }) => {
      if (!mounted) return;

      const sound = new Howl({
        src: [audioUrl],
        html5: true,
        onload: () => {
          if (!mounted) return;
          setDuration(sound.duration());
          setLoaded(true);
        },
        onplay: () => {
          if (!mounted) return;
          setPlaying(true);
          rafRef.current = requestAnimationFrame(updateSeek);
        },
        onpause: () => {
          if (!mounted) return;
          setPlaying(false);
          cancelAnimationFrame(rafRef.current);
        },
        onstop: () => {
          if (!mounted) return;
          setPlaying(false);
          setSeek(0);
          cancelAnimationFrame(rafRef.current);
        },
        onend: () => {
          if (!mounted) return;
          setPlaying(false);
          setSeek(0);
          cancelAnimationFrame(rafRef.current);
        },
      });

      soundRef.current = sound;
    });

    return () => {
      mounted = false;
      cancelAnimationFrame(rafRef.current);
      soundRef.current?.unload();
    };
  }, [audioUrl, updateSeek]);

  const togglePlay = () => {
    if (!soundRef.current) return;
    if (playing) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const restart = () => {
    if (!soundRef.current) return;
    soundRef.current.stop();
    soundRef.current.play();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!soundRef.current || !loaded) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const newSeek = ratio * duration;
    soundRef.current.seek(newSeek);
    setSeek(newSeek);
  };

  const progressPercent = duration > 0 ? (seek / duration) * 100 : 0;

  return (
    <div className="rounded-[--radius-md] border border-border bg-bg-card p-5">
      <div className="flex items-center gap-4">
        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          disabled={!loaded}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-all active:scale-95 disabled:opacity-40"
          style={{ backgroundColor: levelColor }}
        >
          {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>

        {/* Progress bar */}
        <div className="flex flex-1 items-center gap-3">
          <div
            className="relative h-2 flex-1 cursor-pointer rounded-full bg-border-light"
            onClick={handleProgressClick}
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-[width] duration-100"
              style={{ width: `${progressPercent}%`, backgroundColor: levelColor }}
            />
          </div>
          <span className="shrink-0 text-xs tabular-nums text-text-tertiary">
            {formatTime(seek)} / {formatTime(duration)}
          </span>
        </div>

        {/* Replay */}
        <button
          onClick={restart}
          disabled={!loaded}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-bg disabled:opacity-40"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
