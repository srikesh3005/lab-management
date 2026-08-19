export type TabType =
  | "dashboard"
  | "equipment"
  | "equipment_detail"
  | "utilization"
  | "budget_planner"
  | "life_prediction"
  | "equipment_health"
  | "digital_passport"
  | "maintenance"
  | "ai_assistant"
  | "recommendations"
  | "reports"
  | "notifications"
  | "settings";

export type EquipmentStatus = "Available" | "In Use" | "Maintenance" | "Fault";

export interface EquipmentDocument {
  id: string;
  name: string;
  size: string;
  date: string;
  type: "pdf" | "doc";
}

export interface ServiceHistoryItem {
  id: string;
  title: string;
  date: string;
  description: string;
  technician?: string;
  type?: "calibration" | "firmware" | "repair" | "inspection";
}

export interface WeeklyUsagePoint {
  day: string;
  hours: number;
  percentage: number;
}

export interface Equipment {
  id: string;
  name: string;
  category: "Electronics" | "Rotary" | "Optics" | "Prototyping" | "Biotech" | "General";
  status: EquipmentStatus;
  location: string;
  bench?: string;
  healthScore: number;
  healthTrend?: string;
  utilization: number;
  remainingLifeYears: number;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  price: string;
  priceValue: number;
  warrantyStatus: string;
  nextMaintenanceDate: string;
  failureRisk: "Low" | "Medium" | "High";
  aiAssessment: string;
  recommendation: string;
  recommendationDue: string;
  imageUrl: string;
  qrCodeData: string;
  documents: EquipmentDocument[];
  serviceHistory: ServiceHistoryItem[];
  weeklyUsage: WeeklyUsagePoint[];
}

export interface BudgetOverview {
  fiscalYear: string;
  totalAllocated: number;
  totalAllocatedFormatted: string;
  currentSpending: number;
  currentSpendingFormatted: string;
  spendingPercentage: number;
  remaining: number;
  remainingFormatted: string;
  yoyGrowth: string;
  recommendedBudget: number;
  recommendedBudgetFormatted: string;
  aiConfidence: number;
  reasoning: string;
  quarterlySpending: {
    year: string;
    quarters: { quarter: string; amount: number; formatted: string; statusColor?: string }[];
  }[];
}

export interface ProposedPurchase {
  id: string;
  name: string;
  priority: "High" | "Medium" | "Low";
  cost: string;
  costValue: number;
  reason: string;
  status: "Pending" | "Approved" | "Ordered";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestedEquipment?: Partial<Equipment>[];
}

export interface ChatSession {
  id: string;
  title: string;
  group: "Today" | "Previous 7 Days";
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "warning" | "info" | "success" | "ai";
  equipmentId?: string;
}
