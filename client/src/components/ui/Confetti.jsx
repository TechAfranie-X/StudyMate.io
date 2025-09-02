import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const Confetti = ({ 
  isVisible = false, 
  duration = 3000,
  particleCount = 50,
  colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
}) => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (isVisible) {
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => {
        setParticles([])
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, particleCount, colors])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`
          }}
          initial={{
            y: -10,
            x: particle.x,
            rotation: particle.rotation,
            scale: 0
          }}
          animate={{
            y: [null, 110],
            x: [null, particle.x + (Math.random() - 0.5) * 20],
            rotation: [particle.rotation, particle.rotation + 360],
            scale: [0, particle.scale, 0]
          }}
          transition={{
            duration: 3,
            delay: particle.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
}

export default Confetti

















