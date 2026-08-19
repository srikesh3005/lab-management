import React from "react";
import { Search, Bell, Sparkles, Filter, ChevronRight } from "lucide-react";
import { TabType, NotificationItem } from "../types";

interface TopHeaderProps {
  currentTab: TabType;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  selectedEquipmentName?: string;
  onNavigateToTab: (tab: TabType) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  searchQuery,
  onSearchChange,
  notifications,
  onOpenNotifications,
  onOpenProfile,
  selectedEquipmentName,
  onNavigateToTab,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getBreadcrumbTitle = () => {
    switch (currentTab) {
      case "dashboard":
        return "Dashboard Overview";
      case "equipment":
        return "Equipment Inventory";
      case "equipment_detail":
        return selectedEquipmentName || "Equipment Profile";
      case "utilization":
        return "Utilization Analytics";
      case "budget_planner":
        return "Capital Budget Planner";
      case "life_prediction":
        return "Remaining Life Prediction";
      case "equipment_health":
        return "Fleet Condition & Health";
      case "digital_passport":
        return "Digital Equipment Passport";
      case "maintenance":
        return "Preventive Maintenance";
      case "ai_assistant":
        return "SmartLab AI Assistant";
      case "recommendations":
        return "Lab Optimization Recommendations";
      case "reports":
        return "Compliance & Audit Reports";
      default:
        return "SmartLab";
    }
  };

  return (
    <header
      id="smartlab-top-header"
      className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40"
    >
      {/* Left: Breadcrumb / Title */}
      <div className="flex items-center gap-2">
        <button
          id="header-home-crumb"
          onClick={() => onNavigateToTab("dashboard")}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          SmartLab
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        {currentTab === "equipment_detail" ? (
          <>
            <button
              id="header-equipment-crumb"
              onClick={() => onNavigateToTab("equipment")}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Equipment
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">
              {selectedEquipmentName}
            </span>
          </>
        ) : (
          <span className="text-xs font-bold text-slate-900">
            {getBreadcrumbTitle()}
          </span>
        )}
      </div>

      {/* Center/Right: Search Bar & Actions */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <div className="relative w-48 sm:w-64 md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search equipment, models, serials..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* AI Assistant Quick Pill */}
        <button
          id="header-ai-quick-btn"
          onClick={() => onNavigateToTab("ai_assistant")}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-semibold border border-purple-200/60 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
          <span>Ask AI</span>
        </button>

        {/* Notifications Button */}
        <button
          id="header-notifications-btn"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span
              id="notifications-badge"
              className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce"
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* User profile avatar */}
        <button
          id="header-user-avatar-btn"
          onClick={onOpenProfile}
          className="flex items-center gap-2 pl-2 border-l border-slate-200"
          title="Admin Profile"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-500/30 bg-emerald-50 shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBR8VHgLxkoBh9GJGGJ--NMHYe6JVVNCw2xvw1dy9XoTIZciOZUJG0a8_5VoDwBVSk28rTuztnAQ-XTR4Q_Rc1fdCEC8Yx8c697MAEUlgvsi4rxHx7x6gcpvMN1K-kGMTrvmSxGTKm_oQrgAR2VEL2IPnRn4LJlduf234kcFyTzX3LDC6xugzKBQxa7572ZQ9FDf9eMwALSV2OI6mqqq1J_s5zgf-OLJHUJwq6HgR6ruI-PWGjXg98"
              alt="Admin Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-tight">
              Dr. Aris Thorne
            </span>
            <span className="text-[10px] text-slate-500 leading-tight">
              Lab Director
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
