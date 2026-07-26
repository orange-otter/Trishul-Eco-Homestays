import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeUpRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeUpReveal({ children, delay = 0, className = "" }: FadeUpRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
