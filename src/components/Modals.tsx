import React, { useState } from "react";
import { Equipment, NotificationItem, ProposedPurchase } from "../types";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Calendar,
  Sparkles,
  Download,
  Shield,
  FileText,
  User,
  Activity,
  Plus,
} from "lucide-react";
import confetti from "canvas-confetti";

// 1. Add Equipment Modal
interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEquipment: (newEq: Partial<Equipment>) => void;
}

export const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({
  isOpen,
  onClose,
  onAddEquipment,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<any>("Electronics");
  const [location, setLocation] = useState("Electronics Lab");
  const [bench, setBench] = useState("Bench B1");
  const [manufacturer, setManufacturer] = useState("Tektronix");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [price, setPrice] = useState("₹1,20,000");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `EQ-${category.slice(0, 3).toUpperCase()}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    onAddEquipment({
      id: newId,
      name,
      category,
      status: "Available",
      location,
      bench,
      manufacturer,
      model: model || "Standard Unit",
      serialNumber: serialNumber || `SN-${Math.floor(10000 + Math.random() * 90000)}`,
      purchaseDate: "Today",
      price: price || "₹1,00,000",
      priceValue: 100000,
      warrantyStatus: "Active (24 Mos)",
      healthScore: 98,
      healthTrend: "Optimal",
      utilization: 10,
      remainingLifeYears: 5.0,
      failureRisk: "Low",
      nextMaintenanceDate: "Nov 20, 2024",
      aiAssessment:
        "Newly commissioned laboratory equipment. Zero calibration drift, factory QA certification passed.",
      recommendation: "Routine Baseline Inspection",
      recommendationDue: "Due in 90 Days",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCyneObb9_7rQb7L1s37F100rlKTFskaCmjWb7sOvY0I1D7HIbCZ3uFuUEddcejUrMul0UWcNsjL7ts-VJQuwda6wD7vtWOGibliFbrsmIA-jcAFLJaf3T7YhHCrwMY1WBUDF6EKCcxvwQrLLvUo9wgljH1Lqgfmcuk2VhWJtpzdgBIzT3RAn4ZGGcmocrnkilc-5JvUH7ZbrwK4ueUGGpZT7kD0fCWj-DMx0aYI9YIwTcWmTOsPx4",
      qrCodeData: `SMARTLAB-PASSPORT:${newId}`,
      documents: [
        {
          id: "doc-new-1",
          name: "Commissioning_QA_Report.pdf",
          size: "1.2 MB",
          date: "Today",
          type: "pdf",
        },
      ],
      serviceHistory: [
        {
          id: "srv-new-1",
          title: "Lab Commissioning",
          date: "Today",
          description: "Initial installation and self-test verification.",
          type: "inspection",
        },
      ],
      weeklyUsage: [
        { day: "Mon", hours: 2, percentage: 20 },
        { day: "Tue", hours: 3, percentage: 30 },
        { day: "Wed", hours: 4, percentage: 40 },
        { day: "Thu", hours: 2, percentage: 20 },
        { day: "Fri", hours: 1, percentage: 10 },
        { day: "Sat", hours: 0, percentage: 0 },
        { day: "Sun", hours: 0, percentage: 0 },
      ],
    });

    confetti({ particleCount: 50, spread: 60 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-sm font-bold bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-xl font-bold text-slate-900">Add New Laboratory Equipment</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Register asset into SmartLab database with automated digital passport generation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Equipment Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Digital Storage Oscilloscope 4-Ch"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Electronics">Electronics</option>
                <option value="Rotary">Rotary</option>
                <option value="Optics">Optics</option>
                <option value="Prototyping">Prototyping</option>
                <option value="Biotech">Biotech</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Electronics Lab">Electronics Lab</option>
                <option value="Fabrication Lab">Fabrication Lab</option>
                <option value="Main Lab A">Main Lab A</option>
                <option value="Cleanroom 1">Cleanroom 1</option>
                <option value="Bio Lab A">Bio Lab A</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Manufacturer</label>
              <input
                type="text"
                placeholder="e.g. Tektronix / Keysight"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Model</label>
              <input
                type="text"
                placeholder="e.g. TBS-2000B"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Serial Number</label>
              <input
                type="text"
                placeholder="e.g. SN-88912-A"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Purchase Price</label>
              <input
                type="text"
                placeholder="e.g. ₹1,20,000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#006c49] hover:bg-[#005237] text-white font-bold rounded-lg shadow-sm active:scale-95"
            >
              Register Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. Log Maintenance Modal
interface LogMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment | null;
  onSaveLog: (log: { title: string; description: string; technician: string }) => void;
}

export const LogMaintenanceModal: React.FC<LogMaintenanceModalProps> = ({
  isOpen,
  onClose,
  equipment,
  onSaveLog,
}) => {
  const [title, setTitle] = useState("Calibration & Routine Servicing");
  const [description, setDescription] = useState(
    "Verified zero calibration, replaced input dust covers, and updated sensor firmware."
  );
  const [technician, setTechnician] = useState("Dr. Aris Thorne (Lab Director)");

  if (!isOpen || !equipment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLog({ title, description, technician });
    confetti({ particleCount: 40, spread: 50 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-xl font-bold text-slate-900">Log Maintenance Record</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Asset: <span className="font-bold text-slate-800">{equipment.name}</span> (
            {equipment.id})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Service Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Service Details & Notes</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Responsible Technician / Metrologist</label>
            <input
              type="text"
              required
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#006c49] hover:bg-[#005237] text-white font-bold rounded-lg shadow-sm active:scale-95"
            >
              Commit Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. Schedule Calibration Modal
interface ScheduleCalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment | null;
  onScheduled: () => void;
}

export const ScheduleCalibrationModal: React.FC<ScheduleCalibrationModalProps> = ({
  isOpen,
  onClose,
  equipment,
  onScheduled,
}) => {
  const [date, setDate] = useState("2024-09-15");
  const [vendor, setVendor] = useState("Tektronix Certified Metrology Center");

  if (!isOpen || !equipment) return null;

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    onScheduled();
    confetti({ particleCount: 30, spread: 45 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-purple-700 font-bold text-sm mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Automated Scheduling</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Schedule ISO Calibration</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Asset: <span className="font-bold text-slate-800">{equipment.name}</span>
          </p>
        </div>

        <form onSubmit={handleSchedule} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Calibration Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Accredited Calibration Facility</label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-sm active:scale-95"
            >
              Confirm Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 4. Notifications Modal / Drawer
interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-end p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-100 relative animate-in fade-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">Lab Notifications</h3>
            <span className="text-xs text-slate-400">
              {notifications.filter((n) => !n.read).length} unread alerts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-xs text-emerald-600 font-semibold hover:underline"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 bg-slate-100 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="space-y-2.5 max-h-96 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                !n.read ? "bg-emerald-50/40 border-emerald-200" : "bg-slate-50 border-slate-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{n.title}</span>
                <span className="text-[10px] text-slate-400">{n.time}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. Review Allocation Modal
interface ReviewAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAllocation: () => void;
}

export const ReviewAllocationModal: React.FC<ReviewAllocationModalProps> = ({
  isOpen,
  onClose,
  onApplyAllocation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-purple-700 font-bold text-sm mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Resource Optimization</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Inter-Lab Reallocation Plan</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Proposed migration to relieve 88% queue congestion in the Fabrication Lab.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-800">1. Digital Storage Oscilloscope (EL-OSC-05)</div>
            <div className="text-slate-500 mt-0.5">
              From: <span className="font-semibold text-slate-700">Main Lab B</span> (14%
              utilization) &rarr; To:{" "}
              <span className="font-semibold text-emerald-700">Fabrication Lab</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-800">2. High-Precision Power Supply (ME-PS-03)</div>
            <div className="text-slate-500 mt-0.5">
              From: <span className="font-semibold text-slate-700">Mechanical Lab</span> (18%
              utilization) &rarr; To:{" "}
              <span className="font-semibold text-emerald-700">Fabrication Lab</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
          >
            Close
          </button>
          <button
            onClick={() => {
              onApplyAllocation();
              confetti({ particleCount: 50, spread: 60 });
              onClose();
            }}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-sm text-xs active:scale-95"
          >
            Apply Reallocation
          </button>
        </div>
      </div>
    </div>
  );
};

// 6. Report Fault Modal
interface ReportFaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment | null;
  onSubmitFault: (fault: string) => void;
}

export const ReportFaultModal: React.FC<ReportFaultModalProps> = ({
  isOpen,
  onClose,
  equipment,
  onSubmitFault,
}) => {
  const [description, setDescription] = useState("");

  if (!isOpen || !equipment) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-sm mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Emergency Telemetry Lockout</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Report Equipment Fault</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Asset: <span className="font-bold text-slate-800">{equipment.name}</span> (
            {equipment.id})
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <label className="block font-bold text-slate-700">Describe Symptom / Error Code *</label>
          <textarea
            rows={3}
            required
            placeholder="e.g. Spindle bearing vibration excessive, high frequency squeal above 8,000 RPM."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmitFault(description || "Unspecified physical fault");
              onClose();
            }}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm text-xs active:scale-95"
          >
            Submit Fault Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

// 7. Profile Modal
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500 bg-emerald-50 shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBR8VHgLxkoBh9GJGGJ--NMHYe6JVVNCw2xvw1dy9XoTIZciOZUJG0a8_5VoDwBVSk28rTuztnAQ-XTR4Q_Rc1fdCEC8Yx8c697MAEUlgvsi4rxHx7x6gcpvMN1K-kGMTrvmSxGTKm_oQrgAR2VEL2IPnRn4LJlduf234kcFyTzX3LDC6xugzKBQxa7572ZQ9FDf9eMwALSV2OI6mqqq1J_s5zgf-OLJHUJwq6HgR6ruI-PWGjXg98"
              alt="Dr. Aris Thorne"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Dr. Aris Thorne</h2>
            <p className="text-xs text-slate-500 font-medium">Head of Research & Lab Infrastructure</p>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full inline-block mt-1">
              Super Admin • Level 4 Clearance
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex justify-between">
            <span className="text-slate-400">Email:</span>
            <span className="font-semibold text-slate-800">aris.thorne@smartlab.edu</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Assigned Labs:</span>
            <span className="font-semibold text-slate-800">Electronics, Biotech, Fab (6 Total)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Role:</span>
            <span className="font-semibold text-slate-800">Principal Metrologist</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#006c49] text-white font-bold rounded-lg text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
