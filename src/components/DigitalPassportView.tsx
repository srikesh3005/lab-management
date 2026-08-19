import React, { useState } from "react";
import { Equipment } from "../types";
import {
  QrCode,
  Camera,
  RefreshCw,
  Zap,
  Download,
  Edit,
  Wrench,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Activity,
  Maximize2,
} from "lucide-react";

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
    } else {
      alert(`Asset not found for code: "${manualCode}". Try "FG-2023-8942" or "EL-OSC-01".`);
    }
  };

  const triggerAiInspection = () => {
    setAiScanAnalysis("Analyzing optical alignment & sensor noise profiles...");
    setTimeout(() => {
      setAiScanAnalysis(
        `AI Diagnostic: ${selectedEquipment.name} (${selectedEquipment.id}) firmware v2.4.1 verified. No harmonic distortion detected. Calibration certificate valid through Oct 2024.`
      );
    }, 1200);
  };

  return (
    <div id="smartlab-digital-passport-view" className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Digital Equipment Passport
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          NFC & QR-based asset verification, tamper-evident cryptographic logs, and live telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (5 cols): QR Scanner Frame */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#006c49]" />
                <h3 className="font-bold text-sm text-slate-900">Live QR Scanner</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Camera Active
              </span>
            </div>

            {/* Live Camera Viewfinder Simulation */}
            <div className="relative w-full h-64 sm:h-72 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner">
              {/* Background live camera feed image */}
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiGGI_G6s293XI65RGcADgl4xO5i-BxWPnptSOX6KDDWLturkrXOPoocrYaDfmpdMpdWBuOGyLcXErweEGbc9omut_FooNhGNMZXj1WpyGWA40EbjBWtBFyr1Ofp8uqCE_qSpkXl6KQ-VrUi9JuHd3y2P1vMyueCoXXwrWq0KlrjTm3JuY32rZ_stRY4G3ATONTciYPKcJvK4Fb6Ax0xcictuxMB-otvNkzWiXaFku9Rw4OVsfXC8"
                alt="Scanner Feed"
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />

              {/* Viewfinder Target Frame */}
              <div className="absolute inset-8 sm:inset-12 border-2 border-emerald-400/80 rounded-2xl flex flex-col justify-between p-2 pointer-events-none">
                {/* Laser scan line animation */}
                {isScanning && (
                  <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_8px_#10b981] animate-bounce" />
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
                <div className="absolute inset-0 bg-white/20 pointer-events-none transition-opacity" />
              )}
            </div>

            {/* Camera Controls */}
            <div className="flex items-center justify-center gap-3 mt-3">
              <button
                onClick={() => setCameraMode((prev) => (prev === "back" ? "front" : "back"))}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Switch Camera ({cameraMode})</span>
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

          {/* Quick Select Preset QRs */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Scan Presets
            </span>
            <div className="grid grid-cols-2 gap-2">
              {equipmentList.slice(0, 4).map((eq) => (
                <button
                  key={eq.id}
                  onClick={() => onSelectEquipment(eq)}
                  className={`p-2 rounded-lg text-left text-xs border transition-all truncate ${
                    selectedEquipment.id === eq.id
                      ? "bg-emerald-50 border-emerald-400 text-emerald-950 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="font-mono text-[10px] text-slate-400 block">{eq.id}</span>
                  <span className="truncate block font-medium">{eq.name}</span>
                </button>
              ))}
            </div>

            {/* Manual Code Input Form */}
            <form onSubmit={handleManualScan} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Enter Asset ID / Serial..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
              >
                Lookup
              </button>
            </form>
          </div>
        </div>

        {/* Right (7 cols): Passport Preview Card */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            {/* Header */}
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
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            {/* Health & Utilization Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
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
            <div className="space-y-3 pt-5 border-t border-slate-100">
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
    </div>
  );
};
