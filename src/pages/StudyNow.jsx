import { useState } from "react";
import { motion } from "framer-motion";

function StudyNow() {
  const [stage, setStage] = useState(0);
  const stages = ["🐛", "🟡 Cocoon", "🦋 Butterfly"];

  const nextStage = () => {
    if (stage < stages.length - 1) {
      setStage(stage + 1);
    }
  };

  return (
    <div>
      <h2>Study Now</h2>
      <motion.div animate={{ scale: 1.2 }} transition={{ duration: 0.5 }}>
        <p>{stages[stage]}</p>
      </motion.div>
      <button onClick={nextStage}>Study!</button>
    </div>
  );
}

export default StudyNow;