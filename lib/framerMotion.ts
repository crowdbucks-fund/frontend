import { motion } from 'framer-motion'

export const variants = {
  fadeInBottom: {
    opacity: 0,
    y: 50,
  },
  fadeInRight: {
    opacity: 0,
    x: 50,
  },
  fadeInLeft: {
    opacity: 0,
    x: -50,
  },
  fadeInTop: {
    opacity: 0,
    y: -50,
  },
  reset: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      delay: 0.3,
    },
  },
  resetDelayed1: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      delay: 0.5,
    },
  },
  resetDelayed2: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      delay: 0.7,
    },
  },
}

export const scrollAnimate = (initial: keyof typeof variants, whileInView: keyof typeof variants) => ({
  as: motion.div,
  initial,
  whileInView,
  variants,
  viewport: { once: true },
})
