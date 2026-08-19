import React, { useState } from "react";
import { Equipment } from "../types";
import {
  ArrowLeft,
  Edit,
  Wrench,
  Sparkles,
  Calendar,
  FileText,
  Download,
  Upload,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Maximize2,
  ExternalLink,
  Shield,
  Info,
} from "lucide-react";

interface EquipmentDetailViewProps {
  equipment: Equipment;
  onBack: () => void;
  onLogMaintenance: (equipment: Equipment) => void;
  onScheduleCalibration: (equipment: Equipment) => void;
  onEditEquipment: (equipment: Equipment) => void;
}

export const EquipmentDetailView: React.FC<EquipmentDetailViewProps> = ({
  equipment,
  onBack,
  onLogMaintenance,
  onScheduleCalibration,
  onEditEquipment,
}) => {
  const [activeTab, setActiveTab] = useState<"usage" | "timeline">("usage");
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [selectedDayUsage, setSelectedDayUsage] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "In Use":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Maintenance":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-red-100 text-red-800 border-red-300";
    }
  };

  return (
    <div id="smartlab-equipment-detail-view" className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            id="detail-back-btn"
            onClick={onBack}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Back to Inventory"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{equipment.name}</h1>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                  equipment.status
                )}`}
              >
                {equipment.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Asset ID: <span className="font-mono font-semibold text-slate-700">{equipment.id}</span>{" "}
              • {equipment.location} {equipment.bench ? `(${equipment.bench})` : ""}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            id="detail-edit-btn"
            onClick={() => onEditEquipment(equipment)}
            className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Edit className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit</span>
          </button>
          <button
            id="detail-log-maintenance-btn"
            onClick={() => onLogMaintenance(equipment)}
            className="px-4 py-2 rounded-lg bg-[#006c49] hover:bg-[#005237] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Log Maintenance</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Top Section: Photo + Vitals & Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Photo Card (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="relative rounded-lg overflow-hidden border border-slate-100 bg-slate-900 h-64 sm:h-72 flex items-center justify-center group">
            <img
              src={equipment.imageUrl}
              alt={equipment.name}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setShowImageZoom(true)}
              className="absolute bottom-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg text-xs backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Zoom</span>
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono">{equipment.serialNumber}</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Digital Passport Active
            </span>
          </div>
        </div>

        {/* Vitals + Specifications (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 3 Vitals Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Health Score */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Health Score</span>
                <span className="text-emerald-600 font-bold text-[11px] bg-emerald-50 px-1.5 py-0.2 rounded">
                  {equipment.healthTrend || "+2%"}
                </span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {equipment.healthScore}
                <span className="text-sm font-normal text-slate-400">/100</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${equipment.healthScore}%` }}
                />
              </div>
            </div>

            {/* Utilization */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Utilization</span>
                <span className="text-slate-400 text-[11px]">30-Day Avg</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{equipment.utilization}%</div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${equipment.utilization}%` }}
                />
              </div>
            </div>

            {/* Remaining Life */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Remaining Life</span>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {equipment.remainingLifeYears}{" "}
                <span className="text-sm font-normal text-slate-400">Years</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Est. replacement 2028</p>
            </div>
          </div>

          {/* Specifications Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Asset Specifications</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3.5 gap-x-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Manufacturer</span>
                <span className="font-semibold text-slate-800">{equipment.manufacturer}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Model</span>
                <span className="font-semibold text-slate-800">{equipment.model}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Serial No</span>
                <span className="font-mono font-semibold text-slate-800">
                  {equipment.serialNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Purchase Date</span>
                <span className="font-semibold text-slate-800">{equipment.purchaseDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Purchase Price</span>
                <span className="font-semibold text-slate-800">{equipment.price}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Warranty</span>
                <span
                  className={`font-semibold ${
                    equipment.warrantyStatus.includes("Active")
                      ? "text-emerald-700"
                      : "text-amber-700"
                  }`}
                >
                  {equipment.warrantyStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Condition Assessment Banner */}
      <div
        id="detail-ai-condition-card"
        className="p-5 rounded-xl bg-gradient-to-r from-purple-50 via-purple-50/70 to-indigo-50 border border-purple-200 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-purple-600 text-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-sm text-purple-950">AI Condition Assessment</h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  equipment.failureRisk === "Low"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : equipment.failureRisk === "Medium"
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                Failure Risk: {equipment.failureRisk}
              </span>
            </div>
            <p className="text-xs text-purple-950/80 leading-relaxed max-w-4xl">
              {equipment.aiAssessment}
            </p>
          </div>

          {/* Action pill */}
          <div className="shrink-0 flex items-center gap-3 bg-white/80 p-3 rounded-lg border border-purple-200">
            <div>
              <div className="text-[11px] font-bold text-purple-900">
                {equipment.recommendation}
              </div>
              <div className="text-[10px] text-slate-500">{equipment.recommendationDue}</div>
            </div>
            <button
              id="detail-schedule-calib-btn"
              onClick={() => onScheduleCalibration(equipment)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95"
            >
              Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Usage Trends / Timeline & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Usage Trends & Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          {/* Tabs header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-bold text-sm text-slate-900">Usage Trends & Maintenance</h3>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setActiveTab("usage")}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === "usage" ? "bg-white text-slate-900 font-bold shadow-xs" : "text-slate-500"
                }`}
              >
                Usage
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === "timeline"
                    ? "bg-white text-slate-900 font-bold shadow-xs"
                    : "text-slate-500"
                }`}
              >
                Timeline
              </button>
            </div>
          </div>

          {activeTab === "usage" ? (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <span>Daily Operational Hours (Mon - Sun)</span>
                <span className="font-medium text-slate-700">
                  Weekly Avg:{" "}
                  {(
                    equipment.weeklyUsage.reduce((acc, curr) => acc + curr.hours, 0) /
                    equipment.weeklyUsage.length
                  ).toFixed(1)}{" "}
                  hrs/day
                </span>
              </div>

              {/* Bar Chart Visualizer */}
              <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
                {equipment.weeklyUsage.map((item) => {
                  const heightPercent = Math.min(100, Math.max(10, item.percentage));
                  const isHovered = selectedDayUsage === item.day;
                  return (
                    <div
                      key={item.day}
                      onMouseEnter={() => setSelectedDayUsage(item.day)}
                      onMouseLeave={() => setSelectedDayUsage(null)}
                      className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                    >
                      <div className="relative w-full flex items-end justify-center h-32">
                        {isHovered && (
                          <div className="absolute -top-7 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-10">
                            {item.hours} hrs
                          </div>
                        )}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                            isHovered
                              ? "bg-[#006c49]"
                              : item.hours > 7
                              ? "bg-[#10B981]"
                              : "bg-emerald-400"
                          }`}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 group-hover:text-slate-900">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>Peak Load: Wednesday & Sunday</span>
                <span className="text-emerald-600 font-medium">Safe Duty Cycle (&lt;10h/day)</span>
              </div>
            </div>
          ) : (
            /* Service History Timeline */
            <div className="space-y-4 py-1">
              {equipment.serviceHistory.map((item) => (
                <div key={item.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{item.title}</span>
                      <span className="text-[11px] text-slate-400">{item.date}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{item.description}</p>
                    {item.technician && (
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Tech: {item.technician}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documents Repository (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-sm text-slate-900">Documents</h3>
              <button
                id="detail-upload-doc-btn"
                onClick={() => alert("Upload dialog initialized.")}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {equipment.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all text-xs group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-slate-800 truncate">{doc.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {doc.size} • {doc.date}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Downloading ${doc.name}...`)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-white rounded transition-colors shrink-0"
                    title="Download document"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>ISO-17025 Compliant Records</span>
            <span className="text-emerald-600 font-semibold">All Verifications Current</span>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {showImageZoom && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-xl max-w-3xl w-full relative">
            <button
              onClick={() => setShowImageZoom(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-900 text-sm font-bold bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
            <h3 className="font-bold text-base mb-2 text-slate-800">{equipment.name}</h3>
            <div className="h-96 w-full bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={equipment.imageUrl}
                alt={equipment.name}
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
