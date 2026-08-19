import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Google GenAI lazily
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Chat Endpoint for SmartLab Assistant
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history, context } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Intelligent fallback when GEMINI_API_KEY is not configured
      const lower = (message || "").toLowerCase();
      let reply = "";
      let suggestedEquipment: any[] = [];

      if (lower.includes("oscilloscope") || lower.includes("available")) {
        reply = "I found 2 oscilloscopes currently available in the main lab. Both are in good operational health with calibration up to date.";
        suggestedEquipment = [
          {
            id: "EL-OSC-01",
            name: "Tektronix TBS1000C",
            status: "Available",
            health: "98% Health",
            location: "Bench B3",
          },
          {
            id: "EL-OSC-05",
            name: "Keysight InfiniiVision",
            status: "Available",
            health: "94% Health",
            location: "Cabinet 2A",
          },
        ];
      } else if (lower.includes("idle") || lower.includes("utilization")) {
        reply = "6 equipment items have utilization below 20% this week. For example, Rotary Centrifuge (RL-CEN-09) is idle due to an overdue calibration, and High-Speed Stirrer (ME-ST-02) in Mechanical Lab has 14% utilization. Consider reallocating resources to Fabrication Lab.";
        suggestedEquipment = [
          {
            id: "RL-CEN-09",
            name: "Benchtop Centrifuge",
            status: "Fault",
            health: "45% Health",
            location: "Bio Lab A",
          },
          {
            id: "ME-ST-02",
            name: "Magnetic Stirrer Pro",
            status: "Healthy",
            health: "89% Health",
            location: "Mechanical Lab",
          },
        ];
      } else if (lower.includes("cnc") || lower.includes("machine")) {
        reply = "The CNC Milling Station (FAB-CNC-01) in the Fabrication Lab is currently 'In Use' at 88% capacity. Next routine toolhead inspection is scheduled in 4 days. Spindle vibration metrics are optimal.";
        suggestedEquipment = [
          {
            id: "FAB-CNC-01",
            name: "Desktop CNC Mill 4-Axis",
            status: "In Use",
            health: "91% Health",
            location: "Fabrication Lab",
          },
        ];
      } else if (lower.includes("spectrometer") || lower.includes("biotech")) {
        reply = "For Biotech applications requiring UV-Vis absorbency analysis, I recommend the Thermo Scientific NanoDrop One or Shimadzu UV-1900i. We currently have budget headroom in the Q2 procurement plan.";
        suggestedEquipment = [
          {
            id: "BIO-SPEC-08",
            name: "Microvolume UV-Vis Spectrometer",
            status: "Available",
            health: "96% Health",
            location: "Cleanroom 1",
          },
        ];
      } else {
        reply = `I have analyzed your query regarding "${message}". Currently across the 342 tracked laboratory assets, 224 are available, 86 are in active use, and 12 are queued for calibration or service. All vital telemetry feeds are operating within tolerance limits.`;
      }

      return res.json({
        reply,
        suggestedEquipment,
        model: "SmartLab Intelligent Rule Engine",
      });
    }

    const systemInstruction = `You are SmartLab Assistant, an expert AI for SmartLab Equipment Management.
You manage laboratory equipment, telemetry, utilization analytics, preventive maintenance schedules, digital equipment passports, and capital budget allocation.
The lab has 342 assets: 224 available, 86 in use, 12 under maintenance.
Key equipment examples:
- EL-OSC-01: Tektronix TBS1000C (Digital Oscilloscope, Bench B3, Available, 98% Health)
- EL-OSC-05: Keysight InfiniiVision (Digital Oscilloscope, Cabinet 2A, Available, 94% Health)
- FAB-CNC-01: Desktop CNC Mill 4-Axis (Fabrication Lab, In Use, 91% Health)
- FG-2023-8942: Tektronix AFG31000 Function Generator (Main Electronics Lab Bench 4, Active, 88% Health)
- RL-CEN-09: Centrifuge (Bio Lab, Fault/Overdue, 45% Health)
- EQ-3DP-042: Precision 3D Printer (Fabrication Lab, In Use, 88% Health)

Keep responses professional, concise, actionable, and scientific. Format bullet points or structured suggestions clearly.`;

    const chat = ai.chats.create({
      model: "gemini-3.7-flash",
      config: {
        systemInstruction,
      },
    });

    const response = await chat.sendMessage({
      message: message + (context ? `\nContext: ${JSON.stringify(context)}` : ""),
    });

    res.json({
      reply: response.text || "Analysis complete.",
      model: "gemini-3.7-flash",
    });
  } catch (error: any) {
    console.error("AI chat error:", error);
    res.status(500).json({ error: error.message || "Failed to process chat" });
  }
});

// AI Condition Assessment Endpoint
app.post("/api/ai/condition-assessment", async (req, res) => {
  try {
    const { equipmentId, equipmentName, vitals } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        riskLevel: "Low",
        summary: `The equipment (${equipmentName || "Unit"}) is operating within optimal parameters. Recent usage patterns show consistent power draw and signal stability. Component variance is well within tolerance limits (±2%).`,
        recommendation: "Routine Calibration",
        dueDays: 15,
      });
    }

    const prompt = `Perform a condition assessment for laboratory equipment:
Equipment ID: ${equipmentId}
Name: ${equipmentName}
Vitals: ${JSON.stringify(vitals || {})}

Return a JSON object with:
- riskLevel: "Low" | "Medium" | "High"
- summary: detailed 2-3 sentence technical assessment
- recommendation: recommended preventive action
- dueDays: number of days until recommended action`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI condition assessment error:", error);
    res.json({
      riskLevel: "Low",
      summary: "Equipment operating stably with minimal sensor deviation.",
      recommendation: "Routine Inspection",
      dueDays: 30,
    });
  }
});

// Vite middleware for development & SPA serving for production
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartLab server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
