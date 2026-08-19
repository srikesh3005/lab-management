import React, { useState } from "react";
import { Equipment } from "../types";
import {
  TrendingUp,
  Activity,
  AlertTriangle,
  Clock,
  ArrowRight,
  Filter,
  Layers,
  Sparkles,
  Zap,
  Building,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

interface UtilizationViewProps {
  equipmentList: Equipment[];
  onSelectEquipment: (eq: Equipment) => void;
  onOpenReallocation: () => void;
}

export const UtilizationView: React.FC<UtilizationViewProps> = ({
  equipmentList,
  onSelectEquipment,
  onOpenReallocation,
}) => {
  const [selectedLabFilter, setSelectedLabFilter] = useState<string>("All");

  // Lab department summaries
  const labUtilizationStats = [
    {
      name: "Fabrication Lab",
      utilization: 88,
      status: "High Congestion",
      queueTime: "1.4 hrs avg wait",
      color: "bg-red-500",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
      assetCount: 14,
    },
    {
      name: "Electronics Lab",
      utilization: 72,
      status: "Optimal",
      queueTime: "15 min wait",
      color: "bg-[#006c49]",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
      assetCount: 28,
    },
    {
      name: "Optics Suite",
      utilization: 65,
      status: "Nominal",
      queueTime: "No queue",
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
      assetCount: 12,
    },
    {
      name: "Biotech Lab A",
      utilization: 38,
      status: "Underutilized",
      queueTime: "Excess capacity",
      color: "bg-amber-500",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      assetCount: 18,
    },
  ];

  // Hourly duty cycle mock for a typical lab day
  const hourlyPeakHeatmap = [
    { hour: "08:00", load: 20 },
    { hour: "09:00", load: 45 },
    { hour: "10:00", load: 85 },
    { hour: "11:00", load: 92 },
    { hour: "12:00", load: 60 },
    { hour: "13:00", load: 50 },
    { hour: "14:00", load: 95 },
    { hour: "15:00", load: 88 },
    { hour: "16:00", load: 78 },
    { hour: "17:00", load: 64 },
    { hour: "18:00", load: 30 },
  ];

  const filteredEquipment = equipmentList.filter((eq) => {
    if (selectedLabFilter === "All") return true;
    return eq.location.toLowerCase().includes(selectedLabFilter.toLowerCase());
  });

  const underutilizedAssets = equipmentList.filter((eq) => eq.utilization < 30);
  const overutilizedAssets = equipmentList.filter((eq) => eq.utilization >= 75);

  return (
    <div id="smartlab-utilization-view" className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-[#006c49]" />
            <span>Equipment Utilization & Duty Cycle Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time bench occupancy, inter-lab queue bottlenecks, and AI load balancing.
          </p>
        </div>

        <button
          onClick={onOpenReallocation}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Rebalance Allocation</span>
        </button>
      </div>

      {/* Top 4 Key Utilization Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Fleet Average Duty Cycle
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">64.2%</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            +4.8% vs last month
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Peak Lab Congestion
          </span>
          <div className="text-3xl font-extrabold text-red-600 mt-2">14:00 - 16:00</div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Fabrication Lab at 95% capacity
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Underutilized Assets (&lt; 30%)
          </span>
          <div className="text-3xl font-extrabold text-amber-600 mt-2">
            {underutilizedAssets.length} Units
          </div>
          <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
            Ready for cross-lab sharing
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            High Demand Assets (&gt; 75%)
          </span>
          <div className="text-3xl font-extrabold text-[#006c49] mt-2">
            {overutilizedAssets.length} Units
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Require preventive checks</span>
        </div>
      </div>

      {/* Lab Facilities Breakdown & Hourly Load Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Lab Capacity Cards */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Lab Department Utilization</h3>
              <p className="text-xs text-slate-400">Current real-time duty cycle & wait queues</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">4 Active Facilities</span>
          </div>

          <div className="space-y-3.5">
            {labUtilizationStats.map((lab) => (
              <div
                key={lab.name}
                className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-sm text-slate-900">{lab.name}</span>
                    <span className="text-[11px] text-slate-400">({lab.assetCount} assets)</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${lab.bgColor} ${lab.textColor}`}
                  >
                    {lab.status} • {lab.queueTime}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Capacity Occupancy</span>
                    <span>{lab.utilization}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${lab.color}`}
                      style={{ width: `${lab.utilization}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (5 cols): Hourly Peak Load Chart */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-sm text-slate-900">Hourly Bench Load Profile</h3>
              <span className="text-xs text-slate-400 font-mono">Today</span>
            </div>
            <p className="text-xs text-slate-500">
              Aggregated lab equipment concurrent power & runtime duty cycles.
            </p>

            {/* Vertical Bar Heatmap */}
            <div className="mt-6 flex items-end justify-between gap-1.5 h-44 pt-4 border-b border-slate-200">
              {hourlyPeakHeatmap.map((item) => {
                const isHigh = item.load >= 80;
                const isMed = item.load >= 50 && item.load < 80;
                return (
                  <div
                    key={item.hour}
                    className="flex-1 flex flex-col items-center gap-1 group relative"
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-20">
                      {item.load}% Load
                    </div>

                    <div className="w-full bg-slate-100 rounded-t-md h-36 flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          isHigh
                            ? "bg-red-500 group-hover:bg-red-600"
                            : isMed
                            ? "bg-[#006c49] group-hover:bg-emerald-700"
                            : "bg-blue-400 group-hover:bg-blue-500"
                        }`}
                        style={{ height: `${item.load}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 block -rotate-45 sm:rotate-0 mt-1">
                      {item.hour.slice(0, 2)}h
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-start gap-2.5 text-xs text-purple-900">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">AI Scheduling Optimization:</span>
              <span>
                Shift 3 scheduled high-temperature annealing jobs to 08:00–10:00 to reduce afternoon queue by 34%.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Asset-by-Asset Utilization Table with Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-3 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Individual Asset Utilization Ledger</h3>
            <p className="text-xs text-slate-500">Track runtime hours, idle periods, and weekly usage patterns</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Filter Lab:</span>
            <select
              value={selectedLabFilter}
              onChange={(e) => setSelectedLabFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Laboratories</option>
              <option value="Electronics">Electronics Lab</option>
              <option value="Fabrication">Fabrication Lab</option>
              <option value="Bio">Bio Lab A</option>
              <option value="Cleanroom">Cleanroom 1</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3">Asset & ID</th>
                <th className="px-3 py-3">Location & Bench</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">30-Day Duty Cycle</th>
                <th className="px-3 py-3">Avg Daily Runtime</th>
                <th className="px-3 py-3">AI Allocation Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEquipment.map((eq) => {
                const isUnder = eq.utilization < 30;
                const isOver = eq.utilization >= 75;
                return (
                  <tr key={eq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{eq.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{eq.id}</div>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="font-medium text-slate-800">{eq.location}</div>
                      <div className="text-[11px] text-slate-400">{eq.bench}</div>
                    </td>
                    <td className="px-3 py-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          eq.status === "Available"
                            ? "bg-emerald-50 text-emerald-700"
                            : eq.status === "In Use"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {eq.status}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isUnder
                                ? "bg-amber-500"
                                : isOver
                                ? "bg-red-500"
                                : "bg-[#006c49]"
                            }`}
                            style={{ width: `${eq.utilization}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-800">{eq.utilization}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 font-medium">
                      {(eq.utilization * 0.08).toFixed(1)} hrs / day
                    </td>
                    <td className="px-3 py-3.5">
                      {isUnder ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Reallocation Candidate
                        </span>
                      ) : isOver ? (
                        <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          High Duty Load
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Balanced
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => onSelectEquipment(eq)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-md transition-colors"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
