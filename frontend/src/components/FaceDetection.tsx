"use client";

import React, { useEffect, useRef, useState } from "react";

type FaceDetectionProps = {
  isActive: boolean;
  onWarning: (message: string) => void;
};

export default function FaceDetection({ isActive, onWarning }: FaceDetectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [detector, setDetector] = useState<any>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        // Dynamically import libraries to avoid SSR and bundling issues
        const [faceDetection, _tfjs, _webgl, _converter] = await Promise.all([
          import("@tensorflow-models/face-detection"),
          import("@tensorflow/tfjs-core"),
          import("@tensorflow/tfjs-backend-webgl"),
          import("@tensorflow/tfjs-converter"),
        ]);

        const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
        const detectorConfig: any = {
          runtime: "tfjs",
        };
        const newDetector = await faceDetection.createDetector(model, detectorConfig);
        setDetector(newDetector);
      } catch (err) {
        console.error("Failed to load face detection model:", err);
      }
    };

    if (isActive && !detector) {
      loadModel();
    }
  }, [isActive, detector]);

  useEffect(() => {
    if (isActive && detector) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isActive, detector]);

  useEffect(() => {
    return () => {
      if (detector && typeof detector.close === "function") {
        detector.close();
      }
    };
  }, [detector]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      onWarning("Camera access is required for cheating detection.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (isActive && isCameraReady && detector) {
      intervalRef.current = setInterval(async () => {
        if (videoRef.current) {
          const faces = await detector.estimateFaces(videoRef.current);
          if (faces.length === 0) {
            onWarning("No face detected! Please stay in front of the camera.");
          } else if (faces.length > 1) {
            onWarning("Multiple faces detected! Cheating is prohibited.");
          }
        }
      }, 3000); // Check every 3 seconds
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, isCameraReady, detector, onWarning]);

  if (!isActive) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border-4 border-slate-700 bg-black shadow-2xl mb-6 aspect-video max-w-md mx-auto">
      <div className="relative h-full w-full">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover scale-x-[-1]"
        />
        
        {/* Overlay UI */}
        <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1.5 rounded-full bg-slate-900/90 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest shadow-xl border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
              </span>
              Monitoring
            </div>
          </div>

          <div className="space-y-2">
            <div className="rounded-lg bg-slate-900/80 px-3 py-2 text-center backdrop-blur-md border border-white/10 shadow-2xl">
              <p className="text-[10px] font-medium text-white">AI Proctoring Active</p>
            </div>
          </div>
        </div>

        {/* Scanning Animation Line */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-scan" />
      </div>
      
      <style jsx>{`
        @keyframes scan {
          0% { top: 0% }
          100% { top: 100% }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
