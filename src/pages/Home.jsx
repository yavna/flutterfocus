import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import './Home.css'
import Countdown from 'react-countdown';

window.butterflyCounter = window.butterflyCounter || 0;

function incrementCounter() {
    window.butterflyCounter++;
}

export { incrementCounter };

function Home() {
  const [exams, setExams] = useState([]);
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");

  const addExam = () => {
    setExams([...exams, { name: examName, date: examDate }]);
    setExamName("");
    setExamDate("");
  };

  const stages = ["🐛", "🟡 Cocoon", "🦋 Butterfly"];
  const defaultTotalTime = 60000 * 0.5; // 1 minute = 60,000 ms
  const stageTime = defaultTotalTime / stages.length;

  const [stage, setStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(defaultTotalTime); 
  const [isPaused, setIsPaused] = useState(false); // To control the pause state
  const [isStarted, setIsStarted] = useState(false); // To control if timer is started or not
  const [studyPlan, setStudyPlan] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);

  const [inputHours, setInputHours] = useState(""); // Hours input
  const [inputMinutes, setInputMinutes] = useState(""); // Minutes input

  const startTimer = () => {
    setIsStarted(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(prev => !prev);
  };

  const handleComplete = () => {
    console.log("Time's up");
    incrementCounter();
  };

  const reset = () => {
    setTimeLeft(defaultTotalTime);
    setIsStarted(false);
    setStage(newstage);
  }

  // User input timer
  const updateTimer = () => {
    const newTimeLeft = (inputHours * 3600000) + (inputMinutes * 60000); // Convert hours and minutes to milliseconds
    setTimeLeft(newTimeLeft);
    setIsStarted(false); // Reset timer state to not started
    setStage(0); // Reset stage
  };
  
  // Handling time reduction logic (counts down in seconds)
  useEffect(() => {
    let interval;
    if (isStarted && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1000); // Reduce 1 second (1000 ms)
      }, 1000);
    } else if (timeLeft <= 0) {
      handleComplete();
    }

    const newStage = Math.floor((defaultTotalTime - timeLeft) / stageTime);
    if (newStage !== stage && newStage < stages.length) {
      setStage(newStage);
    }

    return () => clearInterval(interval);
  }, [isPaused, timeLeft, isStarted, stage]);

  // Format timeLeft into HH:MM:SS
  const formatTime = (ms) => {
    const hours = Math.floor(ms / 3600000); // Calculate hours
    const minutes = Math.floor((ms % 3600000) / 60000); // Calculate minutes
    const seconds = Math.floor((ms % 60000) / 1000); // Calculate seconds

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // butterfly info
  const [butterflies, setButterflies] = useState([]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);const addButterfly = () => {
    for (let index = 0; index < butterflyCounter; index++) {
      setButterflies((prevButterflies) => [...prevButterflies, "🦋"]);
    }
    setIsButtonClicked(true);
  };

  const generateStudyPlan = async () => {
    if (!selectedExam) {
      alert("Please select an exam first.");
      return;
    }

    try {
      console.log("Sending request to backend...");
      
      const response = await fetch("http://localhost:5000/api/generate-study-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examName: selectedExam.name,
          examDate: selectedExam.date,
          hoursPerDay,
        }),
      });
  
      console.log("Response received:", response);
  
      if (!response.ok) {
        console.error("Failed to generate study plan. Response:", response);
        return;
      }
  
      const data = await response.json();
      console.log("Study Plan Data:", data);
      setStudyPlan(data.studyPlan.replace(/\n/g, "<br/>"));
    } catch (error) {
      console.error("Error fetching study plan:", error);
    }
    <div className="study-plan-box" dangerouslySetInnerHTML={{ __html: studyPlan }} />
  };
  
  
  // tab handling
  const [toggle, setToggle] = useState(1);
  function handleTabClick(id) {
    setToggle(id)
  }

  const handleSelectExam = (index) => {
    setSelectedExam(exams[index]); // Ensure it pulls from the exams state
  };

  return (
    <div className="home">
      <h1 className="title">Flutter Focus</h1>
      <div className="blocks">
        <div className="block mainBlock">
          <div className="tabButton">
            <button className="tablinks" onClick={() => handleTabClick(1)}>Calendar</button>
            <button className="tablinks" onClick={() => handleTabClick(2)}>Study</button>
          </div>
                  
          <div className={toggle === 1 ? "showContent" : "tabcontent"}>
            <h2>Study Calendar</h2>
            <input 
              className="study-input"
              type="text"
              placeholder="Exam Name"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
            />
            <input
              type="number"
              className="study-input"
              placeholder="Hours per day"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
            />
            <input
              type="date"
              className="study-input"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
            />
            <button onClick={addExam}>Add Exam</button>

            <ul>
            {exams.map((exam, index) => (
              <li key={index}>
                {exam.name} - {format(new Date(exam.date), "PP")}
                <button onClick={() => handleSelectExam(index)}>Select</button>
                </li>
            ))}
            </ul>
            </div>

            <div className={toggle === 2 ? "showContent" : "tabcontent"}>
              <h2>Study Now</h2>
              <div className="centered-container">
                <motion.div animate={{ scale: 1.2 }} transition={{ duration: 0.5 }}>
                  <p>{stages[stage]}</p>
                </motion.div>
              </div>
              {/* Timer Input Section */}
              <div>
                <h2>Set Timer</h2>
                <input
                  type="number"
                  id="timer-input"
                  placeholder="Hours"
                  value={inputHours}
                  onChange={(e) => setInputHours(Number(e.target.value))}
                  min="0"
                />
                <input
                  type="number"
                  id="timer-input"
                  placeholder="Minutes"
                  value={inputMinutes}
                  onChange={(e) => setInputMinutes(Number(e.target.value))}
                  min="0"
                  max="59"
                />
                <button className="internalButton" onClick={updateTimer}>Set Timer</button>
              </div>
              <div>
                
                  <h4>Time Left: <div className="time-left-container"><h1>{formatTime(timeLeft)}</h1></div></h4>
                
                <button className="internalButton" onClick={pauseTimer}>
                  {isPaused ? "Resume" : "Pause"}
                </button>
                <button className="internalButton" onClick={startTimer} disabled={isStarted}>Study</button>
                <button className="internalButton" onClick={reset}>Reset</button>
              </div>
            </div>
        </div>

        <div className="block">
          <h2 style={{ marginTop: '5px'}}>Garden</h2>
          <button onClick={addButterfly}>Release butterfly collection</button>
          <div>{butterflies.map((b, i) => <span key={i}>{b}</span>)}</div>
        </div>
      </div>

      <div className="study-plan">
        <h2>Generated Study Plan</h2>
        {studyPlan ? (
          <div className="study-plan-box">
            <pre style={{ whiteSpace: "pre-wrap" }}>{studyPlan}</pre>
        </div> 
        ) : (
          <p>No study plan generated yet. Please add an exam and click Generate Study Plan.</p>
        )}
        {selectedExam && (
          <p><strong>Selected Exam:</strong> {selectedExam.name} on {format(new Date(selectedExam.date), "PP")}</p>
        )}
        <button onClick={generateStudyPlan}>Generate Study Plan</button>
      </div>
    </div>
  );
}

export default Home