import React from "react";
import { Equipment } from "../types";
import { ShieldCheck, Activity, AlertTriangle, CheckCircle2, Zap, MapPin } from "lucide-react";

interface EquipmentHealthViewProps {
  equipmentList: Equipment[];
  onSelectEquipment: (eq: Equipment) => void;
}

export const EquipmentHealthView: React.FC<EquipmentHealthViewProps> = ({
  equipmentList,
  onSelectEquipment,
}) => {
  return (
    <div id="smartlab-equipment-health-view" className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Fleet Health & Condition Telemetry
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time sensor telemetry, thermal monitoring, power consumption, and calibration drift.
        </p>
      </div>

      {/* Fleet telemetry metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
            Overall Fleet Index
          </span>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">87 / 100</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Within nominal safety range</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
            Thermal Anomalies
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">0 Detected</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            All enclosures &lt; 38°C
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
            Power Stability
          </span>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">99.8%</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Clean sine wave delivery</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
            Calibrations Due
          </span>
          <div className="text-3xl font-extrabold text-amber-600 mt-2">4 Instruments</div>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Action in 15 days</span>
        </div>
      </div>

      {/* Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {equipmentList.map((eq) => (
          <div
            key={eq.id}
            onClick={() => onSelectEquipment(eq)}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{eq.name}</h4>
                <span className="text-xs font-mono text-slate-400">{eq.id}</span>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  eq.healthScore > 85
                    ? "bg-emerald-100 text-emerald-800"
                    : eq.healthScore > 65
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {eq.healthScore}% Health
              </span>
            </div>

            {/* Health Bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    eq.healthScore > 85
                      ? "bg-emerald-500"
                      : eq.healthScore > 65
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${eq.healthScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" />
                  {eq.location}
                </span>
                <span>{eq.healthTrend || "Stable"}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 line-clamp-2">
              {eq.aiAssessment}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
