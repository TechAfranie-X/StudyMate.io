import { motion } from 'framer-motion'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'

const Chart = ({ 
  data = [], 
  type = 'line',
  width = 400,
  height = 200,
  showTooltip = true,
  gradient = true,
  className = ''
}) => {
  const [hoveredPoint, setHoveredPoint] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  if (!data.length) return null

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((point.value - minValue) / range) * height
    return { ...point, x, y }
  })

  const pathData = points.map((point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`
    return `L ${point.x} ${point.y}`
  }).join(' ')

  const areaPathData = `${pathData} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  const handlePointHover = (point, event) => {
    if (showTooltip) {
      setHoveredPoint(point)
      const rect = event.currentTarget.getBoundingClientRect()
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      })
    }
  }

  const handlePointLeave = () => {
    setHoveredPoint(null)
  }

  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Gradient Definitions */}
        {gradient && (
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        )}

        {/* Area Fill */}
        {type === 'line' && gradient && (
          <motion.path
            d={areaPathData}
            fill="url(#chartGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        )}

        {/* Line Path */}
        {type === 'line' && (
          <motion.path
            d={pathData}
            stroke="var(--color-primary)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        )}

        {/* Data Points */}
        {points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="var(--color-primary)"
            stroke="white"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            whileHover={{ scale: 1.5 }}
            onMouseEnter={(e) => handlePointHover(point, e)}
            onMouseLeave={handlePointLeave}
            className="cursor-pointer"
          />
        ))}

        {/* Bars for bar chart */}
        {type === 'bar' && (
          <>
            {points.map((point, index) => (
              <motion.rect
                key={index}
                x={point.x - 15}
                y={point.y}
                width="30"
                height={height - point.y}
                fill="var(--color-primary)"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ scaleY: 1.05 }}
                onMouseEnter={(e) => handlePointHover(point, e)}
                onMouseLeave={handlePointLeave}
                className="cursor-pointer"
              />
            ))}
          </>
        )}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredPoint && showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bg-surface border border-border rounded-lg shadow-lg px-3 py-2 text-sm pointer-events-none z-10"
            style={{
              left: tooltipPosition.x - 50,
              top: tooltipPosition.y - 40
            }}
          >
            <div className="font-medium text-text-primary">
              {hoveredPoint.label}
            </div>
            <div className="text-text-secondary">
              {hoveredPoint.value}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Chart

















