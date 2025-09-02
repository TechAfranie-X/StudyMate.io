import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAnimation } from '../contexts/AnimationContext'

const PremiumDataVisualization = ({ data, type = 'bar' }) => {
  const { reducedMotion } = useAnimation()
  const [selectedData, setSelectedData] = useState(null)
  const [isExporting, setIsExporting] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [visibleSeries, setVisibleSeries] = useState(new Set())
  const [hoveredItem, setHoveredItem] = useState(null)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  // Initialize visible series
  useEffect(() => {
    if (data && data.length > 0) {
      const series = new Set(data.map(item => item.series || 'default'))
      setVisibleSeries(series)
    }
  }, [data])

  const handleExport = async (format) => {
    setIsExporting(true)
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create download link
    const content = generateExportContent(format)
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `studymate-data.${format}`
    a.click()
    URL.revokeObjectURL(url)
    
    setIsExporting(false)
  }

  const generateExportContent = (format) => {
    if (format === 'csv') {
      const headers = ['Category', 'Value', 'Series', 'Date']
      const rows = data.map(item => [
        item.category,
        item.value,
        item.series || 'default',
        item.date || new Date().toISOString()
      ])
      return [headers, ...rows].map(row => row.join(',')).join('\n')
    } else {
      return JSON.stringify(data, null, 2)
    }
  }

  const handleZoom = (direction) => {
    setZoomLevel(prev => {
      const newZoom = direction === 'in' ? prev * 1.2 : prev / 1.2
      return Math.max(0.5, Math.min(3, newZoom))
    })
  }

  const handlePan = (e) => {
    if (isDragging) {
      setPanOffset(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }))
    }
  }

  const toggleSeries = (series) => {
    setVisibleSeries(prev => {
      const newSet = new Set(prev)
      if (newSet.has(series)) {
        newSet.delete(series)
      } else {
        newSet.add(series)
      }
      return newSet
    })
  }

  const resetView = () => {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }

  const renderBarChart = () => {
    if (!data || data.length === 0) return null

    const maxValue = Math.max(...data.map(item => item.value))
    const barWidth = 40
    const barSpacing = 20
    const chartHeight = 200

    return (
      <div className="relative overflow-hidden">
        <svg
          width="100%"
          height={chartHeight}
          className="chart-container"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: 'center'
          }}
        >
          {/* Grid lines */}
          {[...Array(5)].map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={(chartHeight / 4) * i}
              x2="100%"
              y2={(chartHeight / 4) * i}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="1"
            />
          ))}

          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight * 0.8
            const x = index * (barWidth + barSpacing) + 50
            const y = chartHeight - barHeight - 20

            return (
              <motion.g
                key={index}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{
                  duration: reducedMotion ? 0.1 : 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <motion.rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={item.color || '#6366f1'}
                  rx="4"
                  whileHover={{ 
                    scaleY: 1.05,
                    fill: item.color || '#4f46e5'
                  }}
                  transition={{ duration: 0.2 }}
                />
                
                {/* Value label */}
                <text
                  x={x + barWidth / 2}
                  y={y - 10}
                  textAnchor="middle"
                  className="text-xs font-medium fill-current"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.value}
                </text>

                {/* Category label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 5}
                  textAnchor="middle"
                  className="text-xs fill-current"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {item.category}
                </text>
              </motion.g>
            )
          })}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredItem && (
            <motion.div
              className="absolute bg-surface border border-border rounded-lg p-3 shadow-lg pointer-events-none z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                left: `${hoveredItem.index * 60 + 70}px`,
                top: '20px'
              }}
            >
              <div className="text-sm font-medium text-text-primary">
                {hoveredItem.category}
              </div>
              <div className="text-lg font-bold text-primary">
                {hoveredItem.value}
              </div>
              {hoveredItem.series && (
                <div className="text-xs text-text-muted">
                  Series: {hoveredItem.series}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const renderPieChart = () => {
    if (!data || data.length === 0) return null

    const total = data.reduce((sum, item) => sum + item.value, 0)
    const radius = 80
    let currentAngle = 0

    return (
      <div className="relative">
        <svg width="200" height="200" className="mx-auto">
          <g transform="translate(100, 100)">
            {data.map((item, index) => {
              const sliceAngle = (item.value / total) * 2 * Math.PI
              const startAngle = currentAngle
              const endAngle = currentAngle + sliceAngle
              
              const x1 = radius * Math.cos(startAngle)
              const y1 = radius * Math.sin(startAngle)
              const x2 = radius * Math.cos(endAngle)
              const y2 = radius * Math.sin(endAngle)
              
              const largeArcFlag = sliceAngle > Math.PI ? 1 : 0
              
              const pathData = [
                `M 0 0`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ')

              currentAngle = endAngle

              return (
                <motion.path
                  key={index}
                  d={pathData}
                  fill={item.color || '#6366f1'}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{
                    duration: reducedMotion ? 0.1 : 0.8,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    filter: "brightness(1.1)"
                  }}
                  onClick={() => setSelectedData(item)}
                />
              )
            })}
          </g>
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">{total}</div>
            <div className="text-sm text-text-muted">Total</div>
          </div>
        </div>
      </div>
    )
  }

  const renderLineChart = () => {
    if (!data || data.length === 0) return null

    const points = data.map((item, index) => ({
      x: index * 50 + 50,
      y: 200 - (item.value / Math.max(...data.map(d => d.value))) * 150
    }))

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ')

    return (
      <div className="relative">
        <svg width="100%" height="200" className="chart-container">
          {/* Grid */}
          {[...Array(5)].map((_, i) => (
            <line
              key={i}
              x1="0"
              y1={(200 / 4) * i}
              x2="100%"
              y2={(200 / 4) * i}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="1"
            />
          ))}

          {/* Line */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reducedMotion ? 0.1 : 1.5, ease: "easeInOut" }}
          />

          {/* Points */}
          {points.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#6366f1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: reducedMotion ? 0.1 : 0.3,
                delay: index * 0.1
              }}
              whileHover={{ scale: 1.5, fill: '#4f46e5' }}
            />
          ))}
        </svg>
      </div>
    )
  }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart()
      case 'pie':
        return renderPieChart()
      case 'line':
        return renderLineChart()
      default:
        return renderBarChart()
    }
  }

  return (
    <div className="bg-surface rounded-card border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {type === 'bar' && <BarChart3 className="w-5 h-5 text-primary" />}
          {type === 'pie' && <PieChart className="w-5 h-5 text-primary" />}
          {type === 'line' && <TrendingUp className="w-5 h-5 text-primary" />}
          <h3 className="text-lg font-semibold text-text-primary">Data Visualization</h3>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {/* Zoom controls */}
          <div className="flex items-center space-x-1 bg-surface-elevated rounded-lg p-1">
            <motion.button
              onClick={() => handleZoom('out')}
              className="p-1 rounded hover:bg-surface transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ZoomOut size={16} />
            </motion.button>
            <span className="text-xs text-text-muted px-2">{Math.round(zoomLevel * 100)}%</span>
            <motion.button
              onClick={() => handleZoom('in')}
              className="p-1 rounded hover:bg-surface transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ZoomIn size={16} />
            </motion.button>
          </div>

          {/* Reset view */}
          <motion.button
            onClick={resetView}
            className="p-2 bg-surface-elevated rounded-lg hover:bg-surface transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Reset view"
          >
            <RotateCcw size={16} />
          </motion.button>

          {/* Export */}
          <motion.button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="p-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Export data"
          >
            {isExporting ? (
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <Download size={16} />
            )}
          </motion.button>
        </div>
      </div>

      {/* Legend */}
      {data && data.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Filter size={16} className="text-text-muted" />
            <span className="text-sm font-medium text-text-secondary">Series</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from(visibleSeries).map(series => (
              <motion.button
                key={series}
                onClick={() => toggleSeries(series)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  visibleSeries.has(series)
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-surface-elevated text-text-muted border border-border'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {visibleSeries.has(series) ? <Eye size={12} /> : <EyeOff size={12} />}
                <span>{series}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Chart Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg bg-surface-elevated p-4"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseMove={handlePan}
        onMouseLeave={() => setIsDragging(false)}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {renderChart()}
      </div>

      {/* Selected Data Details */}
      <AnimatePresence>
        {selectedData && (
          <motion.div
            className="mt-4 p-4 bg-surface-elevated rounded-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <h4 className="font-medium text-text-primary mb-2">Selected Item</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-muted">Category:</span>
                <span className="ml-2 text-text-primary">{selectedData.category}</span>
              </div>
              <div>
                <span className="text-text-muted">Value:</span>
                <span className="ml-2 text-text-primary font-medium">{selectedData.value}</span>
              </div>
              {selectedData.series && (
                <div>
                  <span className="text-text-muted">Series:</span>
                  <span className="ml-2 text-text-primary">{selectedData.series}</span>
                </div>
              )}
              {selectedData.date && (
                <div>
                  <span className="text-text-muted">Date:</span>
                  <span className="ml-2 text-text-primary">
                    {new Date(selectedData.date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PremiumDataVisualization
















