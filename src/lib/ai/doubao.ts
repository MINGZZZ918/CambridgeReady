/**
 * 豆包语音识别 (ASR) 客户端
 * 调用豆包语音识别 API 将音频转为文字
 */

const DOUBAO_API_KEY = () => process.env.DOUBAO_API_KEY ?? "";
const DOUBAO_APP_ID = () => process.env.DOUBAO_APP_ID ?? "";
const DOUBAO_ASR_ENDPOINT = () =>
  process.env.DOUBAO_ASR_ENDPOINT ?? "https://openspeech.bytedance.com/api/v1/auc";

export async function transcribeAudio(
  audioBuffer: Buffer,
  mimeType: string
): Promise<string> {
  const apiKey = DOUBAO_API_KEY();
  const appId = DOUBAO_APP_ID();
  const endpoint = DOUBAO_ASR_ENDPOINT();

  // If API keys are not configured, return stub text
  if (!apiKey || !appId) {
    console.warn("Doubao ASR: API key or App ID not configured, returning stub transcript");
    return "[语音转写服务尚未配置，请联系管理员设置 DOUBAO_API_KEY 和 DOUBAO_APP_ID]";
  }

  const audioBase64 = audioBuffer.toString("base64");

  // Determine audio format from mime type
  let format = "wav";
  if (mimeType.includes("webm")) format = "webm";
  else if (mimeType.includes("mp4") || mimeType.includes("m4a")) format = "m4a";
  else if (mimeType.includes("ogg")) format = "ogg";
  else if (mimeType.includes("mp3") || mimeType.includes("mpeg")) format = "mp3";

  const payload = {
    app: {
      appid: appId,
      cluster: "volcengine_streaming_common",
    },
    user: { uid: "cambridgeready" },
    audio: {
      format,
      codec: "raw",
      rate: 16000,
      bits: 16,
      channel: 1,
      language: "en-US",
    },
    request: {
      reqid: crypto.randomUUID(),
      sequence: -1,
      nbest: 1,
      text: audioBase64,
    },
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Doubao ASR error:", res.status, errorText);
    throw new Error("语音识别服务暂时不可用");
  }

  const data = await res.json();

  // Extract transcript from response
  if (data.result && data.result.text) {
    return data.result.text;
  }

  if (data.text) {
    return data.text;
  }

  console.warn("Doubao ASR: unexpected response structure", JSON.stringify(data).slice(0, 500));
  return data.result?.text ?? "";
}
