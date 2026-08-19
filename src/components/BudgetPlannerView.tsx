import React, { useState } from "react";
import { BudgetOverview, ProposedPurchase } from "../types";
import {
  Wallet,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Check,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import confetti from "canvas-confetti";

interface BudgetPlannerViewProps {
  budgetData: BudgetOverview;
  proposedPurchases: ProposedPurchase[];
  onApprovePurchase: (id: string) => void;
  onApplyAIRecommendation: () => void;
  onAddPurchaseProposal: () => void;
}

export const BudgetPlannerView: React.FC<BudgetPlannerViewProps> = ({
  budgetData,
  proposedPurchases,
  onApprovePurchase,
  onApplyAIRecommendation,
  onAddPurchaseProposal,
}) => {
  const [selectedQuarter, setSelectedQuarter] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState(false);

  const handleApply = () => {
    setIsApplied(true);
    onApplyAIRecommendation();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div id="smartlab-budget-planner-view" className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Capital Budget Planner</h1>
          <p className="text-xs text-slate-500 mt-1">
            Predictive financial modeling, equipment procurement forecasts, and utilization ROI.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddPurchaseProposal}
            className="px-4 py-2 bg-[#006c49] hover:bg-[#005237] text-white font-semibold text-xs rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Purchase Proposal</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Bento Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006c49] flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">{budgetData.fiscalYear}</h2>
              <span className="text-[11px] text-slate-400">Audited Ledger Summary</span>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
            {budgetData.yoyGrowth}
          </span>
        </div>

        {/* 3 Metric Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Allocated */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
              Total Allocated Budget
            </span>
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1.5">
              {budgetData.totalAllocatedFormatted}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Approved by Financial Board</span>
            </div>
          </div>

          {/* Current Spending */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Current Spending
              </span>
              <span className="text-xs font-bold text-slate-700">
                {budgetData.spendingPercentage}%
              </span>
            </div>
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1.5">
              {budgetData.currentSpendingFormatted}
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full"
                style={{ width: `${budgetData.spendingPercentage}%` }}
              />
            </div>
          </div>

          {/* Remaining */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
              Remaining Headroom
            </span>
            <div className="text-2xl lg:text-3xl font-extrabold text-emerald-700 mt-1.5">
              {budgetData.remainingFormatted}
            </div>
            <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>On track for fiscal surplus</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Cols: Previous-Year Trends & AI Predictive Model */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Quarterly Spending Trends Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Previous-Year Spending Trends</h3>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-slate-300" />
                <span className="text-slate-500 font-medium">FY 22-23</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#006c49]" />
                <span className="text-slate-700 font-bold">FY 23-24</span>
              </div>
            </div>
          </div>

          {/* Visual Bar Comparison */}
          <div className="pt-4 pb-2 space-y-4">
            <div className="grid grid-cols-4 gap-4 h-48 items-end border-b border-slate-100 pb-3">
              {["Q1", "Q2", "Q3", "Q4"].map((quarter, idx) => {
                const q1Amount = budgetData.quarterlySpending[0].quarters[idx].amount;
                const q2Amount = budgetData.quarterlySpending[1].quarters[idx].amount;
                const maxAmount = 900000;
                const h1 = (q1Amount / maxAmount) * 100;
                const h2 = (q2Amount / maxAmount) * 100;

                return (
                  <div key={quarter} className="flex flex-col items-center gap-2 h-full justify-end">
                    <div className="flex items-end gap-2 h-36 w-full justify-center">
                      {/* FY 22-23 Bar */}
                      <div
                        style={{ height: `${h1}%` }}
                        className="w-4 sm:w-6 bg-slate-300 hover:bg-slate-400 rounded-t transition-all cursor-pointer relative group"
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {budgetData.quarterlySpending[0].quarters[idx].formatted}
                        </div>
                      </div>
                      {/* FY 23-24 Bar */}
                      <div
                        style={{ height: `${h2}%` }}
                        className="w-4 sm:w-6 bg-[#006c49] hover:bg-[#059669] rounded-t transition-all cursor-pointer relative group"
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {budgetData.quarterlySpending[1].quarters[idx].formatted}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-700">{quarter}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Q4 spending spike caused by year-end optical sensor procurement</span>
              <span className="text-slate-600 font-semibold">Q1-Q3 variance &lt; 8%</span>
            </div>
          </div>
        </div>

        {/* Right (5 cols): AI Predictive Model */}
        <div className="lg:col-span-5 bg-gradient-to-br from-purple-50 via-purple-50/50 to-indigo-50 p-6 rounded-2xl border border-purple-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-purple-950">AI Predictive Model</h3>
                  <span className="text-[11px] text-purple-700">Forecasting FY 2024-2025</span>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 bg-purple-200/80 text-purple-800 rounded-full">
                {budgetData.aiConfidence}% Confidence
              </span>
            </div>

            <div className="bg-white/80 p-4 rounded-xl border border-purple-200/70 mb-4">
              <span className="text-xs text-purple-900 font-medium block">
                Recommended Next-Year Budget
              </span>
              <div className="text-3xl font-black text-purple-950 mt-1">
                {budgetData.recommendedBudgetFormatted}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block">
                Model Rationale
              </span>
              <p className="text-xs text-purple-950/80 leading-relaxed italic bg-purple-100/40 p-3 rounded-lg border border-purple-200/40">
                {budgetData.reasoning}
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-purple-200/70 flex items-center justify-between">
            <span className="text-[11px] text-purple-700 font-medium">
              {isApplied ? "Applied to draft ledger" : "Requires director signoff"}
            </span>
            <button
              id="budget-apply-recommendation-btn"
              onClick={handleApply}
              disabled={isApplied}
              className={`px-4 py-2 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 ${
                isApplied
                  ? "bg-emerald-600 text-white cursor-default"
                  : "bg-purple-600 hover:bg-purple-700 text-white active:scale-95"
              }`}
            >
              {isApplied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Recommendation Applied</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply Recommendation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Proposed Purchases Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Proposed Purchases</h3>
            <p className="text-xs text-slate-500">
              High-impact procurement proposals ranked by AI utilization urgency.
            </p>
          </div>
          <button
            onClick={onAddPurchaseProposal}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Proposal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {proposedPurchases.map((prop) => {
            const isApproved = prop.status === "Approved";
            return (
              <div
                key={prop.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        prop.priority === "High"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {prop.priority} Priority
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">{prop.cost}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-2">{prop.name}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{prop.reason}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    Status: <span className="text-slate-700 font-semibold">{prop.status}</span>
                  </span>
                  {!isApproved ? (
                    <button
                      onClick={() => onApprovePurchase(prop.id)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md shadow-xs transition-all active:scale-95"
                    >
                      Approve
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Approved
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
