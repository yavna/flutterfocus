import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

// eslint-disable-next-line no-undef
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env file");
  // eslint-disable-next-line no-undef
  process.exit(1);
}

app.post("/api/generate-study-plan", async (req, res) => {
  const { examName, examDate } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Create a detailed study plan for an exam named "${examName}" scheduled on ${examDate}. Include study topics, break times, and revision strategies.`,
        }),
      }
    );

    const data = await response.json();
    const studyPlan = data.candidates?.[0]?.content ?? "Could not generate a study plan.";

    res.json({ studyPlan });
  } catch (error) {
    console.error("Error generating study plan:", error);
    res.status(500).json({ error: "Failed to generate study plan." });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
