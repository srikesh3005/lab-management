import React, { useState, useRef } from "react";
import { Equipment } from "../types";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
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
  Share2,
  Copy,
  ExternalLink,
  Check,
  Tag,
  ShieldCheck,
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
  const [cameraMode, setCameraMode] = useState<"front" | "back">("back");
  const [manualCode, setManualCode] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const [aiScanAnalysis, setAiScanAnalysis] = useState<string | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [activeTab, setActiveTab] = useState<"passport" | "qr_badge">("passport");

  const qrCanvasRef = useRef<HTMLDivElement>(null);

  // Generate unique URL payload for the physical asset QR tag
  const qrPayload = typeof window !== "undefined"
    ? `${window.location.origin}/?asset=${encodeURIComponent(selectedEquipment.id)}&sn=${encodeURIComponent(selectedEquipment.serialNumber)}`
    : `https://smartlab.internal/asset/${selectedEquipment.id}`;

  const handleManualScan = (e: React.FormEvent) => {
    e.preventDefault();
    const found = equipmentList.find(
      (eq) =>
        eq.id.toLowerCase() === manualCode.trim().toLowerCase() ||
        eq.serialNumber.toLowerCase() === manualCode.trim().toLowerCase()
    );
    if (found) {
      onSelectEquipment(found);
      setManualCode("");
      confetti({ particleCount: 30, spread: 45 });
    } else {
      alert(`Asset not found for code: "${manualCode}". Try "${equipmentList[0]?.id}" or "${equipmentList[1]?.id}".`);
    }
  };

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

  const handlePrintBadge = () => {
    window.print();
  };

  return (
    <div id="smartlab-digital-passport-view" className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-[#006c49]" />
            <span>Digital Equipment Passport & QR Engine</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic QR generator, optical camera scanner, and ISO-17025 verification certificates.
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
        {/* Left (5 cols): QR Scanner Frame & Quick Select */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#006c49]" />
                <h3 className="font-bold text-sm text-slate-900">Lab Optical Scanner</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Camera Active
              </span>
            </div>

            {/* Live Camera Viewfinder Simulation */}
            <div className="relative w-full h-60 sm:h-64 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiGGI_G6s293XI65RGcADgl4xO5i-BxWPnptSOX6KDDWLturkrXOPoocrYaDfmpdMpdWBuOGyLcXErweEGbc9omut_FooNhGNMZXj1WpyGWA40EbjBWtBFyr1Ofp8uqCE_qSpkXl6KQ-VrUi9JuHd3y2P1vMyueCoXXwrWq0KlrjTm3JuY32rZ_stRY4G3ATONTciYPKcJvK4Fb6Ax0xcictuxMB-otvNkzWiXaFku9Rw4OVsfXC8"
                alt="Scanner Feed"
                className="w-full h-full object-cover opacity-50"
                referrerPolicy="no-referrer"
              />

              {/* Viewfinder Target Frame */}
              <div className="absolute inset-8 sm:inset-10 border-2 border-emerald-400/80 rounded-2xl flex flex-col justify-between p-2 pointer-events-none">
                {/* Laser scan line animation */}
                {isScanning && (
                  <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_10px_#10b981] animate-bounce" />
                )}
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-300" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-300" />
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-300" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-300" />
                </div>
              </div>

              {/* Flashlight indicator overlay */}
              {flashlightOn && (
                <div className="absolute inset-0 bg-white/30 pointer-events-none transition-opacity" />
              )}

              {/* Hover overlay hint */}
              <div className="absolute bottom-2 text-[10px] text-white/80 bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                Point camera at equipment QR sticker
              </div>
            </div>

            {/* Camera Controls */}
            <div className="flex items-center justify-center gap-2.5 mt-3">
              <button
                onClick={() => setCameraMode((prev) => (prev === "back" ? "front" : "back"))}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Lens ({cameraMode})</span>
              </button>
              <button
                onClick={() => setFlashlightOn(!flashlightOn)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  flashlightOn
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{flashlightOn ? "Flash On" : "Flash Off"}</span>
              </button>
            </div>
          </div>

          {/* Quick Select & Live QR Generator for all lab equipment */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Lab Inventory QR Quick Scan
              </span>
              <span className="text-[10px] text-slate-400">Click to load</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {equipmentList.slice(0, 4).map((eq) => {
                const isSelected = selectedEquipment.id === eq.id;
                return (
                  <button
                    key={eq.id}
                    onClick={() => {
                      onSelectEquipment(eq);
                      confetti({ particleCount: 25, spread: 35 });
                    }}
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

            {/* Manual Code Input Form */}
            <form onSubmit={handleManualScan} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Enter Asset ID / Serial (e.g. FG-2023-8942)..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
              >
                Scan Code
              </button>
            </form>
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
              {/* Background watermark badge pattern */}
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
