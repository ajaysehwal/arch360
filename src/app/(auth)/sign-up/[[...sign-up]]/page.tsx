"use client";
import { SignUp } from '@clerk/nextjs'
import { motion } from 'framer-motion'

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-4"
      >
        <SignUp />
      </motion.div>
    </div>
  )
}