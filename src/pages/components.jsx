import React from 'react';
import { motion } from 'framer-motion';

const Caterpillar = () => {
  return (
    <div style={{ overflow: 'hidden', width: '300px', height: '200px' }}>
      <motion.img
        src="assets/caterpillar.gif"
        alt="Moving image"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        animate={{
          x: [0, 50, 0],
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </div>
  );
};

export default Caterpillar;
