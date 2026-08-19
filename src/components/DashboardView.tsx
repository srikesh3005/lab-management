import React from "react";
import { Equipment, TabType } from "../types";
import {
  Download,
  ArrowRight,
  Sparkles,
  Activity,
  Layers,
  CheckCircle2,
  PlayCircle,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Cpu,
} from "lucide-react";

interface DashboardViewProps {
  equipmentList: Equipment[];
  onSelectEquipment: (eq: Equipment) => void;
  onNavigateToTab: (tab: TabType) => void;
  onOpenExportReport: () => void;
  onOpenReviewAllocation: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  equipmentList,
  onSelectEquipment,
  onNavigateToTab,
  onOpenExportReport,
  onOpenReviewAllocation,
}) => {
  // Key quick access items
  const quickAccessItems = equipmentList.slice(0, 4);

  return (
    <div id="smartlab-dashboard-view" className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, Admin
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's the current operational status of your laboratory equipment.
          </p>
        </div>
        <button
          id="dashboard-export-report-btn"
          onClick={onOpenExportReport}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg shadow-sm transition-all active:scale-98"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Report</span>
        </button>
      </div>

      {/* 4 Bento Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Equipment */}
        <div
          id="kpi-total-equipment"
          onClick={() => onNavigateToTab("equipment")}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Equipment</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition-colors">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">342</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">100% Tracked</span>
            <span>across 6 labs</span>
          </div>
        </div>

        {/* Card 2: Available */}
        <div
          id="kpi-available"
          onClick={() => onNavigateToTab("equipment")}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Available</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">224</div>
          <div className="text-xs text-emerald-600 mt-1 font-semibold">
            65% of Total <span className="text-slate-400 font-normal">• Ready for use</span>
          </div>
        </div>

        {/* Card 3: In Use */}
        <div
          id="kpi-in-use"
          onClick={() => onNavigateToTab("utilization")}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">In Use</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <PlayCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">86</div>
          <div className="text-xs text-blue-600 mt-1 font-semibold">
            25% of Total <span className="text-slate-400 font-normal">• Active sessions</span>
          </div>
        </div>

        {/* Card 4: Under Maintenance */}
        <div
          id="kpi-maintenance"
          onClick={() => onNavigateToTab("maintenance")}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-amber-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Under Maintenance</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">12</div>
          <div className="text-xs text-amber-600 mt-1 font-semibold">
            Critical <span className="text-slate-400 font-normal">• 4 overdue calibrations</span>
          </div>
        </div>
      </div>

      {/* Main Row: Quick Access & AI/Network Health Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quick Access */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Quick Access</h2>
            <button
              id="dashboard-view-all-equipment-link"
              onClick={() => onNavigateToTab("equipment")}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickAccessItems.map((item) => (
              <div
                key={item.id}
                id={`quick-access-${item.id}`}
                onClick={() => onSelectEquipment(item)}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Image banner */}
                  <div className="h-32 w-full bg-slate-100 rounded-lg overflow-hidden relative mb-3 border border-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                          item.status === "Available"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                            : item.status === "In Use"
                            ? "bg-blue-100 text-blue-700 border border-blue-300"
                            : item.status === "Maintenance"
                            ? "bg-amber-100 text-amber-700 border border-amber-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                      {item.name}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">{item.id}</span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    {item.location} {item.bench ? `• ${item.bench}` : ""}
                  </p>
                </div>

                {/* Footer vitals */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Health Score</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.healthScore >= 90
                          ? "bg-emerald-500"
                          : item.healthScore >= 70
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span>{item.healthScore}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: AI Insights & Network Health */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <div
            id="dashboard-ai-insights-card"
            className="p-5 rounded-xl bg-gradient-to-br from-purple-50 via-purple-50/50 to-indigo-50 border border-purple-200/80 shadow-sm relative overflow-hidden"
          >
            <div className="flex items-center gap-2 text-purple-800 font-bold text-sm mb-3">
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>AI Insights</span>
            </div>

            <p className="text-xs text-purple-950/80 leading-relaxed">
              6 equipment items have utilization below 20% this week. Consider reallocating
              resources from Mechanical Lab to Fabrication Lab to maximize research throughput.
            </p>

            <div className="mt-4 pt-3 border-t border-purple-200/60 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-purple-700">Optimization opportunity</span>
              <button
                id="dashboard-review-allocation-btn"
                onClick={onOpenReviewAllocation}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 flex items-center gap-1"
              >
                <span>Review Allocation</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Network Health Circular Gauge Card */}
          <div
            id="dashboard-network-health-card"
            onClick={() => onNavigateToTab("equipment_health")}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Fleet Health Index</h3>
                <p className="text-xs text-slate-500">Live aggregated telemetry</p>
              </div>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="flex items-center justify-center py-2">
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* SVG Gauge */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-100"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-[#10B981]"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - 0.87)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">87</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Score / 100
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Optimal Condition
              </span>
              <span className="text-slate-400 hover:text-slate-600 font-medium">
                View fleet metrics &rarr;
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
