import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY environment variable is not configured. Running in high-fidelity sandbox mode.");
    return null;
  }
  
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Generates extremely realistic mock plans if Gemini is not configured
function generateMockPlan(userInput: string) {
  const isExam = userInput.toLowerCase().includes("exam") || userInput.toLowerCase().includes("test") || userInput.toLowerCase().includes("study");
  const isHackathon = userInput.toLowerCase().includes("hackathon") || userInput.toLowerCase().includes("project") || userInput.toLowerCase().includes("build");

  let title = "Custom Planned Milestone";
  let subtasks: any[] = [];
  let calendarBlocks: any[] = [];
  let assessment = "";
  let resources: any[] = [];

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const inTwoDays = new Date(Date.now() + 172800000).toISOString().split('T')[0];

  if (isExam) {
    title = "High-Intensity Exam Prep Routine";
    assessment = "Prepping for exams requires focused repetition and high cognitive focus. High risk of procrastination detected due to initial cognitive load.";
    subtasks = [
      { id: "t1", title: "Review core lectures & syllabus notes", category: "Research", durationMinutes: 45, energyLevel: "medium", milestoneId: "m1", order: 1 },
      { id: "t2", title: "Solve practice problems & past exams", category: "Coding", durationMinutes: 60, energyLevel: "high", milestoneId: "m1", order: 2 },
      { id: "t3", title: "Active recall study on weak concepts", category: "Review", durationMinutes: 45, energyLevel: "high", milestoneId: "m2", order: 3 },
      { id: "t4", title: "Create flashcards for final revision", category: "Documentation", durationMinutes: 30, energyLevel: "low", milestoneId: "m2", order: 4 }
    ];
    resources = [
      { title: "Active Recall Study System Guide", url: "https://en.wikipedia.org/wiki/Active_recall", description: "Learn how active testing increases long-term memory retrieval.", type: "article" },
      { title: "The Leitner Flashcard Method", url: "https://en.wikipedia.org/wiki/Leitner_system", description: "Efficient spacing repetition technique for flashcards.", type: "tutorial" }
    ];
  } else if (isHackathon) {
    title = "Rapid Hackathon Blueprint";
    assessment = "Hackathons are sprint-based with massive technical risks around initial architecture and API setup. Mitigation is critical within the first 12 hours.";
    subtasks = [
      { id: "t1", title: "Architect project skeleton & initialize database", category: "Coding", durationMinutes: 60, energyLevel: "high", milestoneId: "m1", order: 1 },
      { id: "t2", title: "Core functional backend setup & API logic", category: "Coding", durationMinutes: 60, energyLevel: "high", milestoneId: "m1", order: 2 },
      { id: "t3", title: "Responsive layout & beautiful UI design", category: "Research", durationMinutes: 45, energyLevel: "medium", milestoneId: "m2", order: 3 },
      { id: "t4", title: "Prepare slide deck & record video demo", category: "Documentation", durationMinutes: 45, energyLevel: "low", milestoneId: "m2", order: 4 }
    ];
    resources = [
      { title: "How to Win an AI Hackathon", url: "https://github.com/dair-ai/AI-Hackathon-Template", description: "A curation of templates, slides, and architectures for fast builds.", type: "documentation" },
      { title: "Rapid Responsive UI Prototyping", url: "https://tailwindcss.com/docs", description: "Official Tailwind CSS framework documentation.", type: "tutorial" }
    ];
  } else {
    title = "Personal Project Sprint";
    assessment = "Consistency-driven milestone. Main focus is managing energy levels to prevent mid-week burnout.";
    subtasks = [
      { id: "t1", title: "Research specifications & outline constraints", category: "Research", durationMinutes: 45, energyLevel: "medium", milestoneId: "m1", order: 1 },
      { id: "t2", title: "Execute core development sprint", category: "Coding", durationMinutes: 90, energyLevel: "high", milestoneId: "m1", order: 2 },
      { id: "t3", title: "Review bugs & write comprehensive documentation", category: "Documentation", durationMinutes: 30, energyLevel: "low", milestoneId: "m2", order: 3 }
    ];
    resources = [
      { title: "Extreme Modular Programming Principles", url: "https://en.wikipedia.org/wiki/Modular_programming", description: "How to cleanly split logic to bypass token and complexity limits.", type: "documentation" }
    ];
  }

  // Create calendar blocks starting tomorrow evening at 7PM
  calendarBlocks = subtasks.map((task, idx) => {
    const day = idx < 2 ? tomorrow : inTwoDays;
    const hour = 19 + (idx % 2); // 7PM or 8PM
    const startStr = `${day}T${hour.toString().padStart(2, '0')}:00:00`;
    const endHour = hour + (task.durationMinutes >= 60 ? 1 : 0);
    const endMin = task.durationMinutes % 60;
    const endStr = `${day}T${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}:00`;

    return {
      id: `b-${task.id}`,
      taskId: task.id,
      title: `Focus Session: ${task.title}`,
      startTime: startStr,
      endTime: endStr,
      energySpent: task.energyLevel
    };
  });

  return {
    planner: {
      title,
      milestones: [
        { id: "m1", title: "Alpha MVP Functionality", targetDate: tomorrow },
        { id: "m2", title: "Polished & Verified Launch", targetDate: inTwoDays }
      ],
      subtasks
    },
    scheduler: {
      calendarBlocks
    },
    risk: {
      score: 55,
      delayProbability: 60,
      burnoutRisk: 45,
      confidence: 85,
      assessment,
      mitigationSteps: [
        "Eliminate non-essential tasks to prevent cognitive overload.",
        "Block 2-hour high energy windows during your evening peak focus hours.",
        "Start with a 10-minute focus coach session to build momentum."
      ]
    },
    research: {
      resources
    },
    memory: {
      insights: [
        "Prefers late-evening high energy slots (7:00 PM - 9:30 PM).",
        "Higher productivity is shown on technical tasks compared to documentation.",
        "Often postpones reviews: recommendations include adding strict feedback gates."
      ],
      habitsNoticed: [
        "Evening peak energy detected.",
        "Initial friction on complex coding subtasks (mitigated by focus timer)."
      ],
      recommendations: [
        "Schedule high cognitive work exclusively between 7 PM and 9 PM.",
        "Use Pomodoro 25/5 cycles for reviewing documentation to prevent burnout."
      ]
    },
    motivation: {
      coachMessage: `You've got this! We've automatically designed a targeted plan to adapt around your constraints. Let's make every single hour count.`,
      urgencySlogan: "Action beats anxiety. Start your first focus block today."
    },
    isMock: true
  };
}

