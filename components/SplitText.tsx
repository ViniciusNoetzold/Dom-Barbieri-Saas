import React from 'react';
import { motion, Variants } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string; // Mapped to framer motion easings
  splitType?: 'chars' | 'words'; // Simplified for Framer
  from?: { opacity: number; y: number };
  to?: { opacity: number; y: number };
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 0,
  duration = 0.5,
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  onLetterAnimationComplete
}) => {
  // Split text into characters
  const characters = text.split("");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03, // Controls the ripple speed between letters
        delayChildren: delay / 1000, // Convert ms to s
      }
    }
  };

  const childVariants: Variants = {
    hidden: { 
      opacity: from.opacity, 
      y: from.y 
    },
    visible: {
      opacity: to.opacity,
      y: to.y,
      transition: {
        duration: duration,
        ease: [0.22, 1, 0.36, 1], // Power3.out equivalent in Cubic Bezier
      }
    }
  };

  return (
    <motion.div
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onAnimationComplete={onLetterAnimationComplete}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={childVariants}
          className="inline-block"
          style={{ whiteSpace: "pre" }} // Preserve spaces
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default SplitText;