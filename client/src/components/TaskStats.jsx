import { useState, useEffect } from 'react'
import { Pie, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { motion } from 'framer-motion'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const TaskStats = ({ tasks = [] }) => {
  const [chartType, setChartType] = useState('pie')
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    inProgress: 0,
    total: 0
  })

  // Calculate stats from tasks
  useEffect(() => {
    const completed = tasks.filter(task => task.status === 'completed').length
    const pending = tasks.filter(task => task.status === 'pending').length
    const inProgress = tasks.filter(task => task.status === 'in-progress').length
    const total = tasks.length

    setStats({
      completed,
      pending,
      inProgress,
      total
    })
  }, [tasks])

  // Chart configuration
  const chartData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        data: [stats.completed, stats.inProgress, stats.pending],
        backgroundColor: [
          '#10B981', // Green for completed
          '#3B82F6', // Blue for in-progress
          '#F59E0B', // Amber for pending
        ],
        borderColor: [
          '#059669',
          '#2563EB',
          '#D97706',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          '#059669',
          '#2563EB',
          '#D97706',
        ],
      },
    ],
  }

  const barData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        label: 'Number of Tasks',
        data: [stats.completed, stats.inProgress, stats.pending],
        backgroundColor: [
          '#10B981',
          '#3B82F6',
          '#F59E0B',
        ],
        borderColor: [
          '#059669',
          '#2563EB',
          '#D97706',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12,
            weight: '500'
          },
          color: '#374151'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          family: 'Inter, system-ui, sans-serif',
          size: 14,
          weight: '600'
        },
        bodyFont: {
          family: 'Inter, system-ui, sans-serif',
          size: 13
        }
      }
    }
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          family: 'Inter, system-ui, sans-serif',
          size: 14,
          weight: '600'
        },
        bodyFont: {
          family: 'Inter, system-ui, sans-serif',
          size: 13
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
          drawBorder: false
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12
          },
          color: '#6b7280'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12,
            weight: '500'
          },
          color: '#374151'
        }
      }
    }
  }

  const StatCard = ({ title, value, color, icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          color="text-gray-900"
          icon={
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          }
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          color="text-green-600"
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          color="text-blue-600"
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          color="text-amber-600"
          icon={
            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Chart Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Task Distribution</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartType('pie')}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  chartType === 'pie'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Pie Chart
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  chartType === 'bar'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Bar Chart
              </button>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="p-6">
          <div className="h-80">
            {chartType === 'pie' ? (
              <Pie data={chartData} options={pieOptions} />
            ) : (
              <Bar data={barData} options={barOptions} />
            )}
          </div>
        </div>

        {/* Chart Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <span className="font-medium">
              {stats.total > 0 
                ? `${Math.round((stats.completed / stats.total) * 100)}% completed`
                : 'No tasks yet'
              }
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default TaskStats

