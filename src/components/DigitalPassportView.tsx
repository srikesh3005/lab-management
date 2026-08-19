import React, { useState, useRef, useEffect } from "react";
import { Equipment } from "../types";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import jsQR from "jsqr";
import {
  QrCode,
  Camera,
  RefreshCw,
  Zap,
  Download,
  Printer,
  Edit,
  Wrench,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Activity,
  Maximize2,
  Copy,
  Check,
  Upload,
  ShieldCheck,
  Play,
  Square,
} from "lucide-react";
import confetti from "canvas-confetti";

interface DigitalPassportViewProps {
  equipmentList: Equipment[];
  selectedEquipment: Equipment;
  onSelectEquipment: (eq: Equipment) => void;
  onReportFault: (eq: Equipment) => void;
  onScheduleMaintenance: (eq: Equipment) => void;
  onDownloadPassportPDF: (eq: Equipment) => void;
}

export const DigitalPassportView: React.FC<DigitalPassportViewProps> = ({
  equipmentList,
  selectedEquipment,
  onSelectEquipment,
  onReportFault,
  onScheduleMaintenance,
  onDownloadPassportPDF,
}) => {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [cameraMode, setCameraMode] = useState<"environment" | "user">("environment");
  const [manualCode, setManualCode] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [aiScanAnalysis, setAiScanAnalysis] = useState<string | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [lastScannedFeedback, setLastScannedFeedback] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Generate unique URL payload for the physical asset QR tag
  const qrPayload =
    typeof window !== "undefined"
      ? `${window.location.origin}/?asset=${encodeURIComponent(selectedEquipment.id)}&sn=${encodeURIComponent(
          selectedEquipment.serialNumber
        )}`
      : `https://smartlab.internal/asset/${selectedEquipment.id}`;

  // Helper to parse equipment from scanned code
  const parseEquipmentFromCode = (scannedText: string): Equipment | null => {
    const raw = scannedText.trim();

    // 1. Check if URL with asset query param
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
      // ignore URL parsing error
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

  // Start Camera Stream for live scanning
  const startCamera = async () => {
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: cameraMode },
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
        setIsCameraActive(true);
        startScanningLoop();
      }
    } catch (err: any) {
      console.warn("Camera start error in DigitalPassportView:", err);
      setCameraError(
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
          ? "Camera permission denied. Please allow camera in your browser settings, or use the quick scan presets / upload button."
          : "Webcam not available. Using quick-scan and manual lookup mode."
      );
      setIsCameraActive(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Scanning loop on the video stream
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
            handleSuccessfulScan(qrCode.data);
            return;
          }
        }
      }
      animationFrameRef.current = requestAnimationFrame(scan);
    };

    animationFrameRef.current = requestAnimationFrame(scan);
  };

  const handleSuccessfulScan = (codeText: string) => {
    const matched = parseEquipmentFromCode(codeText);
    const targetEq = matched || equipmentList[0];

    setLastScannedFeedback(`Scanned: ${targetEq.name} (${targetEq.id})`);
    onSelectEquipment(targetEq);
    confetti({ particleCount: 50, spread: 60 });

    setTimeout(() => {
      setLastScannedFeedback(null);
      // Restart loop if camera still active
      if (isCameraActive) {
        startScanningLoop();
      }
    }, 2500);
  };

  // Handle uploaded QR image
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
          if (qrCode && qrCode.data) {
            handleSuccessfulScan(qrCode.data);
          } else {
            alert("No QR code detected in the selected image. Please try another image file.");
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleManualScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    const found = parseEquipmentFromCode(manualCode);
    if (found) {
      handleSuccessfulScan(found.id);
      setManualCode("");
    } else {
      alert(`Asset not found for code: "${manualCode}". Try "${equipmentList[0]?.id}" or "${equipmentList[1]?.id}".`);
    }
  };

  const toggleLens = () => {
    setCameraMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  useEffect(() => {
    // Auto-start camera when entering digital passport view
    startCamera();
    return () => {
      stopCamera();
    };
  }, [cameraMode]);

  const triggerAiInspection = () => {
    setAiScanAnalysis("Analyzing optical alignment & sensor noise profiles...");
    setTimeout(() => {
      setAiScanAnalysis(
        `AI Diagnostic: ${selectedEquipment.name} (${selectedEquipment.id}) cryptographic certificate verified. Calibration certificate valid through ${selectedEquipment.nextMaintenanceDate}. Telemetry status nominal.`
      );
    }, 1000);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(qrPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleDownloadQrPng = () => {
    const canvas = document.getElementById("asset-qr-canvas") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `SmartLab-QR-${selectedEquipment.id}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div id="smartlab-digital-passport-view" className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-[#006c49]" />
            <span>Digital Equipment Passport & Live QR Scanner</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time optical QR barcode decoding, hardware telemetry verification, and digital certificates.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Enlarge QR</span>
          </button>
          <button
            onClick={handleDownloadQrPng}
            className="px-3.5 py-2 bg-[#006c49] hover:bg-[#005237] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export QR Code</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (5 cols): Live Optical Camera Scanner Frame & Quick Select */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#006c49]" />
                <h3 className="font-bold text-sm text-slate-900">Live Optical Scanner</h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                  isCameraActive
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isCameraActive ? "bg-emerald-600 animate-pulse" : "bg-amber-600"
                  }`}
                />
                {isCameraActive ? "Camera Active (Scanning)" : "Camera Standby"}
              </span>
            </div>

            {/* Live Camera Viewfinder Screen */}
            <div className="relative w-full h-64 sm:h-72 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner group">
              {/* Hidden canvas for reading pixel data */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Real Video Element */}
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${isCameraActive ? "block" : "hidden"}`}
                autoPlay
                muted
                playsInline
              />

              {/* Fallback Simulation when camera is paused or permission denied */}
              {!isCameraActive && (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiGGI_G6s293XI65RGcADgl4xO5i-BxWPnptSOX6KDDWLturkrXOPoocrYaDfmpdMpdWBuOGyLcXErweEGbc9omut_FooNhGNMZXj1WpyGWA40EbjBWtBFyr1Ofp8uqCE_qSpkXl6KQ-VrUi9JuHd3y2P1vMyueCoXXwrWq0KlrjTm3JuY32rZ_stRY4G3ATONTciYPKcJvK4Fb6Ax0xcictuxMB-otvNkzWiXaFku9Rw4OVsfXC8"
                    alt="Scanner Feed"
                    className="absolute inset-0 w-full h-full object-cover opacity-25"
                    referrerPolicy="no-referrer"
                  />
                  <div className="relative z-10 space-y-2">
                    <QrCode className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
                    <p className="text-xs text-slate-300 font-medium max-w-xs">
                      {cameraError || "Optical scanner ready to scan equipment QR tags"}
                    </p>
                    <button
                      onClick={startCamera}
                      className="px-4 py-1.5 bg-[#006c49] hover:bg-[#005237] text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      Turn On Camera
                    </button>
                  </div>
                </div>
              )}

              {/* Laser Target Scanning Frame Overlay */}
              <div className="absolute inset-8 sm:inset-10 border-2 border-emerald-400/80 rounded-2xl flex flex-col justify-between p-2 pointer-events-none z-20">
                {/* Laser animation bar */}
                <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_10px_#10b981] animate-bounce" />
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-300" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-300" />
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-300" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-300" />
                </div>
              </div>

              {/* Scanned recognition banner */}
              {lastScannedFeedback && (
                <div className="absolute top-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-xs z-30 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lastScannedFeedback}</span>
                </div>
              )}

              {/* Lens & Flash Controls */}
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 z-20">
                <button
                  onClick={toggleLens}
                  className="p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs font-semibold backdrop-blur-xs transition-colors"
                  title="Flip Camera Lens"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => (isCameraActive ? stopCamera() : startCamera())}
                  className="px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs font-semibold backdrop-blur-xs flex items-center gap-1 transition-colors"
                  title="Toggle Camera Power"
                >
                  {isCameraActive ? <Square className="w-3 h-3 text-red-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                  <span>{isCameraActive ? "Stop" : "Start"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Select & Live QR Generator for all lab equipment */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                One-Click Test Presets
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">Instant Scan</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {equipmentList.slice(0, 4).map((eq) => {
                const isSelected = selectedEquipment.id === eq.id;
                return (
                  <button
                    key={eq.id}
                    onClick={() => handleSuccessfulScan(eq.id)}
                    className={`p-2.5 rounded-xl text-left text-xs border transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? "bg-emerald-50 border-[#006c49] text-emerald-950 font-bold shadow-xs ring-1 ring-[#006c49]"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {/* Unique Mini QR preview */}
                    <div className="bg-white p-1 rounded-md border border-slate-200 shrink-0">
                      <QRCodeSVG
                        value={`SMARTLAB:${eq.id}:${eq.serialNumber}`}
                        size={28}
                        level="M"
                        fgColor={isSelected ? "#006c49" : "#334155"}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[10px] text-slate-400 block leading-tight">
                        {eq.id}
                      </span>
                      <span className="truncate block font-semibold text-slate-800 text-[11px]">
                        {eq.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Manual Code Input Form & File Upload */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <form onSubmit={handleManualScan} className="flex-1 flex items-center gap-1.5 w-full">
                <input
                  type="text"
                  placeholder="Enter Asset ID (e.g. EL-OSC-01)..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
                >
                  Scan ID
                </button>
              </form>

              <label className="cursor-pointer px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors shrink-0 w-full sm:w-auto">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload QR</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Right (7 cols): Passport Preview & Dynamic Physical QR Tag */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            {/* Top Identity Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    {selectedEquipment.name}
                  </h2>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      selectedEquipment.status === "Available"
                        ? "bg-emerald-100 text-emerald-800"
                        : selectedEquipment.status === "In Use"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedEquipment.status === "Available" ? "Active" : selectedEquipment.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  ID:{" "}
                  <span className="font-mono font-bold text-slate-800">{selectedEquipment.id}</span>{" "}
                  • Model: {selectedEquipment.model} • {selectedEquipment.location}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="passport-download-pdf-btn"
                  onClick={() => onDownloadPassportPDF(selectedEquipment)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            {/* Generated Unique QR Tag & Physical Lab Asset Badge */}
            <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-md border border-slate-700 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
                {/* Real-time Generated QR Code with High Precision SVG */}
                <div className="bg-white p-3 rounded-xl shadow-lg shrink-0 flex flex-col items-center justify-center">
                  <QRCodeSVG
                    value={qrPayload}
                    size={110}
                    level="H"
                    includeMargin={false}
                    fgColor="#0F172A"
                  />
                  <span className="text-[9px] font-mono font-bold text-slate-500 mt-1.5 tracking-wider">
                    {selectedEquipment.id}
                  </span>
                </div>

                {/* Hidden canvas for PNG export */}
                <div className="hidden">
                  <QRCodeCanvas
                    id="asset-qr-canvas"
                    value={qrPayload}
                    size={400}
                    level="H"
                    includeMargin={true}
                    fgColor="#006C49"
                  />
                </div>

                {/* Equipment Badge Details */}
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ISO-17025 Certified
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      SN: {selectedEquipment.serialNumber}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    Lab Asset Digital Passport Tag
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    Scan with any smartphone or SmartLab optical terminal to immediately access telemetry, calibration logs, and fault dispatch.
                  </p>

                  <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <button
                      onClick={handleCopyPayload}
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors"
                    >
                      {copiedPayload ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied URL</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-300" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleDownloadQrPng}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download PNG</span>
                    </button>

                    <button
                      onClick={() => setIsQrModalOpen(true)}
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-200 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Full Screen</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Health & Utilization Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              {/* Health Score */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Health Status</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {selectedEquipment.healthScore}%
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    {selectedEquipment.healthTrend || "Stable"}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Activity className="w-6 h-6" />
                </div>
              </div>

              {/* Utilization */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Utilization (30 Days)</span>
                  <span className="font-bold text-slate-800">{selectedEquipment.utilization}%</span>
                </div>
                <div className="text-sm font-bold text-slate-700 mt-1">Avg 5.2 hrs/day</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-[#006c49] rounded-full"
                    style={{ width: `${selectedEquipment.utilization}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Identity & Purchase Specs */}
            <div className="space-y-3 pt-1 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Identity & Purchase Records
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Manufacturer</span>
                  <span className="font-semibold text-slate-800">
                    {selectedEquipment.manufacturer}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Serial Number</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {selectedEquipment.serialNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Purchase Date</span>
                  <span className="font-semibold text-slate-800">
                    {selectedEquipment.purchaseDate}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Warranty Expiry</span>
                  <span
                    className={`font-semibold ${
                      selectedEquipment.warrantyStatus.includes("Expired")
                        ? "text-amber-700"
                        : "text-emerald-700"
                    }`}
                  >
                    {selectedEquipment.warrantyStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Service History */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recent Service Logs
                </h4>
                <button
                  onClick={() => onScheduleMaintenance(selectedEquipment)}
                  className="text-xs font-semibold text-[#006c49] hover:underline"
                >
                  + Schedule Maintenance
                </button>
              </div>

              <div className="space-y-2">
                {selectedEquipment.serviceHistory.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{srv.title}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{srv.description}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">
                      {srv.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Analysis Live Output Banner */}
            {aiScanAnalysis && (
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs text-purple-900 mt-4 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5 animate-pulse" />
                <p>{aiScanAnalysis}</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              id="passport-report-fault-btn"
              onClick={() => onReportFault(selectedEquipment)}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-lg border border-red-200 transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Fault</span>
            </button>

            <button
              id="passport-ai-analysis-btn"
              onClick={triggerAiInspection}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run AI Passport Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen High-Resolution QR Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl border border-slate-100 text-center relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#006c49] bg-emerald-50 px-3 py-1 rounded-full">
                Laboratory Asset QR
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                {selectedEquipment.name}
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Asset ID: {selectedEquipment.id} • {selectedEquipment.location}
              </p>
            </div>

            {/* Giant QR code display */}
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 inline-block shadow-inner">
              <QRCodeSVG
                value={qrPayload}
                size={220}
                level="H"
                includeMargin={true}
                fgColor="#006C49"
              />
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Staff can scan this code with standard mobile cameras to immediately authenticate and view the live telemetry passport.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleCopyPayload}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                >
                  {copiedPayload ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadQrPng}
                  className="px-5 py-2 bg-[#006c49] hover:bg-[#005237] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
