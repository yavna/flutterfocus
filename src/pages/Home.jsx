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

  const [stage, setStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60000); // Example: 1 minute countdown (in ms)
  const [isPaused, setIsPaused] = useState(false); // To control the pause state
  const [isStarted, setIsStarted] = useState(false); // To control if timer is started or not

  const stages = ["🐛", "🟡 Cocoon", "🦋 Butterfly"];

  const nextStage = () => {
    if (!isStarted) {
      setIsStarted(true);
    } // Start the timer when stage button is clicked
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  // Handling countdown completion
  const handleComplete = () => {
    setStage(stage + 1);
    setTimeLeft(60000); // Reset time (optional)
  };
  
  // Handling time reduction logic (counts down in seconds)
  useEffect(() => {
    let interval;
    if (isStarted && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1000); // Reduce 1 second (1000 ms)
      }, 1000);
    } if (timeLeft === 30000 || timeLeft === 0) {
      setStage(prevStage => Math.min(prevStage + 1, stages.length - 1));
    } if (timeLeft === 0) {
      incrementCounter();
    }     
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [isPaused, timeLeft, isStarted]);

  // butterfly info
  const [butterflies, setButterflies] = useState([]);

  const addButterfly = () => {
    for (let index = 0; index < butterflyCounter; index++){
      setButterflies([...butterflies, "🦋"]);
    }
  };

  return (
    <div className="home">
      <h1>Flutter Focus</h1>
      <div className="blocks">
        <div className="block">
          <Link to="/calendar"><button>Calendar</button></Link>
          <Link to="/study"><button>Study Now</button></Link>
          <Link to="/garden"><button>Garden</button></Link>
          <div className="tab">
            <button className="tablinks" onClick={() => openTab('Tab1')}>Calendar</button>
            <button className="tablinks" onClick={() => openTab('Tab2')}>Study</button>
          </div>
          <div id="Tab1" className="tabcontent">
            <div>
                  <h2>Study Calendar</h2>
                  <input
                    type="text"
                    placeholder="Exam Name"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
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
            <div>
              <h2>Study Now</h2>
              <motion.div animate={{ scale: 1.2 }} transition={{ duration: 0.5 }}>
                <p>{stages[stage]}</p>
              </motion.div>
              
              <div>
                <p>Time Left: {Math.floor(timeLeft / 1000)} seconds</p> {/* Displaying countdown */}
                <button onClick={togglePause}>
                  {isPaused ? "Resume" : "Pause"}
                </button>
                <button onClick={nextStage}>Start</button>
              <Link to="/home"><button>Back</button></Link>
              </div>
            </div>
          </div>
        </div>
        <div className="block">
          <h2>Garden</h2>
          <button onClick={addButterfly}>Release butterly collection</button>
          <div>{butterflies.map((b, i) => <span key={i}>{b}</span>)}</div>
          <Link to="/home"><button>Back</button></Link>
        </div>
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