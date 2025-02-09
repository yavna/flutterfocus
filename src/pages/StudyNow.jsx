import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Countdown from 'react-countdown';
import { Link } from "react-router-dom";
import { incrementCounter } from './Home';

function StudyNow() {
  const stages = ["🐛", "🟡 Cocoon", "🦋 Butterfly"];
  const totalTime = 60000 * .5;
  const stageTime = totalTime / stages.length;

  const [stage, setStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime); 
  const [isPaused, setIsPaused] = useState(false); 
  const [isStarted, setIsStarted] = useState(false);

  const startTimer = () => {
    setIsStarted(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused((prev) => !prev);
  };

  // Handling countdown completion
  const handleComplete = () => {
    console.log("Time's up");
  };

  useEffect(() => {
    let interval;
    if (isStarted && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1000); 
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

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };


  return (
    <div>
      <h2>Study Now</h2>
      <motion.div animate={{ scale: 1.2 }} transition={{ duration: 0.5 }}>
        <p>{stages[stage]}</p>
      </motion.div>
      
      <div>
        <p>Time Left: {formatTime(timeLeft)}</p>
        <button onClick={startTimer} disabled={isStarted}>Study!</button>
        <button onClick={pauseTimer}>{isPaused ? "Resume" : "Pause"}</button>
      </div>

      <Link to="/home"><button>Back</button></Link>
    </div>
  );
}

export default StudyNow;
