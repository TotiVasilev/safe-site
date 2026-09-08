"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

type RevealDirection = "up" | "down" | "left" | "right" | "fade";

type RevealProps = {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  className?: string;
};

export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  className = "",
}: RevealProps) {
  const directions = {
    up: {
      x: 0,
      y: 40,
    },
    down: {
      x: 0,
      y: -40,
    },
    left: {
      x: 50,
      y: 0,
    },
    right: {
      x: -50,
      y: 0,
    },
    fade: {
      x: 0,
      y: 0,
    },
  };

  const initialPosition = directions[direction];

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: initialPosition.x,
        y: initialPosition.y,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}