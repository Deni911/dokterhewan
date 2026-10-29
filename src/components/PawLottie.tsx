import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Lottie from "lottie-react";
import type { LottieRefCurrentProps } from "lottie-react";

const pawAnimation = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 120,
  w: 128,
  h: 128,
  nm: "Paw breathing and pulse",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Paw",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [64, 64, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            {
              t: 0,
              s: [100, 100, 100],
              e: [103, 103, 100],
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
            },
            {
              t: 30,
              s: [103, 103, 100],
              e: [100, 100, 100],
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
            },
            {
              t: 60,
              s: [100, 100, 100],
              e: [112, 112, 100],
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
            },
            {
              t: 68,
              s: [112, 112, 100],
              e: [96, 96, 100],
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
            },
            {
              t: 80,
              s: [96, 96, 100],
              e: [108, 108, 100],
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
            },
            {
              t: 94,
              s: [108, 108, 100],
              e: [100, 100, 100],
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
            },
            { t: 120, s: [100, 100, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          nm: "Paw pads",
          it: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [20, 25] },
              p: { a: 0, k: [0, 0] },
              nm: "Top left toe",
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.16, 0.55, 0.78, 1] },
              o: { a: 0, k: 100 },
              r: 1,
              nm: "Blue fill",
            },
            {
              ty: "tr",
              p: { a: 0, k: [-25, -19] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: -20 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 },
              nm: "Toe position",
            },
          ],
        },
        {
          ty: "gr",
          nm: "Top right toe",
          it: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [20, 25] },
              p: { a: 0, k: [0, 0] },
              nm: "Ellipse",
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.16, 0.55, 0.78, 1] },
              o: { a: 0, k: 100 },
              r: 1,
              nm: "Blue fill",
            },
            {
              ty: "tr",
              p: { a: 0, k: [25, -19] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 20 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 },
              nm: "Toe position",
            },
          ],
        },
        {
          ty: "gr",
          nm: "Left toe",
          it: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [20, 25] },
              p: { a: 0, k: [0, 0] },
              nm: "Ellipse",
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.16, 0.55, 0.78, 1] },
              o: { a: 0, k: 100 },
              r: 1,
              nm: "Blue fill",
            },
            {
              ty: "tr",
              p: { a: 0, k: [-34, 7] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: -38 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 },
              nm: "Toe position",
            },
          ],
        },
        {
          ty: "gr",
          nm: "Right toe",
          it: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [20, 25] },
              p: { a: 0, k: [0, 0] },
              nm: "Ellipse",
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.16, 0.55, 0.78, 1] },
              o: { a: 0, k: 100 },
              r: 1,
              nm: "Blue fill",
            },
            {
              ty: "tr",
              p: { a: 0, k: [34, 7] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 38 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 },
              nm: "Toe position",
            },
          ],
        },
        {
          ty: "gr",
          nm: "Main pad",
          it: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [45, 34] },
              p: { a: 0, k: [0, 0] },
              nm: "Ellipse",
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.16, 0.55, 0.78, 1] },
              o: { a: 0, k: 100 },
              r: 1,
              nm: "Blue fill",
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 24] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 },
              nm: "Pad position",
            },
          ],
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0,
    },
  ],
};

export default function PawLottie() {
  const animationRef = useRef<LottieRefCurrentProps>(null);
  const isHoveredRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const playBreathingLoop = () => {
    if (prefersReducedMotion) {
      animationRef.current?.goToAndStop(0, true);
    } else if (!isHoveredRef.current) {
      animationRef.current?.playSegments([0, 60], true);
    }
  };

  const playPulse = () => {
    isHoveredRef.current = true;
    if (!prefersReducedMotion) {
      animationRef.current?.playSegments([60, 120], true);
    }
  };

  const resetToBreathing = () => {
    isHoveredRef.current = false;
    if (prefersReducedMotion) {
      animationRef.current?.goToAndStop(0, true);
    } else {
      animationRef.current?.playSegments([0, 60], true);
    }
  };

  return (
    <motion.div
      className="flex h-40 w-40 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md md:h-52 md:w-52"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
      whileHover={{ scale: 1.035 }}
      onMouseEnter={playPulse}
      onMouseLeave={resetToBreathing}
      aria-hidden="true"
    >
      <Lottie
        lottieRef={animationRef}
        animationData={pawAnimation}
        autoplay={false}
        loop={false}
        onDOMLoaded={playBreathingLoop}
        onComplete={playBreathingLoop}
        className="h-32 w-32 md:h-44 md:w-44"
      />
    </motion.div>
  );
}
