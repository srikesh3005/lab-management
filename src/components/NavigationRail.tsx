import React from "react";
import { TabType } from "../types";
import {
  LayoutDashboard,
  Microscope,
  TrendingUp,
  Wallet,
  Activity,
  ShieldCheck,
  QrCode,
  Wrench,
  Bot,
  Sparkles,
  FileText,
  Bell,
  Settings,
  User,
  Plus,
} from "lucide-react";

interface NavigationRailProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenAddEquipment: () => void;
  onOpenProfile: () => void;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddEquipment,
  onOpenProfile,
}) => {
  const mainNavItems = [
    { id: "dashboard" as TabType, label: "Dashboard", icon: LayoutDashboard },
    { id: "equipment" as TabType, label: "Equipment", icon: Microscope },
    { id: "utilization" as TabType, label: "Utilization", icon: TrendingUp },
    { id: "budget_planner" as TabType, label: "Budget Planner", icon: Wallet },
    { id: "life_prediction" as TabType, label: "Life Prediction", icon: Activity },
    { id: "equipment_health" as TabType, label: "Equipment Health", icon: ShieldCheck },
    { id: "digital_passport" as TabType, label: "Digital Passport", icon: QrCode },
    { id: "maintenance" as TabType, label: "Maintenance", icon: Wrench },
    { id: "ai_assistant" as TabType, label: "AI Assistant", icon: Bot, isAi: true },
    { id: "recommendations" as TabType, label: "Recommendations", icon: Sparkles },
    { id: "reports" as TabType, label: "Reports", icon: FileText },
  ];

  return (
    <aside
      id="smartlab-sidebar"
      className="fixed left-0 top-0 h-screen flex flex-row z-50 bg-white border-r border-slate-200"
    >
      {/* 64px Dark Emerald Rail */}
      <div className="w-[64px] h-full bg-[#006c49] flex flex-col items-center py-5 justify-between shrink-0 shadow-sm">
        <div className="flex flex-col items-center gap-5 w-full">
          {/* Logo */}
          <button
            id="rail-logo-btn"
            onClick={() => onSelectTab("dashboard")}
            className="w-10 h-10 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 flex items-center justify-center transition-transform hover:scale-105"
            title="SmartLab"
          >
            <div className="w-8 h-8 flex items-center justify-center font-bold text-white text-xl">
              S
            </div>
          </button>

          {/* Primary Top Icons */}
          <div className="flex flex-col gap-2 w-full items-center">
            <button
              id="rail-nav-dashboard"
              onClick={() => onSelectTab("dashboard")}
              className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all ${
                currentTab === "dashboard"
                  ? "text-[#10B981] bg-white/10 font-bold border-l-4 border-[#10B981]"
                  : "text-emerald-100/70 hover:text-white hover:bg-white/5"
              }`}
              title="Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>

            <button
              id="rail-nav-equipment"
              onClick={() => onSelectTab("equipment")}
              className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all ${
                currentTab === "equipment" || currentTab === "equipment_detail"
                  ? "text-[#10B981] bg-white/10 font-bold border-l-4 border-[#10B981]"
                  : "text-emerald-100/70 hover:text-white hover:bg-white/5"
              }`}
              title="Equipment"
            >
              <Microscope className="w-5 h-5" />
            </button>

            <button
              id="rail-nav-utilization"
              onClick={() => onSelectTab("utilization")}
              className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all ${
                currentTab === "utilization"
                  ? "text-[#10B981] bg-white/10 font-bold border-l-4 border-[#10B981]"
                  : "text-emerald-100/70 hover:text-white hover:bg-white/5"
              }`}
              title="Utilization"
            >
              <TrendingUp className="w-5 h-5" />
            </button>

            <button
              id="rail-nav-budget"
              onClick={() => onSelectTab("budget_planner")}
              className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all ${
                currentTab === "budget_planner"
                  ? "text-[#10B981] bg-white/10 font-bold border-l-4 border-[#10B981]"
                  : "text-emerald-100/70 hover:text-white hover:bg-white/5"
              }`}
              title="Budget Planner"
            >
              <Wallet className="w-5 h-5" />
            </button>

            <button
              id="rail-nav-passport"
              onClick={() => onSelectTab("digital_passport")}
              className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all ${
                currentTab === "digital_passport"
                  ? "text-[#10B981] bg-white/10 font-bold border-l-4 border-[#10B981]"
                  : "text-emerald-100/70 hover:text-white hover:bg-white/5"
              }`}
              title="Digital Passport"
            >
              <QrCode className="w-5 h-5" />
            </button>

            <button
              id="rail-nav-ai"
              onClick={() => onSelectTab("ai_assistant")}
              className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all ${
                currentTab === "ai_assistant"
                  ? "text-purple-300 bg-white/10 font-bold border-l-4 border-purple-400"
                  : "text-purple-200/70 hover:text-purple-200 hover:bg-purple-900/30"
              }`}
              title="AI Assistant"
            >
              <Bot className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Rail Icons */}
        <div className="flex flex-col gap-3 w-full items-center">
          <button
            id="rail-nav-notifications"
            onClick={() => onSelectTab("notifications")}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-emerald-100/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
            id="rail-nav-settings"
            onClick={() => onSelectTab("settings")}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-emerald-100/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            id="rail-nav-profile"
            onClick={onOpenProfile}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border border-white/20 transition-all"
            title="Admin Profile"
          >
            <User className="w-5 h-5 text-emerald-100" />
          </button>
        </div>
      </div>

      {/* 176px Contextual Sidebar (Desktop only) */}
      <div className="w-[176px] md:w-[190px] bg-white border-r border-slate-200 py-6 px-3 flex flex-col justify-between hidden md:flex">
        <div>
          {/* Brand header */}
          <div className="mb-6 px-2">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">SmartLab</h1>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Equipment Management
            </p>
          </div>

          {/* Add Equipment Action Button */}
          <button
            id="sidebar-add-equipment-btn"
            onClick={onOpenAddEquipment}
            className="w-full bg-[#10B981] hover:bg-[#059669] text-white rounded-lg py-2 px-3 flex items-center justify-center gap-2 mb-6 font-semibold text-xs transition-all shadow-sm active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Equipment</span>
          </button>

          {/* Nav link items */}
          <div className="flex flex-col gap-1">
            {mainNavItems.map((item) => {
              const isActive =
                currentTab === item.id ||
                (item.id === "equipment" && currentTab === "equipment_detail");
              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                    isActive
                      ? "bg-emerald-50 text-[#006c49] font-bold border-l-4 border-[#006c49]"
                      : item.isAi
                      ? "text-purple-700 hover:bg-purple-50 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {item.isAi && <Sparkles className="w-3.5 h-3.5 text-purple-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Admin profile footer pill */}
        <div className="border-t border-slate-100 pt-3">
          <button
            id="sidebar-admin-footer-btn"
            onClick={onOpenProfile}
            className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 text-xs transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#006c49] flex items-center justify-center font-bold text-[10px]">
              AD
            </div>
            <span className="truncate font-medium">Admin Profile</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
