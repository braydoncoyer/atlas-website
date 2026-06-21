"use client";

import { AnimatePresence, motion } from "motion/react";

/**
 * A number that vertical-rolls when its value changes: the old value slides
 * down and out while the new value slides in from the top (clipped). Driven by
 * Framer Motion (JS), so it animates reliably regardless of CSS animation
 * handling. No animation on first mount (AnimatePresence `initial={false}`).
 *
 * Easing is ease-out-quart (cubic-bezier(0.165, 0.84, 0.44, 1)) from the
 * animation skill's blueprint — entering/exiting elements use ease-out. We only
 * animate transform + opacity (no filter/blur) to keep the small text crisp.
 */
export default function RollingNumber({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-flex overflow-hidden tabular-nums ${className ?? ""}`}
    >
      {/* invisible sizer reserves the box; the animated layer is absolute */}
      <span aria-hidden="true" className="invisible">
        {value.toLocaleString()}
      </span>
      <AnimatePresence initial={false}>
        <motion.span
          key={value}
          className="absolute inset-0"
          initial={{ y: "-110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "110%", opacity: 0 }}
          transition={{ duration: 0.34, ease: [0.165, 0.84, 0.44, 1] }}
        >
          {value.toLocaleString()}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
