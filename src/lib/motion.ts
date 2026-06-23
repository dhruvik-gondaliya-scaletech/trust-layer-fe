import { animationTokens } from "@/styles/animation-tokens";

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: animationTokens.duration.base,
      ease: animationTokens.ease.decelerate,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: animationTokens.duration.fast,
      ease: animationTokens.ease.accelerate,
    },
  },
};

export const slideUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animationTokens.duration.base,
      ease: animationTokens.ease.decelerate,
    },
  },
  exit: {
    opacity: 0,
    y: 12,
    transition: {
      duration: animationTokens.duration.fast,
      ease: animationTokens.ease.accelerate,
    },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: animationTokens.duration.base,
      ease: animationTokens.ease.decelerate,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: animationTokens.duration.fast,
      ease: animationTokens.ease.accelerate,
    },
  },
};

export const modalVariants = {
  backdrop: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: animationTokens.duration.base,
        ease: animationTokens.ease.decelerate,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: animationTokens.duration.fast,
        ease: animationTokens.ease.accelerate,
      },
    },
  },
  container: {
    hidden: { opacity: 0, scale: 0.95, y: 8 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: animationTokens.duration.slow,
        ease: animationTokens.ease.decelerate,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 8,
      transition: {
        duration: animationTokens.duration.fast,
        ease: animationTokens.ease.accelerate,
      },
    },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};
