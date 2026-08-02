'use client'

import { useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Heart, Pin } from 'lucide-react'
import useComments from '@/hooks/useComments'

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: smoothEase,
    },
  },
}

export default function CommentsSection() {
  const { comments, loading, addComment, likeComment } =
    useComments()

  const [name, setName] = useState('')
  const [comment, setComment] = useState('')

  const handleSubmit = async () => {
    if (!name.trim() || !comment.trim()) return

  await addComment({
      name,
      comment,
      image: null, // Pass null since we are no longer uploading images
    })

    setName('')
    setComment('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.8,
        ease: smoothEase,
      }}
      viewport={{ once: false, amount: 0.2 }}
      className="rounded-[28px] md:rounded-[34px] border border-white/10 bg-white/5 backdrop-blur-xl p-5 md:p-8 h-full"
    >
      {/* HEADER */}
      <div className="mb-5 md:mb-6">
        <h3 className="text-xl md:text-2xl font-semibold mb-1">
          Comments
        </h3>

        <p className="text-xs md:text-sm text-white/40">
          Leave your thoughts here
        </p>
      </div>

      {/* FORM */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false }}
        className="space-y-3 md:space-y-4 mb-5 md:mb-6"
      >
        <motion.input
          variants={itemVariants}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 md:py-4 outline-none focus:border-white"
        />

        <motion.textarea
          variants={itemVariants}
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Your Comment"
          className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 md:py-4 outline-none resize-none focus:border-white"
        />

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-2xl py-3 md:py-4 bg-white/10 border border-white/10 transition-all"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </motion.button>
      </motion.div>

      {/* COMMENTS LIST */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false }}
        className="rounded-[24px] md:rounded-[28px] border border-white/10 bg-black/20 p-3 h-[320px] md:h-[420px] overflow-y-auto custom-scroll"
      >
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {comments.map((item, i) => (
              <motion.div
                key={item.id || i}
                layout
                initial={{
                  opacity: 0,
                  y: 18,
                  scale: 0.96,
                  filter: 'blur(6px)',
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.55,
                  ease: smoothEase,
                  layout: {
                    duration: 0.45,
                    ease: smoothEase,
                  },
                }}
                className={`rounded-[20px] md:rounded-[24px] border p-3 md:p-4 ${
                  item.is_pinned
                    ? 'border-purple-500/30 bg-purple-500/5'
                    : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <div className="flex gap-3">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold shrink-0">
                    {item.name?.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-medium">
                        {item.name}
                      </p>

                      {item.is_pinned && (
                        <div className="flex items-center gap-1 px-2 py-[3px] rounded-full bg-purple-500/15 border border-purple-500/20 text-[10px] text-purple-300">
                          <Pin size={10} />
                          PINNED
                        </div>
                      )}
                    </div>

                    <p className="text-[12px] md:text-[13px] text-white/55">
                      {item.comment}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      likeComment(item.id, item.likes)
                    }
                    className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white transition-colors"
                  >
                    <Heart size={13} />
                    {item.likes || 0}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}