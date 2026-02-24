"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const easeOutSoft: [number, number, number, number] = [0.22, 1, 0.36, 1];

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  amount?: number;
};

type MotionStaggerProps = {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  amount?: number;
};

type MotionStaggerItemProps = {
  children: ReactNode;
  className?: string;
  duration?: number;
  y?: number;
};

export function MotionReveal({
  children,
  className,
  delay = 0,
  duration = 0.45,
  y = 18,
  amount = 0.2,
}: MotionRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: easeOutSoft }}
    >
      {children}
    </motion.div>
  );
}

export function MotionStagger({
  children,
  className,
  staggerChildren = 0.08,
  delayChildren = 0,
  amount = 0.2,
}: MotionStaggerProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerItem({
  children,
  className,
  duration = 0.4,
  y = 14,
}: MotionStaggerItemProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration, ease: easeOutSoft },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
