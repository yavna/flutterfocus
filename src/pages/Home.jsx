import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import './Home.css'
import Countdown from 'react-countdown';
import React from 'react';

function Caterpillar() {
  return (
    <div>
      <img src="/assets/caterpillar.jpg" alt="Caterpillar" style={{ width: '100px', height: 'auto' }} />
    </div>
  );
}

function Cocoon() {
  return (
    <div>
      <img src="/assets/cocoon.jpg" alt="Cocoon" style={{ width: '100px', height: 'auto' }} />
    </div>
  );
}

function Butterfly() {
  return (
    <div>
      <img src="/assets/butterfly.jpg" alt="Butterfly" style={{ width: '100px', height: 'auto' }} />
    </div>
  );
}

window.butterflyCounter = window.butterflyCounter || 0;

function incrementCounter() {
    window.butterflyCounter++;
}

export { incrementCounter };

function Home() {

  // study plan calendar things
  function formatStudyPlan(rawString) {
    const cleanedString = rawString.replace(/<br\s*\/?>/g, '').trim();
  
    let parsedOuter;
    try {
      parsedOuter = JSON.parse(cleanedString);
    } catch (err) {
      console.error('Error parsing outer JSON:', err);
      return rawString;
    }
  
    const replacements = {
      day: '\nDay',
      practiceProblems: 'Practice Problems',
      studyTopics: 'Study Topics',
      breakTimes: 'Break Times',
      revisionStrategies: 'Revision Strategies',
      time: 'Time',
      topic: 'Topic',
      description: 'Description',
      generalRecommendations: 'General Recommendations',
      recommendations : 'Recommendations',
      activities: 'Activities',
      activity: 'Activity',
      difficulty: 'Difficulty',
      revisionStrategy: 'Revision Strategy',
      importantNotes: 'Important Notes',
      startTime: 'Start Time',
      endTime: 'End Time',
      notes: 'Notes',
      break: 'Break',
      DifficultyFocus: 'Difficulty',
      focus: 'Focus',
      date : 'Date',
      general : 'General',
      duration : 'Duration',
      revision : 'Revision',
      type : 'Type',
      materials : 'Materials',
      breakSuggestions : 'Break Suggestions',
      focusRecommendations : 'Focus Recommendations',
      additionalNotes : 'Additional Notes',
      schedule : 'Schedule',
      examDay : 'Exam Day',
      FocusAreas : 'Focus Areas',
      practice : 'Practice',
      details : 'Details',
      DifficultyLevel : 'Difficulty Level',
      TimeManagement : 'Time Management',
      keyConcepts : 'Key Concepts',
      commonPitfalls : 'Common Pitfalls',
      DayTips : 'Day Tips',
      problemSolving : 'Problem Solving',
      dailySchedule : 'Daily Schedule',
      overallRevision : 'Overall Revision',
      DaysLeft : 'Days Left',
    };
  

    const replaceWords = (str) => {
      for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(key, 'gi');
        str = str.replace(regex, value);
      }
      return str;
    };

    const removeHeaders = (str) => {
      const headerRegex = /"examName":.*?,|"examDate":.*?,|"hoursPerDay":.*?,|"DaysLeft":.*?/g;
      return str.replace(headerRegex, '');
    };

    const newLines = (str) => {
      const headingRegex = new RegExp(Object.values(replacements).join('|'), 'gi');
      return str.replace(headingRegex, match => `\n${match}`);
    };
  
    if (parsedOuter && typeof parsedOuter.studyPlan === 'string') {
      try {
        const innerPlan = JSON.parse(parsedOuter.studyPlan);
        let formattedPlan = JSON.stringify(innerPlan, null, 2);

        formattedPlan = removeHeaders(formattedPlan);

        formattedPlan = formattedPlan.replace(/[{}[\],"]/g, '');
    
        formattedPlan = replaceWords(formattedPlan);

      const lines = formattedPlan.split('\n');
      const filteredLines = lines.filter(line => !/^[\s]*$/.test(line));
      formattedPlan = filteredLines.join('\n');
  
        return formattedPlan;
      } catch (err) {
        console.error('Error parsing inner studyPlan JSON:', err);
        return rawString;
      }
    } else {
      let formattedPlan = JSON.stringify(parsedOuter, null, 2);
  
      formattedPlan = formattedPlan.replace(/[{}[\],"]/g, '');

      formattedPlan = newLines(formattedPlan);

      formattedPlan = replaceWords(formattedPlan);
  
      return formattedPlan;
    }
  }
  

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
  
      if (!response.ok) {
        console.error("Failed to generate study plan. Response:", response);
        return;
      }
  
      const data = await response.json();
      console.log("Raw Study Plan Data:", data);
  
      const formattedPlan = formatStudyPlan(data.studyPlan);
      setStudyPlan(formattedPlan);
  
      const examWithPlan = {
        ...selectedExam,
        studyPlan: formattedPlan,
      };
      console.log("Exam with formatted study plan:", examWithPlan);
      
    } catch (error) {
      console.error("Error fetching study plan:", error);
    }
  };

  // ui components

  const [exams, setExams] = useState([]);
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");

  const addExam = () => {
    setExams([...exams, { name: examName, date: examDate }]);
    setExamName("");
    setExamDate("");
  };

  const stages = [Caterpillar(), Cocoon(), Butterfly(), "You've earned a butterfly!"];
  const [inputHours, setInputHours] = useState(""); // Hours input
  const [inputMinutes, setInputMinutes] = useState(""); // Minutes input
  const totalTime = (inputHours * 3600000) + (inputMinutes * 60000); // 1 minute = 60,000 ms
  const stageTime = totalTime / stages.length;

  const [stage, setStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime); 
  const [isPaused, setIsPaused] = useState(false); // To control the pause state
  const [isStarted, setIsStarted] = useState(false); // To control if timer is started or not
  const [studyPlan, setStudyPlan] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);

  

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
    setTimeLeft(totalTime);
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

    const newStage = Math.floor((totalTime - timeLeft) / (totalTime
       / 3));
    if (newStage !== stage && newStage < 4) {
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
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  
  const addButterfly = () => {
    // Set up butterflies with random positions and random animation durations
    const newButterflies = [];
    
    for (let index = 0; index < (window.butterflyCounter-2)/2; index++) {
      // Random horizontal and vertical positions
      const randomX = Math.random() * (1000 - 999.9) + (999.9); // Horizontal position between 0 and 500px
      const randomY = Math.random() * (600 - 500) + 500; // Vertical position between 0 and 500px
      
      // Random animation duration between 2s and 4s
      const randomDuration = Math.random() * 2 + 2; // e.g., 2s to 4s
      
      newButterflies.push(
        <div
          key={index}
          className="butterfly"
          style={{
            position: "absolute",
            left: `${randomX}px`,
            top: `${randomY}px`,
            animation: `flyAround ${randomDuration}s infinite`,
          }}
        >
          🦋
        </div>
      );
    }
  
    setButterflies(newButterflies);
    setIsButtonClicked(true);
  
    // Clear butterflies after a while (e.g., 3 seconds)
    setTimeout(() => {
      setButterflies([]); // Clear butterflies after 3 seconds (or any desired duration)
    }, 3000); // This should match the flying duration
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
  

  const [toggle, setToggle] = useState(1);
  function handleTabClick(id) {
    setToggle(id)
  }

  const handleSelectExam = (index) => {
    setSelectedExam(exams[index]); // Ensure it pulls from the exams state
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="home"
    >
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
            <button style={{marginLeft: '10px'}} onClick={addExam}>Add Exam</button>

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

      <div className="study-plan blockBottom block">
        <h2 style={{marginLeft: '30px'}}>Generated Study Plan</h2>
        {studyPlan ? (
          <div className="study-plan-box">
            <pre style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
              {studyPlan.split('\n').map((line, index) => (
                <span key={index} style={{ fontWeight: line.startsWith('Day') ? 'bold' : 'normal' }}>
                  {line}
                  <br />
                </span>
              ))}
            </pre>
          </div>
        ) : (
          <p style={{marginLeft: '30px'}}>No study plan generated yet. Please add an exam and click Generate Study Plan.</p>
        )}
        <button style={{marginBottom: '40px', marginLeft: '30px'}}onClick={generateStudyPlan}>Generate Study Plan</button>
      </div>
    </motion.div>
  );
}

export default Home;