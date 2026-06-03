// Dummy fix for MediaPipe FaceDetection export issue in Next.js Turbopack
// This is needed because @tensorflow-models/face-detection tries to import { FaceDetection } 
// from @mediapipe/face_detection, but the latter is a UMD bundle without proper ESM exports.

export class FaceDetection {
  constructor() {
    console.warn("MediaPipe FaceDetection dummy constructor called. If you are using runtime: 'mediapipe', this will fail.");
  }
}

export const VERSION = "0.0.0-dummy";
