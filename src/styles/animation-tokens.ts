export const animationTokens = {
  // Durations
  duration: {
    fast: 0.15,    // 150ms for micro-interactions
    base: 0.25,    // 250ms for standard transitions
    slow: 0.40,    // 400ms for larger modal/page animations
  },
  // Easings
  ease: {
    standard: [0.4, 0.0, 0.2, 1],    // easeInOut (standard)
    accelerate: [0.4, 0.0, 1, 1],    // easeIn (for exiting elements)
    decelerate: [0.0, 0.0, 0.2, 1],   // easeOut (for entering elements)
  }
} as const;
