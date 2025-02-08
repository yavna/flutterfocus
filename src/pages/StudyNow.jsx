import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Countdown from 'react-countdown';

function StudyNow() {
  const [stage, setStage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60000); // Example: 1 minute countdown (in ms)
  const [isPaused, setIsPaused] = useState(false); // To control the pause state
  const [isStarted, setIsStarted] = useState(false); // To control if timer is started or not

  const stages = ["🐛", "🟡 Cocoon", "🦋 Butterfly"];

  const nextStage = () => {
    if (stage < stages.length - 1) {
      setStage(stage + 1);
      setIsStarted(true); // Start the timer when stage button is clicked
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
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
    } else {
      clearInterval(interval);
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
      </div>

      <button onClick={nextStage}>Next Stage</button>
    </div>
  );
}

export default StudyNow;
