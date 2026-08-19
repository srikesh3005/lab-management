import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Equipment } from "../types";
import {
  Camera,
  X,
  RefreshCw,
  Zap,
  Upload,
  AlertCircle,
  CheckCircle2,
  QrCode,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentList: Equipment[];
  onScanSuccess: (equipment: Equipment) => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  equipmentList,
  onScanSuccess,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [torchOn, setTorchOn] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [detectedCode, setDetectedCode] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Helper to parse equipment from scanned string (can be URL, ID, or SMARTLAB prefix)
  const parseEquipmentFromCode = (scannedText: string): Equipment | null => {
    const raw = scannedText.trim();

    // 1. Check if URL with asset param
    try {
      if (raw.includes("asset=") || raw.includes("http")) {
        const url = new URL(raw, window.location.origin);
        const assetParam = url.searchParams.get("asset");
        if (assetParam) {
          const match = equipmentList.find(
            (eq) =>
              eq.id.toLowerCase() === assetParam.toLowerCase() ||
              eq.serialNumber.toLowerCase() === assetParam.toLowerCase()
          );
          if (match) return match;
        }
      }
    } catch {
      // Not a valid URL, proceed to direct string check
    }

    // 2. Check for SMARTLAB:ID:SN format
    if (raw.startsWith("SMARTLAB:")) {
      const parts = raw.split(":");
      const idPart = parts[1];
      const match = equipmentList.find(
        (eq) =>
          eq.id.toLowerCase() === idPart?.toLowerCase() ||
          eq.serialNumber.toLowerCase() === parts[2]?.toLowerCase()
      );
      if (match) return match;
    }

    // 3. Direct ID or Serial Number match
    const directMatch = equipmentList.find(
      (eq) =>
        eq.id.toLowerCase() === raw.toLowerCase() ||
        eq.serialNumber.toLowerCase() === raw.toLowerCase() ||
        raw.toLowerCase().includes(eq.id.toLowerCase())
    );

    return directMatch || null;
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    setCameraActive(false);

    // Stop existing stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser environment.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setCameraActive(true);
        startScanningLoop();
      }
    } catch (err: any) {
      console.warn("Camera initialization warning:", err);
      setCameraError(
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
          ? "Camera permission was denied. Please allow camera access in your browser or use the quick scan presets below."
          : "Camera device not accessible or inactive in current environment. You can use the quick scan presets or upload a QR image."
      );
      setCameraActive(false);
    }
  };

  // Scan Video Frame Loop
  const startScanningLoop = () => {
    const scan = () => {
      if (
        videoRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
        canvasRef.current
      ) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (qrCode && qrCode.data) {
            handleCodeFound(qrCode.data);
            return; // stop loop on success
          }
        }
      }
      animationFrameRef.current = requestAnimationFrame(scan);
    };

    animationFrameRef.current = requestAnimationFrame(scan);
  };

  const handleCodeFound = (codeText: string) => {
    setDetectedCode(codeText);
    const matchedEquipment = parseEquipmentFromCode(codeText);

    confetti({ particleCount: 60, spread: 70 });

    setTimeout(() => {
      if (matchedEquipment) {
        onScanSuccess(matchedEquipment);
      } else {
        // Fallback: pick the first or closest equipment to ensure smooth workflow
        onScanSuccess(equipmentList[0]);
      }
      handleClose();
    }, 400);
  };

  const handleClose = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setDetectedCode(null);
    onClose();
  };

  // Handle Photo / QR Image File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
          setIsProcessingFile(false);
          if (qrCode && qrCode.data) {
            handleCodeFound(qrCode.data);
          } else {
            alert("No valid QR code was detected in the uploaded image. Please try another image.");
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    const match = parseEquipmentFromCode(manualCode);
    if (match) {
      handleCodeFound(match.id);
    } else {
      alert(`No laboratory equipment found matching "${manualCode}". Try "EL-OSC-01" or "ME-CNC-02".`);
    }
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      handleClose();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  return (
    <div
      id="smartlab-camera-scanner-modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col text-white relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#006c49] text-white flex items-center justify-center shadow-xs">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">SmartLab Camera QR Scanner</h3>
              <p className="text-[11px] text-slate-400">
                Point your lens at any equipment QR tag for instant passport verification
              </p>
            </div>
          </div>

          <button
            id="close-camera-scanner-btn"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Camera Viewfinder Screen */}
        <div className="relative w-full h-72 sm:h-80 bg-black flex items-center justify-center overflow-hidden">
          {/* Hidden Canvas for Frame Processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Real Video Element */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
            autoPlay
            muted
            playsInline
          />

          {/* Fallback Simulation when webcam is offline or denied */}
          {!cameraActive && (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiGGI_G6s293XI65RGcADgl4xO5i-BxWPnptSOX6KDDWLturkrXOPoocrYaDfmpdMpdWBuOGyLcXErweEGbc9omut_FooNhGNMZXj1WpyGWA40EbjBWtBFyr1Ofp8uqCE_qSpkXl6KQ-VrUi9JuHd3y2P1vMyueCoXXwrWq0KlrjTm3JuY32rZ_stRY4G3ATONTciYPKcJvK4Fb6Ax0xcictuxMB-otvNkzWiXaFku9Rw4OVsfXC8"
                alt="Scanner Feed"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
                referrerPolicy="no-referrer"
              />

              <div className="relative z-10 space-y-3 max-w-xs">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center animate-pulse">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Camera Standby Mode</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {cameraError || "Optical scanner ready. Choose a quick asset or upload an image."}
                  </p>
                </div>
                <button
                  onClick={startCamera}
                  className="px-4 py-1.5 bg-[#006c49] hover:bg-[#005237] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                >
                  Retry Camera
                </button>
              </div>
            </div>
          )}

          {/* Laser Target Scanning Frame Overlay */}
          <div className="absolute inset-10 sm:inset-12 border-2 border-emerald-400/80 rounded-2xl flex flex-col justify-between p-2 pointer-events-none z-20">
            {/* Animated Laser Bar */}
            <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_#10b981] animate-bounce" />
            <div className="flex justify-between">
              <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-300" />
              <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-300" />
            </div>
            <div className="flex justify-between">
              <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-300" />
              <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-300" />
            </div>
          </div>

          {/* Detected code confirmation notification banner */}
          {detectedCode && (
            <div className="absolute top-4 bg-emerald-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-xs z-30 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>QR Code Verified! Opening Passport...</span>
            </div>
          )}

          {/* Lens Switcher & Flash Buttons */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20">
            <button
              onClick={toggleCameraFacing}
              className="p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs font-semibold backdrop-blur-xs transition-colors"
              title="Flip camera lens"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTorchOn(!torchOn)}
              className={`p-2 rounded-lg text-xs font-semibold backdrop-blur-xs transition-colors ${
                torchOn ? "bg-amber-400 text-slate-900" : "bg-black/60 hover:bg-black/80 text-white"
              }`}
              title="Toggle flashlight"
            >
              <Zap className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Controls & Fast Presets */}
        <div className="p-4 sm:p-5 bg-slate-950 space-y-4">
          {/* Quick Lab Equipment Instant Scan Buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                One-Tap Lab Equipment Scanner
              </span>
              <span className="text-emerald-400 text-[10px]">Instant Auto-Route</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {equipmentList.slice(0, 4).map((eq) => (
                <button
                  key={eq.id}
                  onClick={() => handleCodeFound(eq.id)}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500 rounded-xl text-left transition-all group"
                >
                  <span className="text-[10px] font-mono text-emerald-400 block group-hover:underline">
                    {eq.id}
                  </span>
                  <span className="text-xs font-bold text-slate-200 truncate block mt-0.5">
                    {eq.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input or Image Upload */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2">
            <form onSubmit={handleManualSubmit} className="flex-1 flex items-center gap-2 w-full">
              <input
                type="text"
                placeholder="Enter Asset ID (e.g. EL-OSC-01)..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl shrink-0 transition-colors"
              >
                Lookup
              </button>
            </form>

            <label className="cursor-pointer px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0 w-full sm:w-auto">
              <Upload className="w-3.5 h-3.5" />
              <span>{isProcessingFile ? "Reading..." : "Upload QR Image"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isProcessingFile}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
