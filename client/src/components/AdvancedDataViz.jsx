import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';

// Interactive Bar Chart Component
export const InteractiveBarChart = ({ 
  data = [], 
  height = 300, 
  width = "100%",
  className = "" 
}) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [selectedBars, setSelectedBars] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState(0);
  const chartRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = Math.max(40, (width - 100) / data.length);
  const chartWidth = data.length * barWidth * zoomLevel;

  const handleBarClick = (index) => {
    setSelectedBars(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX - panOffset;
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      const newOffset = e.clientX - startX.current;
      setPanOffset(Math.max(-chartWidth + width, Math.min(0, newOffset)));
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleZoom = (direction) => {
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + direction * 0.2)));
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset(0);
    setSelectedBars([]);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Chart Controls */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Interactive Chart
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleZoom(-1)}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={() => handleZoom(1)}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={resetView}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div 
        ref={chartRef}
        className="relative overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
        style={{ height, width }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width={chartWidth}
          height={height}
          style={{ transform: `translateX(${panOffset}px)` }}
          className="transition-transform duration-200"
        >
          {/* Grid Lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={i}
              x1={0}
              y1={(height / 4) * i}
              x2={chartWidth}
              y2={(height / 4) * i}
              stroke="#E5E7EB"
              strokeWidth={1}
              strokeDasharray="5,5"
            />
          ))}

          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * (height - 60);
            const x = index * barWidth + barWidth / 2;
            const y = height - 30 - barHeight;
            const isSelected = selectedBars.includes(index);
            const isHovered = hoveredBar === index;

            return (
              <g key={index}>
                {/* Bar */}
                <motion.rect
                  x={x - barWidth / 2}
                  y={y}
                  width={barWidth - 4}
                  height={barHeight}
                  fill={isSelected ? "#3B82F6" : "#60A5FA"}
                  rx={4}
                  initial={{ height: 0, y: height - 30 }}
                  animate={{ height: barHeight, y }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                  onClick={() => handleBarClick(index)}
                  className="cursor-pointer"
                  whileHover={{ 
                    fill: isSelected ? "#2563EB" : "#3B82F6",
                    scale: 1.05
                  }}
                  style={{
                    filter: isHovered ? "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" : "none"
                  }}
                />

                {/* Value Label */}
                <motion.text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-700 dark:fill-gray-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {item.value}
                </motion.text>

                {/* X-axis Label */}
                <motion.text
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-xs fill-gray-500 dark:fill-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.7 }}
                >
                  {item.label}
                </motion.text>
              </g>
            );
          })}

          {/* Hover Tooltip */}
          {hoveredBar !== null && (
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pointer-events-none"
            >
              <rect
                x={hoveredBar * barWidth + barWidth / 2 - 30}
                y={20}
                width={60}
                height={40}
                fill="rgba(0,0,0,0.8)"
                rx={6}
              />
              <text
                x={hoveredBar * barWidth + barWidth / 2}
                y={35}
                textAnchor="middle"
                className="text-xs fill-white font-medium"
              >
                {data[hoveredBar].label}
              </text>
              <text
                x={hoveredBar * barWidth + barWidth / 2}
                y={50}
                textAnchor="middle"
                className="text-xs fill-white"
              >
                {data[hoveredBar].value}
              </text>
            </motion.g>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-400 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Normal</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Selected</span>
        </div>
      </div>
    </div>
  );
};

// Real-time Line Chart
export const RealTimeLineChart = ({ 
  data = [], 
  height = 300, 
  width = "100%",
  className = "" 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const svgRef = useRef(null);

  useEffect(() => {
    if (isPlaying && data.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % data.length);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, data.length]);

  const visibleData = data.slice(0, currentIndex + 1);
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const getPath = () => {
    if (visibleData.length < 2) return "";
    
    const points = visibleData.map((point, index) => {
      const x = (index / (data.length - 1)) * (width - 40) + 20;
      const y = height - 30 - ((point.value - minValue) / range) * (height - 60);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    });
    
    return points.join(' ');
  };

  const getAreaPath = () => {
    if (visibleData.length < 2) return "";
    
    const points = visibleData.map((point, index) => {
      const x = (index / (data.length - 1)) * (width - 40) + 20;
      const y = height - 30 - ((point.value - minValue) / range) * (height - 60);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    });
    
    // Close the area path
    const lastPoint = points[points.length - 1];
    const lastX = lastPoint.split(' ')[1];
    return `${points.join(' ')} L ${lastX} ${height - 30} L 20 ${height - 30} Z`;
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Real-time Line Chart
        </h3>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isPlaying 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="overflow-visible"
        >
          {/* Grid Lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={i}
              x1={20}
              y1={(height - 60) / 4 * i + 20}
              x2={width - 20}
              y2={(height - 60) / 4 * i + 20}
              stroke="#E5E7EB"
              strokeWidth={1}
              strokeDasharray="5,5"
            />
          ))}

          {/* Area Fill */}
          <motion.path
            d={getAreaPath()}
            fill="url(#areaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Line */}
          <motion.path
            d={getPath()}
            stroke="#3B82F6"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          {/* Data Points */}
          {visibleData.map((point, index) => {
            const x = (index / (data.length - 1)) * (width - 40) + 20;
            const y = height - 30 - ((point.value - minValue) / range) * (height - 60);
            
            return (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r={4}
                fill="#3B82F6"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.5, r: 6 }}
              />
            );
          })}

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Current Value Display */}
      <div className="mt-4 text-center">
        <motion.div
          key={currentIndex}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-bold text-blue-600 dark:text-blue-400"
        >
          {visibleData[currentIndex]?.value || 0}
        </motion.div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {visibleData[currentIndex]?.label || 'No data'}
        </div>
      </div>
    </div>
  );
};

// Animated Export Component
export const AnimatedExport = ({ 
  onExport, 
  format = "json",
  className = "" 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          onExport();
          return 0;
        }
        return prev + 10;
      });
    }, 100);
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={handleExport}
        disabled={isExporting}
        className={`relative px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors overflow-hidden ${
          isExporting ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
        whileHover={!isExporting ? { scale: 1.05 } : {}}
        whileTap={!isExporting ? { scale: 0.95 } : {}}
      >
        <div className="flex items-center space-x-2">
          <Download size={20} />
          <span>
            {isExporting ? 'Exporting...' : `Export ${format.toUpperCase()}`}
          </span>
        </div>

        {/* Progress Bar */}
        {isExporting && (
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-green-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        )}
      </motion.button>

      {/* Success Animation */}
      <AnimatePresence>
        {progress === 100 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              ✓
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Custom Cursor Component
export const CustomCursor = ({ 
  children, 
  cursorType = "default",
  className = "" 
}) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const cursorVariants = {
    default: { scale: 1, opacity: 0 },
    pointer: { scale: 1.5, opacity: 1 },
    text: { scale: 0.8, opacity: 1 },
    grab: { scale: 1.2, opacity: 1, rotate: 0 },
    grabbing: { scale: 1.2, opacity: 1, rotate: 45 }
  };

  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Custom Cursor */}
      <motion.div
        className="fixed pointer-events-none z-50"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          transform: 'translate(-50%, -50%)'
        }}
        variants={cursorVariants}
        animate={isHovered ? cursorType : "default"}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28
        }}
      >
        <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
      </motion.div>
    </div>
  );
};

export default {
  InteractiveBarChart,
  RealTimeLineChart,
  AnimatedExport,
  CustomCursor
};

