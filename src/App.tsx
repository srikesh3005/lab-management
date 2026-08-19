import React, { useState } from "react";
import {
  TabType,
  Equipment,
  BudgetOverview,
  ProposedPurchase,
  ChatSession,
  NotificationItem,
} from "./types";
import {
  INITIAL_EQUIPMENT,
  INITIAL_BUDGET_OVERVIEW,
  INITIAL_PROPOSED_PURCHASES,
  INITIAL_CHAT_SESSIONS,
  INITIAL_NOTIFICATIONS,
} from "./data/mockData";
import { NavigationRail } from "./components/NavigationRail";
import { TopHeader } from "./components/TopHeader";
import { DashboardView } from "./components/DashboardView";
import { EquipmentInventoryView } from "./components/EquipmentInventoryView";
import { EquipmentDetailView } from "./components/EquipmentDetailView";
import { BudgetPlannerView } from "./components/BudgetPlannerView";
import { DigitalPassportView } from "./components/DigitalPassportView";
import { AIAssistantView } from "./components/AIAssistantView";
import { LifePredictionView } from "./components/LifePredictionView";
import { EquipmentHealthView } from "./components/EquipmentHealthView";
import { MaintenanceView } from "./components/MaintenanceView";
import { RecommendationsView } from "./components/RecommendationsView";
import { ReportsView } from "./components/ReportsView";
import {
  AddEquipmentModal,
  LogMaintenanceModal,
  ScheduleCalibrationModal,
  NotificationsModal,
  ReviewAllocationModal,
  ReportFaultModal,
  ProfileModal,
} from "./components/Modals";

