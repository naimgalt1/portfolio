import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * ParallaxText
 * Slides children vertically as the host section scrolls through the viewport.
 * `distance` controls how far (in px) the content travels by the time the
 * section reaches the bottom of the viewport.
 *
 * Usage: <ParallaxText distance={180}><h2>Title</h2></ParallaxText>
 */
export default function ParallaxText({
  children,
  distance = 160,
  className = "",
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, distance]);

  return (
    <motion.div ref={ref} style={{ y, willChange: "transform" }} className={className}>
      {children}
    </motion.div>
  );
}
