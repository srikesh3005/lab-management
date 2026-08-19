import React from "react";
import { Equipment } from "../types";
import { Wrench, Calendar, Clock, AlertTriangle, CheckCircle2, User, Plus } from "lucide-react";

interface MaintenanceViewProps {
  equipmentList: Equipment[];
  onSelectEquipment: (eq: Equipment) => void;
  onLogMaintenance: (eq: Equipment) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  equipmentList,
  onSelectEquipment,
  onLogMaintenance,
}) => {
  return (
    <div id="smartlab-maintenance-view" className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Preventive Maintenance & Calibrations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Work order tracking, ISO-17025 calibration cycles, and technician dispatch records.
          </p>
        </div>
      </div>

      {/* Maintenance schedule list */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Upcoming Work Orders & Calibrations</h3>
          <span className="text-xs text-slate-400">Next 30 Days</span>
        </div>

        <div className="divide-y divide-slate-100">
          {equipmentList.map((eq) => (
            <div
              key={eq.id}
              className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    eq.status === "Fault"
                      ? "bg-red-100 text-red-700"
                      : eq.status === "Maintenance"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">{eq.name}</h4>
                    <span className="text-xs font-mono text-slate-400">({eq.id})</span>
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
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {eq.location} • Recommendation:{" "}
                    <span className="font-medium text-slate-700">{eq.recommendation}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Scheduled Target
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      eq.nextMaintenanceDate === "Overdue"
                        ? "text-red-600"
                        : eq.nextMaintenanceDate === "Today"
                        ? "text-amber-600"
                        : "text-slate-800"
                    }`}
                  >
                    {eq.nextMaintenanceDate}
                  </span>
                </div>

                <button
                  onClick={() => onLogMaintenance(eq)}
                  className="px-3 py-1.5 bg-[#006c49] hover:bg-[#005237] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95"
                >
                  Log Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
