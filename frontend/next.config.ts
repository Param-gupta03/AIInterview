import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@tensorflow-models/face-detection", "@mediapipe/face_detection"],
  turbopack: {
    root: path.resolve(__dirname),
    resolveAlias: {
      "@mediapipe/face_detection": "./src/lib/mediapipe-fix.js",
    },
  },
};

export default nextConfig;
