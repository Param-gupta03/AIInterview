import MicRecorder from "mic-recorder-to-mp3";
import { transcribeInterviewAudio } from "./interviewApi";

const recorder = new MicRecorder({ bitRate: 128 });

export async function startAudioRecording() {
  await recorder.start();
}

export async function stopAudioRecording(token?: string) {
  const [buffer, blob] = await recorder.stop().getMp3();
  return transcribeInterviewAudio(buffer, blob, token);
}

export function cancelAudioRecording() {
  recorder.stop().getMp3().catch(() => undefined);
}