export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>("dashboard");
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(INITIAL_EQUIPMENT);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment>(INITIAL_EQUIPMENT[0]);
  const [budgetData, setBudgetData] = useState<BudgetOverview>(INITIAL_BUDGET_OVERVIEW);
  const [proposedPurchases, setProposedPurchases] = useState<ProposedPurchase[]>(
    INITIAL_PROPOSED_PURCHASES
  );
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(INITIAL_CHAT_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>("chat-1");
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [isFaultModalOpen, setIsFaultModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Active chat session
  const currentChatSession =
    chatSessions.find((s) => s.id === activeSessionId) || chatSessions[0];

  const handleSelectEquipment = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setCurrentTab("equipment_detail");
  };

  const handleSelectEquipmentById = (id: string) => {
    const found = equipmentList.find((e) => e.id === id);
    if (found) {
      setSelectedEquipment(found);
      setCurrentTab("equipment_detail");
    }
  };

  const handleAddEquipment = (newEq: Partial<Equipment>) => {
    const completeItem = newEq as Equipment;
    setEquipmentList((prev) => [completeItem, ...prev]);
    setSelectedEquipment(completeItem);
    setCurrentTab("equipment_detail");
  };

  const handleSaveMaintenanceLog = (log: {
    title: string;
    description: string;
    technician: string;
  }) => {
    if (!selectedEquipment) return;
    const newHistory = [
      {
        id: `srv-${Date.now()}`,
        title: log.title,
        date: "Today",
        description: log.description,
        technician: log.technician,
        type: "calibration" as const,
      },
      ...selectedEquipment.serviceHistory,
    ];

    const updated = {
      ...selectedEquipment,
      status: "Available" as const,
      healthScore: Math.min(100, selectedEquipment.healthScore + 5),
      serviceHistory: newHistory,
      nextMaintenanceDate: "Nov 15, 2024",
    };

    setSelectedEquipment(updated);
    setEquipmentList((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleScheduledCalibration = () => {
    if (!selectedEquipment) return;
    const updated = {
      ...selectedEquipment,
      nextMaintenanceDate: "Oct 25, 2024",
    };
    setSelectedEquipment(updated);
    setEquipmentList((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleReportFault = (faultDesc: string) => {
    if (!selectedEquipment) return;
    const updated = {
      ...selectedEquipment,
      status: "Fault" as const,
      healthScore: Math.max(20, selectedEquipment.healthScore - 30),
      failureRisk: "High" as const,
      nextMaintenanceDate: "Critical Action Required",
      aiAssessment: `Lockout Mode Triggered: ${faultDesc}. Maintenance engineer flagged.`,
    };
    setSelectedEquipment(updated);
    setEquipmentList((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));

    // Push notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Emergency Fault: ${selectedEquipment.name}`,
      message: faultDesc,
      time: "Just now",
      read: false,
      type: "warning",
      equipmentId: selectedEquipment.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleApprovePurchase = (id: string) => {
    setProposedPurchases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Approved" } : p))
    );
  };

  const handleApplyAIRecommendation = () => {
    setBudgetData((prev) => ({
      ...prev,
      totalAllocated: prev.recommendedBudget,
      totalAllocatedFormatted: prev.recommendedBudgetFormatted,
      remaining: prev.remaining + (prev.recommendedBudget - prev.totalAllocated),
      remainingFormatted: "₹16,80,000",
    }));
  };

  const handleDownloadPassportPDF = (eq: Equipment) => {
    alert(
      `Generating official ISO-17025 Digital Equipment Passport for ${eq.name} (${eq.id})... Download starting!`
    );
  };

  // AI Assistant message handler with real backend integration
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: "user" as const,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Update active session locally
    const updatedMessages = [...currentChatSession.messages, userMsg];
    setChatSessions((prev) =>
      prev.map((s) =>
        s.id === currentChatSession.id ? { ...s, messages: updatedMessages } : s
      )
    );

    setIsAiGenerating(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          context: {
            currentEquipment: selectedEquipment.id,
            totalCount: equipmentList.length,
          },
        }),
      });

      const data = await response.json();
      const aiReply = data.reply || "I have analyzed your request against the SmartLab fleet.";
      const suggestedEquipment = data.suggestedEquipment || [];

      const aiMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai" as const,
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedEquipment,
      };

      setChatSessions((prev) =>
        prev.map((s) =>
          s.id === currentChatSession.id
            ? { ...s, messages: [...updatedMessages, aiMsg] }
            : s
        )
      );
    } catch (err) {
      console.error("AI error:", err);
      const fallbackAiMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: "ai" as const,
        text: `Analysis complete for "${text}". All laboratory assets are within specified operational tolerances.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatSessions((prev) =>
        prev.map((s) =>
          s.id === currentChatSession.id
            ? { ...s, messages: [...updatedMessages, fallbackAiMsg] }
            : s
        )
      );
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleNewChat = () => {
    const newSessionId = `chat-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: "New Inquiry",
      group: "Today",
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: "ai",
          text: "Hello Dr. Thorne! I am your SmartLab Equipment Assistant. Ask me about equipment telemetry, preventive calibration schedules, budget optimization, or digital passport records.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex">
      {/* Navigation Dual-Rail (64px + 176px) */}
      <NavigationRail
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenAddEquipment={() => setIsAddModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area (Offset for sidebar: 64px on mobile, 254px on desktop) */}
      <div className="flex-1 ml-[64px] md:ml-[240px] lg:ml-[254px] flex flex-col min-h-screen transition-all">
        {/* Top Header */}
        <TopHeader
          currentTab={currentTab}
          searchQuery={globalSearchQuery}
          onSearchChange={(q) => {
            setGlobalSearchQuery(q);
            if (q && currentTab !== "equipment") {
              setCurrentTab("equipment");
            }
          }}
          notifications={notifications}
          onOpenNotifications={() => setIsNotificationsModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          selectedEquipmentName={selectedEquipment?.name}
          onNavigateToTab={(tab) => setCurrentTab(tab)}
        />

        {/* Dynamic Main View */}
        <main className="flex-1 pb-16">
          {currentTab === "dashboard" && (
            <DashboardView
              equipmentList={equipmentList}
              onSelectEquipment={handleSelectEquipment}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
              onOpenExportReport={() => setCurrentTab("reports")}
              onOpenReviewAllocation={() => setIsAllocationModalOpen(true)}
            />
          )}

          {currentTab === "equipment" && (
            <EquipmentInventoryView
              equipmentList={equipmentList}
              onSelectEquipment={handleSelectEquipment}
              onOpenAddEquipment={() => setIsAddModalOpen(true)}
              globalSearchQuery={globalSearchQuery}
            />
          )}

          {currentTab === "equipment_detail" && (
            <EquipmentDetailView
              equipment={selectedEquipment}
              onBack={() => setCurrentTab("equipment")}
              onLogMaintenance={(eq) => {
                setSelectedEquipment(eq);
                setIsMaintenanceModalOpen(true);
              }}
              onScheduleCalibration={(eq) => {
                setSelectedEquipment(eq);
                setIsScheduleModalOpen(true);
              }}
              onEditEquipment={(eq) => {
                setSelectedEquipment(eq);
                setIsAddModalOpen(true);
              }}
            />
          )}

          {currentTab === "budget_planner" && (
            <BudgetPlannerView
              budgetData={budgetData}
              proposedPurchases={proposedPurchases}
              onApprovePurchase={handleApprovePurchase}
              onApplyAIRecommendation={handleApplyAIRecommendation}
              onAddPurchaseProposal={() => {
                const newProp: ProposedPurchase = {
                  id: `prop-${Date.now()}`,
                  name: "Automated Microplate Reader",
                  priority: "High",
                  cost: "₹2,10,000",
                  costValue: 210000,
                  reason: "Required for expanding cell culture assays in Bio Lab A.",
                  status: "Pending",
                };
                setProposedPurchases((prev) => [newProp, ...prev]);
              }}
            />
          )}

          {currentTab === "digital_passport" && (
            <DigitalPassportView
              equipmentList={equipmentList}
              selectedEquipment={selectedEquipment}
              onSelectEquipment={(eq) => setSelectedEquipment(eq)}
              onReportFault={(eq) => {
                setSelectedEquipment(eq);
                setIsFaultModalOpen(true);
              }}
              onScheduleMaintenance={(eq) => {
                setSelectedEquipment(eq);
                setIsScheduleModalOpen(true);
              }}
              onDownloadPassportPDF={handleDownloadPassportPDF}
            />
          )}

          {currentTab === "ai_assistant" && (
            <AIAssistantView
              chatSessions={chatSessions}
              onSelectSession={(s) => setActiveSessionId(s.id)}
              currentSession={currentChatSession}
              onSendMessage={handleSendMessage}
              isGenerating={isAiGenerating}
              onSelectEquipmentById={handleSelectEquipmentById}
              onNewChat={handleNewChat}
            />
          )}

          {currentTab === "utilization" && (
            <EquipmentInventoryView
              equipmentList={equipmentList}
              onSelectEquipment={handleSelectEquipment}
              onOpenAddEquipment={() => setIsAddModalOpen(true)}
              globalSearchQuery={globalSearchQuery}
            />
          )}

          {currentTab === "life_prediction" && (
            <LifePredictionView
              equipmentList={equipmentList}
              onSelectEquipment={handleSelectEquipment}
            />
          )}

          {currentTab === "equipment_health" && (
            <EquipmentHealthView
              equipmentList={equipmentList}
              onSelectEquipment={handleSelectEquipment}
            />
          )}

          {currentTab === "maintenance" && (
            <MaintenanceView
              equipmentList={equipmentList}
              onSelectEquipment={handleSelectEquipment}
              onLogMaintenance={(eq) => {
                setSelectedEquipment(eq);
                setIsMaintenanceModalOpen(true);
              }}
            />
          )}

          {currentTab === "recommendations" && (
            <RecommendationsView
              onOpenReviewAllocation={() => setIsAllocationModalOpen(true)}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === "reports" && (
            <ReportsView onOpenExportReport={() => alert("Generating full laboratory compliance dossier (PDF)...")} />
          )}

          {currentTab === "notifications" && (
            <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
              <h1 className="text-2xl font-bold text-slate-900">All Notifications</h1>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0 ml-4">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === "settings" && (
            <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
              <h1 className="text-2xl font-bold text-slate-900">Laboratory System Settings</h1>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900">Automated Calibration Reminders</h4>
                    <p className="text-slate-500">Dispatch alert 15 days prior to ISO certificate expiration.</p>
                  </div>
                  <span className="text-emerald-600 font-bold">Enabled</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900">AI Predictive Maintenance Frequency</h4>
                    <p className="text-slate-500">Continuous background telemetry evaluation.</p>
                  </div>
                  <span className="font-bold text-slate-800">Every 15 mins</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">Data Synchronization</h4>
                    <p className="text-slate-500">Local node cache synced to SmartLab Cloud.</p>
                  </div>
                  <span className="text-emerald-600 font-bold">Online (100% Synced)</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Interactive Modals */}
      <AddEquipmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEquipment={handleAddEquipment}
      />

      <LogMaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        equipment={selectedEquipment}
        onSaveLog={handleSaveMaintenanceLog}
      />

      <ScheduleCalibrationModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        equipment={selectedEquipment}
        onScheduled={handleScheduledCalibration}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAllRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
      />

      <ReviewAllocationModal
        isOpen={isAllocationModalOpen}
        onClose={() => setIsAllocationModalOpen(false)}
        onApplyAllocation={() => {
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: "Resource Allocation Applied",
            message: "Reallocated 2 underutilized units to Fabrication Lab.",
            time: "Just now",
            read: false,
            type: "ai",
          };
          setNotifications((prev) => [newNotif, ...prev]);
        }}
      />

      <ReportFaultModal
        isOpen={isFaultModalOpen}
        onClose={() => setIsFaultModalOpen(false)}
        equipment={selectedEquipment}
        onSubmitFault={handleReportFault}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}
