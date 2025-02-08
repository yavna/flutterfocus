import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Countdown from 'react-countdown';
import { Link } from "react-router-dom";
import { incrementCounter } from './Home';

function StudyNow() {
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

  return (
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
  );
}

export default StudyNow;
