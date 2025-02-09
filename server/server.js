import express from "express";
import cors from "cors";
import dotenv from "dotenv"; 
import path from "path";
import { env } from "node:process";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
// import { fileURLToPath } from "url";
// import { dirname } from "path";


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "./.env") });

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://yavna.github.io', // Replace with your actual GitHub Pages URL
}));

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const schema = {
  description: "Study Plan Generator",
  type: SchemaType.OBJECT,
  properties: {
    studyPlan: {
      type: SchemaType.STRING,
      description: "Generated study plan for the exam",
      nullable: false,
    },
  },
  required: ["studyPlan"],
};

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

// app.use(express.static(path.join(__dirname, "dist")));

app.post("/api/generate-study-plan", async (req, res) => {
    const { examName, examDate, hoursPerDay } = req.body;
  
    try {
      const daysUntilExam = Math.ceil(
        (new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24)
      );
  
      const prompt = `Create a personalized study plan for an exam in ${examName} scheduled on ${examDate}. 
      The user has ${daysUntilExam} days left and can study ${hoursPerDay} hours per day. 
      The plan should include:
      - A structured daily schedule covering key topics.
      - Suggested breaks and revision strategies.
      - Practice problems or exercises for each study session.
      - Recommendations on what to focus on based on difficulty levels.`;
  
      const result = await model.generateContent(prompt);
      const studyPlan = result.response.text();
  
      res.json({ studyPlan });
    } catch (error) {
      console.error("❌ Error generating study plan:", error);
      res.status(500).json({ error: "Failed to generate study plan." });
    }
  });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
  

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
console.log("GEMINI_API_KEY:", env.GEMINI_API_KEY);
