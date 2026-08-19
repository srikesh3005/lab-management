import React from "react";
import { Sparkles, ArrowRight, CheckCircle2, TrendingUp, Cpu, RefreshCw } from "lucide-react";

interface RecommendationsViewProps {
  onOpenReviewAllocation: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  onOpenReviewAllocation,
  onNavigateToTab,
}) => {
  const recommendations = [
    {
      id: "rec-1",
      title: "Inter-Lab Asset Rebalancing",
      impact: "High Impact (+18% throughput)",
      badgeColor: "bg-purple-100 text-purple-800",
      description:
        "6 equipment items in Mechanical Lab and Bio Lab have utilization below 20%. Reallocating 2 oscilloscopes and 1 3D printer to Fabrication Lab will resolve queue bottlenecks.",
      actionText: "Review Allocation",
      action: onOpenReviewAllocation,
    },
    {
      id: "rec-2",
      title: "Preventive Calibration Cluster",
      impact: "Cost Saving (₹35,000 Saved)",
      badgeColor: "bg-emerald-100 text-emerald-800",
      description:
        "Group calibrations for 4 Rohde & Schwarz and Tektronix spectrum analyzers into a single vendor visit next Tuesday.",
      actionText: "Open Maintenance",
      action: () => onNavigateToTab("maintenance"),
    },
    {
      id: "rec-3",
      title: "Budget Surplus Reinvestment",
      impact: "CapEx Optimization",
      badgeColor: "bg-blue-100 text-blue-800",
      description:
        "FY 23-24 projected headroom is ₹11,80,000. Reinvesting into the proposed Logic Analyzer and Automated Pipetting system unlocks high-throughput genomics research.",
      actionText: "Open Budget Planner",
      action: () => onNavigateToTab("budget_planner"),
    },
  ];

  return (
    <div id="smartlab-recommendations-view" className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            AI Lab Optimization Recommendations
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Automated optimization pipelines analyzing duty cycles, maintenance costs, and queue times.
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2.5">
                <h3 className="font-bold text-base text-slate-900">{rec.title}</h3>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${rec.badgeColor}`}>
                  {rec.impact}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
            </div>

            <button
              onClick={rec.action}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all shrink-0 flex items-center gap-1.5 active:scale-95"
            >
              <span>{rec.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
