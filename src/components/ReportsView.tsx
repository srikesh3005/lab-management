import React from "react";
import { FileText, Download, CheckCircle2, Shield, Calendar } from "lucide-react";

interface ReportsViewProps {
  onOpenExportReport: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onOpenExportReport }) => {
  const reports = [
    {
      id: "rep-1",
      title: "Q3 Laboratory Asset & Equipment Audit",
      date: "Aug 15, 2024",
      size: "1.8 MB PDF",
      status: "Verified",
    },
    {
      id: "rep-2",
      title: "ISO-17025 Calibration Traceability Report",
      date: "Jul 30, 2024",
      size: "3.2 MB PDF",
      status: "Compliant",
    },
    {
      id: "rep-3",
      title: "Equipment Lifespan & Depreciated Value Ledger",
      date: "Jun 30, 2024",
      size: "950 KB CSV",
      status: "Audited",
    },
  ];

  return (
    <div id="smartlab-reports-view" className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Compliance & Audit Reports</h1>
          <p className="text-xs text-slate-500 mt-1">
            Exportable compliance dossiers, traceability certificates, and inventory snapshots.
          </p>
        </div>

        <button
          onClick={onOpenExportReport}
          className="px-4 py-2 bg-[#006c49] hover:bg-[#005237] text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Generate Custom Report</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006c49] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{rep.title}</h4>
                <span className="text-xs text-slate-400">
                  {rep.date} • {rep.size}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                {rep.status}
              </span>
              <button
                onClick={() => alert(`Downloading ${rep.title}...`)}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
