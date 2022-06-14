import React from 'react'
import { motion } from 'framer-motion'

const transition = { duration: 4, yoyo: Infinity, ease: 'easeInOut' }

export default function CommunityOrientationBottom() {
  return (
    <svg width='100%' height='100%' viewBox='0 0 470 397' fill='none'>
      <motion.path
        d='M409.978 1C341.815 19.5234 234.587 78.398 350.981 165.708C496.473 274.847 508.973 381.982 379.98 334.923C250.987 287.863 65.4965 304.885 1 396'
        stroke='#FC6653'
        strokeLinecap='round'
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={transition}
      />
    </svg>
  )
}
