import React from 'react'
import { motion } from 'framer-motion'

const transition = { duration: 4, yoyo: Infinity, ease: "easeInOut" }

export default function CommunityOrientationTop() {
  return (
    <svg
      width='100%'
      height='100%'
      viewBox='0 0 423 316'
      fill='none'
    >
      <motion.path
        d='M1 208.977C69.6667 287.751 218.5 399.135 264.5 214.473C310.5 29.8102 388.667 -4.36436 422 1.63117'
        stroke='#FC6653'
        strokeLinecap='round'
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={transition}
      />
    </svg>
  )
}
