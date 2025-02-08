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
  const totalTime = 60000 * .5; // 1 minute = 60,000 ms
  const stageTime = totalTime / stages.length;

  const [stage, setStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime); 
  const [isPaused, setIsPaused] = useState(false); // To control the pause state
  const [isStarted, setIsStarted] = useState(false); // To control if timer is started or not
  const [studyPlan, setStudyPlan] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");

  const startTimer = () => {
    setIsStarted(true);
    setIsPaused(false);
  };

  const nextStage = () => {
    if (!isStarted) {
      setIsStarted(true);
    } // Start the timer when stage button is clicked
  };

  const pauseTimer = () => {
    setIsPaused(prev => !prev);
  };

  const handleComplete = () => {
    console.log("Time's up");
  };

  const reset = () => {
    setTimeLeft(60000);
    setIsStarted(false);
    setStage(0);
  }
  
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

    const newStage = Math.floor((totalTime - timeLeft) / stageTime);
    if (newStage !== stage && newStage < stages.length) {
      setStage(newStage);
    }

    return () => clearInterval(interval);
  }, [isPaused, timeLeft, isStarted, stage]);

  // Format timeLeft into MM:SS
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // butterfly info
  const [butterflies, setButterflies] = useState([]);

  const addButterfly = () => {
    for (let index = 0; index < butterflyCounter; index++){
      setButterflies([...butterflies, "🦋"]);
    }
  };

  const generateStudyPlan = async () => {
    try {
      console.log("Sending request to backend...");
      
      const response = await fetch("http://localhost:5000/api/generate-study-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examName,
          examDate,
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
  const [activeTab, setActiveTab] = useState('default');
  const handleTabClick = (tabId) => {
    if (tabId !== 'default') {
      setActiveTab(tabId);
    }
  };  

  return (
    <div className="home">
      <h1>Flutter Focus</h1>
      <div className="blocks">
        <div className="block mainBlock">
          <div className="tabButton">
            <button className="tablinks" onClick={() => handleTabClick('Tab1')}>Calendar</button>
            <button className="tablinks" onClick={() => handleTabClick('Tab2')}>Study</button>
          </div>
          <div id="Tab1" className="tabcontent">
            <div className={`tab ${activeTab === 'Tab1' ? 'active' : ''}`}>
                  <h2>Study Calendar</h2>
                  <input
                    type="text"
                    placeholder="Exam Name"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                  />
                  <input
                  type="number"
                  placeholder="Hours per day"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
/>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                  />
                  <button onClick={addExam}>Add Exam</button>
            
                  <ul>
                    {exams.map((exam, index) => (
                      <li key={index}>
                        {exam.name} - {format(new Date(exam.date), "PP")}
                      </li>
                    ))}
                  </ul>
              </div>
          </div>

          <div id="Tab2" className="tabcontent">
            <div className={`tab ${activeTab === 'Tab2' ? 'active' : ''}`}>
              <h2>Study Now</h2>
              <motion.div animate={{ scale: 1.2 }} transition={{ duration: 0.5 }}>
                <p>{stages[stage]}</p>
              </motion.div>
              
              <div>
                <p>Time Left: {formatTime(timeLeft)}</p>
                <button onClick={pauseTimer}>
                  {isPaused ? "Resume" : "Pause"}
                </button>
                <button onClick={startTimer} disabled={isStarted}>Study!</button>
              </div>
            </div>
          </div>
        </div>
        <div className="block">
          <h2 style={{ marginTop: '5px'}}>Garden</h2>
          <button onClick={addButterfly}>Release butterly collection</button>
          <div>{butterflies.map((b, i) => <span key={i}>{b}</span>)}</div>
        </div>
      </div>
      <div className="study-plan">
        <h2>Generated Study Plan</h2>
        {studyPlan ? (
          <div className="study-plan-box">
          <pre>{studyPlan}</pre>
        </div> 
        ) : (
          <p>No study plan generated yet. Please add an exam and click Generate Study Plan.</p>
        )}
        <button onClick={generateStudyPlan}>Generate Study Plan</button>
      </div>
    </div>
  );
}

function openTab(tabName) {
  const tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  const tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className += " active";
}
export default Home;