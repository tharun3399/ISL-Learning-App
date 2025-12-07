import React, { useState, useRef } from 'react'
import LessonList from './LessonList'
import ProgressCard from './ProgressCard'
import Avatar3D from './Avatar3D'
import './Dashboard.css'

/**
 * Dashboard Component
 * 
 * Main dashboard layout for ISL lesson learning experience.
 * Three-column layout: Navbar | Lesson List | Progress Card + Avatar
 * 
 * Required packages:
 * - npm i recharts react-icons three
 */

const mockLessons = [
  { id: 1, title: 'Hello & Greetings', description: 'Learn basic greetings in ISL', duration: 5, completed: true },
  { id: 2, title: 'Numbers 1-10', description: 'Master counting from 1 to 10', duration: 8, completed: true },
  { id: 3, title: 'Family Members', description: 'Sign family relationships', duration: 6, completed: true },
  { id: 4, title: 'Colors', description: 'Learn colors in sign language', duration: 7, completed: false },
  { id: 5, title: 'Days of Week', description: 'Sign days and time concepts', duration: 6, completed: false },
  { id: 6, title: 'Common Questions', description: 'Ask and answer basic questions', duration: 10, completed: false },
  { id: 7, title: 'Food & Drinks', description: 'Sign food and beverage items', duration: 8, completed: false },
  { id: 8, title: 'Sports & Activities', description: 'Sign sports and leisure activities', duration: 9, completed: false },
  { id: 9, title: 'Emotions', description: 'Express feelings and emotions', duration: 7, completed: false },
  { id: 10, title: 'Daily Routines', description: 'Sign everyday activities', duration: 11, completed: false },
]

export default function Dashboard() {
  const [lessons, setLessons] = useState(mockLessons)
  const [selectedLessonId, setSelectedLessonId] = useState(null)
  const [lessonListWidth, setLessonListWidth] = useState(55) // percent
  const [isResizing, setIsResizing] = useState(false)
  const dashboardMainRef = useRef(null)

  const handleToggleLesson = id => {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, completed: !l.completed } : l))
  }

  const handleSelectLesson = id => setSelectedLessonId(id)

  const completedCount = lessons.filter(l => l.completed).length
  const completionPercent = Math.round((completedCount / lessons.length) * 100)

  // Resize logic
  const handleMouseDown = e => {
    setIsResizing(true)
    document.body.style.cursor = 'col-resize'
  }
  const handleMouseUp = () => {
    setIsResizing(false)
    document.body.style.cursor = ''
  }
  const handleMouseMove = e => {
    if (!isResizing || !dashboardMainRef.current) return
    const rect = dashboardMainRef.current.getBoundingClientRect()
    let x = e.clientX - rect.left
    let percent = (x / rect.width) * 100
    // Clamp between 30% and 70%
    percent = Math.max(30, Math.min(70, percent))
    setLessonListWidth(percent)
  }

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  return (
    <main className="dashboard-main" ref={dashboardMainRef}>
        <div
          style={{ width: `calc(${lessonListWidth}% - 4px)`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        >
          <LessonList
            lessons={lessons}
            selectedId={selectedLessonId}
            onSelect={handleSelectLesson}
            onToggleComplete={handleToggleLesson}
          />
        </div>
        <div
          className="dashboard-resize-handle"
          onMouseDown={handleMouseDown}
          role="separator"
          aria-orientation="vertical"
          tabIndex={0}
          title="Resize sections"
          style={{ height: '100%', width: '8px', cursor: 'col-resize', background: 'transparent', borderRadius: '6px', position: 'relative', zIndex: 2 }}
        />
        <aside
          className="dashboard-aside"
          style={{ width: `calc(${100 - lessonListWidth}% - 4px)`, display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}
        >
          <ProgressCard
            completionPercent={completionPercent}
            completedLessons={completedCount}
            totalLessons={lessons.length}
          />
          <Avatar3D />
        </aside>
      </main>
    )
}
