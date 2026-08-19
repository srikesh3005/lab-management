import React from "react";
import { Equipment } from "../types";
import { Activity, AlertTriangle, TrendingDown, Clock, ShieldAlert, CheckCircle2 } from "lucide-react";

interface LifePredictionViewProps {
  equipmentList: Equipment[];
  onSelectEquipment: (eq: Equipment) => void;
}

export const LifePredictionView: React.FC<LifePredictionViewProps> = ({
  equipmentList,
  onSelectEquipment,
}) => {
  return (
    <div id="smartlab-life-prediction-view" className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Remaining Life Prediction Engine
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Predictive Weibull reliability modeling and component degradation analysis.
        </p>
      </div>

      {/* Summary Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Fleet Average Remaining Life
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">4.1 Years</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            +0.4 yrs extended by preventive maintenance
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Retirement Candidates (&lt; 2 Yrs)
          </span>
          <div className="text-3xl font-extrabold text-amber-600 mt-2">18 Units</div>
          <span className="text-xs text-slate-400 mt-1 block">Scheduled for phased renewal</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Critical Risk Assets
          </span>
          <div className="text-3xl font-extrabold text-red-600 mt-2">3 Units</div>
          <span className="text-xs text-red-600 font-semibold mt-1 block">Immediate overhaul needed</span>
        </div>
      </div>

      {/* Equipment Lifespan Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Lifespan Degradation Matrix</h3>
          <span className="text-xs text-slate-400">Ranked by lowest remaining life</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="px-5 py-3">Asset & ID</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Health</th>
                <th className="px-4 py-3">Remaining Life</th>
                <th className="px-4 py-3">Failure Risk</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {equipmentList
                .slice()
                .sort((a, b) => a.remainingLifeYears - b.remainingLifeYears)
                .map((eq) => (
                  <tr key={eq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{eq.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{eq.id}</div>
                    </td>
                    <td className="px-4 py-3.5 font-medium">{eq.category}</td>
                    <td className="px-4 py-3.5">{eq.location}</td>
                    <td className="px-4 py-3.5 font-bold">
                      <span
                        className={
                          eq.healthScore > 85
                            ? "text-emerald-600"
                            : eq.healthScore > 65
                            ? "text-amber-600"
                            : "text-red-600"
                        }
                      >
                        {eq.healthScore}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-slate-900">
                      {eq.remainingLifeYears} Years
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          eq.failureRisk === "Low"
                            ? "bg-emerald-100 text-emerald-800"
                            : eq.failureRisk === "Medium"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {eq.failureRisk}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => onSelectEquipment(eq)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-md transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