// Express Endpoints
app.post("/api/plan", async (req, res) => {
  const { userInput } = req.body;
  if (!userInput) {
    return res.status(400).json({ error: "userInput is required" });
  }

  const ai = getGeminiClient();
  if (!ai) {
    // Return high-fidelity mock immediately if API Key is not set up
    return res.json(generateMockPlan(userInput));
  }

  try {
    const prompt = `You are the Master Coordinator Agent of FlowPilot. Your job is to orchestrate multiple sub-agents to solve the following user constraints:
    
    User Constraints: "${userInput}"
    Current Date: ${new Date().toISOString().split('T')[0]}

    Please delegate and coordinate the following specialized agents:
    1. Planner Agent: Break the overall goal into a sequence of subtasks categorized correctly (Coding, Research, Documentation, Review), estimated in minutes, grouped under 2 key milestones.
    2. Scheduler Agent: Arrange these subtasks into structured evening/daytime calendar blocks fitting the user's constraints.
    3. Risk Agent: Calculate the success confidence, burnout risk, delay probability, and write a concise, sharp assessment with mitigation steps.
    4. Research Agent: Generate highly relevant learning links, documentation links, or guides with realistic/real URLs that match the subject matter.
    5. Memory Agent: Deduce mock behavioral recommendations, preferred working patterns, and habits that fit this request.
    6. Motivation Agent: Create a personalized, encouraging but firm coaching message and a short slogan.

    Return the complete delegated output strictly as a single JSON object. Ensure the format matches exactly the requested schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // Enable Google Search Grounding to fetch true-to-life reference material
        tools: [{ googleSearch: {} }],
        toolConfig: { includeServerSideToolInvocations: true },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planner: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                milestones: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      targetDate: { type: Type.STRING }
                    },
                    required: ["id", "title", "targetDate"]
                  }
                },
                subtasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      category: { type: Type.STRING, description: "Must be 'Coding', 'Research', 'Documentation', or 'Review'" },
                      durationMinutes: { type: Type.INTEGER },
                      energyLevel: { type: Type.STRING, description: "Must be 'high', 'medium', or 'low'" },
                      milestoneId: { type: Type.STRING },
                      order: { type: Type.INTEGER }
                    },
                    required: ["id", "title", "category", "durationMinutes", "energyLevel", "milestoneId", "order"]
                  }
                }
              },
              required: ["title", "milestones", "subtasks"]
            },
            scheduler: {
              type: Type.OBJECT,
              properties: {
                calendarBlocks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      taskId: { type: Type.STRING },
                      title: { type: Type.STRING },
                      startTime: { type: Type.STRING, description: "Format: YYYY-MM-DDTHH:MM:SS" },
                      endTime: { type: Type.STRING, description: "Format: YYYY-MM-DDTHH:MM:SS" },
                      energySpent: { type: Type.STRING }
                    },
                    required: ["id", "taskId", "title", "startTime", "endTime", "energySpent"]
                  }
                }
              },
              required: ["calendarBlocks"]
            },
            risk: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.INTEGER },
                delayProbability: { type: Type.INTEGER },
                burnoutRisk: { type: Type.INTEGER },
                confidence: { type: Type.INTEGER },
                assessment: { type: Type.STRING },
                mitigationSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["score", "delayProbability", "burnoutRisk", "confidence", "assessment", "mitigationSteps"]
            },
            research: {
              type: Type.OBJECT,
              properties: {
                resources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      url: { type: Type.STRING },
                      description: { type: Type.STRING },
                      type: { type: Type.STRING, description: "Must be 'documentation', 'video', 'article', or 'tutorial'" }
                    },
                    required: ["title", "url", "description", "type"]
                  }
                }
              },
              required: ["resources"]
            },
            memory: {
              type: Type.OBJECT,
              properties: {
                insights: { type: Type.ARRAY, items: { type: Type.STRING } },
                habitsNoticed: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["insights", "habitsNoticed", "recommendations"]
            },
            motivation: {
              type: Type.OBJECT,
              properties: {
                coachMessage: { type: Type.STRING },
                urgencySlogan: { type: Type.STRING }
              },
              required: ["coachMessage", "urgencySlogan"]
            }
          },
          required: ["planner", "scheduler", "risk", "research", "memory", "motivation"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response received from Gemini.");
    }

    const parsedData = JSON.parse(text.trim());

    // Pull any real Google Search grounding chunks to provide actual high-fidelity references
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && chunks.length > 0) {
      const realResources = chunks
        .filter(c => c.web?.uri)
        .map(c => ({
          title: c.web?.title || "Search Reference",
          url: c.web?.uri || "#",
          description: "Real-time resource pulled dynamically via Google Search Grounding.",
          type: "documentation"
        }));
      
      // Inject search resources at the top of the research list
      parsedData.research.resources = [...realResources, ...parsedData.research.resources];
    }

    res.json({ ...parsedData, isMock: false });
  } catch (error: any) {
    console.warn("Gemini API was unavailable or exceeded quota, switching to local high-fidelity sandbox planner:", error.message || error);
    // Fallback to high-fidelity mock plan on API rate limits, quota failures, or network errors
    const fallback = generateMockPlan(userInput);
    res.json({ ...fallback, isMock: true });
  }
});

// Starts the server setup
async function startServer() {
  // Vite dev server middleware integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FlowPilot server running on port ${PORT}`);
  });
}

startServer();
