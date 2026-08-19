import React, { useState, useMemo } from "react";
import { Equipment } from "../types";
import { Plus, Filter, Search, RotateCcw, ChevronRight, Activity, Calendar, MapPin } from "lucide-react";

interface EquipmentInventoryViewProps {
  equipmentList: Equipment[];
  onSelectEquipment: (eq: Equipment) => void;
  onOpenAddEquipment: () => void;
  globalSearchQuery: string;
}

export const EquipmentInventoryView: React.FC<EquipmentInventoryViewProps> = ({
  equipmentList,
  onSelectEquipment,
  onOpenAddEquipment,
  globalSearchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [selectedHealth, setSelectedHealth] = useState<string>("All");
  const [selectedUtilization, setSelectedUtilization] = useState<string>("All");
  const [localSearch, setLocalSearch] = useState<string>("");

  const filteredEquipment = useMemo(() => {
    return equipmentList.filter((eq) => {
      const searchEffective = (globalSearchQuery || localSearch).toLowerCase().trim();
      if (searchEffective) {
        const matchesName = eq.name.toLowerCase().includes(searchEffective);
        const matchesId = eq.id.toLowerCase().includes(searchEffective);
        const matchesModel = eq.model.toLowerCase().includes(searchEffective);
        const matchesLoc = eq.location.toLowerCase().includes(searchEffective);
        const matchesMfr = eq.manufacturer.toLowerCase().includes(searchEffective);
        if (!matchesName && !matchesId && !matchesModel && !matchesLoc && !matchesMfr) {
          return false;
        }
      }

      if (selectedCategory !== "All" && eq.category !== selectedCategory) {
        return false;
      }
      if (selectedStatus !== "All" && eq.status !== selectedStatus) {
        return false;
      }
      if (selectedLocation !== "All" && eq.location !== selectedLocation) {
        return false;
      }
      if (selectedHealth === ">90" && eq.healthScore < 90) return false;
      if (selectedHealth === "70-90" && (eq.healthScore < 70 || eq.healthScore >= 90)) return false;
      if (selectedHealth === "<70" && eq.healthScore >= 70) return false;

      if (selectedUtilization === "high" && eq.utilization < 80) return false;
      if (selectedUtilization === "medium" && (eq.utilization < 40 || eq.utilization >= 80))
        return false;
      if (selectedUtilization === "low" && eq.utilization >= 40) return false;

      return true;
    });
  }, [
    equipmentList,
    globalSearchQuery,
    localSearch,
    selectedCategory,
    selectedStatus,
    selectedLocation,
    selectedHealth,
    selectedUtilization,
  ]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedStatus("All");
    setSelectedLocation("All");
    setSelectedHealth("All");
    setSelectedUtilization("All");
    setLocalSearch("");
  };

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedStatus !== "All" ||
    selectedLocation !== "All" ||
    selectedHealth !== "All" ||
    selectedUtilization !== "All" ||
    Boolean(localSearch);

  return (
    <div id="smartlab-equipment-inventory-view" className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Equipment Inventory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking {equipmentList.length} physical assets across all specialized labs.
          </p>
        </div>
        <button
          id="inventory-add-equipment-btn"
          onClick={onOpenAddEquipment}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#006c49] hover:bg-[#005237] text-white font-semibold text-xs rounded-lg shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Equipment</span>
        </button>
      </div>

      {/* 5 Dropdown Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter Assets</span>
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Category */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Category
            </label>
            <select
              id="filter-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Rotary">Rotary</option>
              <option value="Optics">Optics</option>
              <option value="Prototyping">Prototyping</option>
              <option value="Biotech">Biotech</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Status
            </label>
            <select
              id="filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available (Healthy)</option>
              <option value="In Use">In Use</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Fault">Fault</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Location
            </label>
            <select
              id="filter-location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Locations</option>
              <option value="Electronics Lab">Electronics Lab</option>
              <option value="Fabrication Lab">Fabrication Lab</option>
              <option value="Main Lab A">Main Lab A</option>
              <option value="Main Lab B">Main Lab B</option>
              <option value="Cleanroom 1">Cleanroom 1</option>
              <option value="Bio Lab A">Bio Lab A</option>
            </select>
          </div>

          {/* Health Score */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Health Score
            </label>
            <select
              id="filter-health"
              value={selectedHealth}
              onChange={(e) => setSelectedHealth(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">Any Score</option>
              <option value=">90">&gt; 90% (Optimal)</option>
              <option value="70-90">70% - 90% (Good)</option>
              <option value="<70">&lt; 70% (Attention)</option>
            </select>
          </div>

          {/* Utilization */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Utilization
            </label>
            <select
              id="filter-utilization"
              value={selectedUtilization}
              onChange={(e) => setSelectedUtilization(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">Any Utilization</option>
              <option value="high">High (&gt;80%)</option>
              <option value="medium">Medium (40-80%)</option>
              <option value="low">Low (&lt;40%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Equipment Cards Grid */}
      {filteredEquipment.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
          <p className="text-slate-500 text-sm">No equipment matched your filters.</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-emerald-50 text-[#006c49] font-bold text-xs rounded-lg hover:bg-emerald-100 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredEquipment.map((eq) => {
            const isFault = eq.status === "Fault";
            const isMaint = eq.status === "Maintenance";
            const isAvailable = eq.status === "Available";

            return (
              <div
                key={eq.id}
                id={`equipment-card-${eq.id}`}
                onClick={() => onSelectEquipment(eq)}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Card top banner */}
                  <div className="h-36 w-full bg-slate-100 relative overflow-hidden border-b border-slate-100">
                    <img
                      src={eq.imageUrl}
                      alt={eq.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                          isAvailable
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : eq.status === "In Use"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : isMaint
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-red-100 text-red-800 border border-red-300"
                        }`}
                      >
                        {eq.status}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      {eq.id}
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-4 space-y-2.5">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#006c49] transition-colors line-clamp-1">
                        {eq.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{eq.location}</span>
                      </p>
                    </div>

                    {/* Utilization Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Utilization</span>
                        <span className="font-semibold text-slate-700">{eq.utilization}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            eq.utilization > 80
                              ? "bg-blue-500"
                              : eq.utilization > 30
                              ? "bg-emerald-500"
                              : "bg-slate-300"
                          }`}
                          style={{ width: `${eq.utilization}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer info */}
                <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span
                      className={`text-[11px] font-medium ${
                        eq.nextMaintenanceDate === "Overdue"
                          ? "text-red-600 font-bold"
                          : eq.nextMaintenanceDate === "Today"
                          ? "text-amber-600 font-bold"
                          : "text-slate-500"
                      }`}
                    >
                      {eq.nextMaintenanceDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 font-bold text-slate-800 text-[11px]">
                    <Activity className="w-3 h-3 text-emerald-600" />
                    <span>{eq.healthScore}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
