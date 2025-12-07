import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import LessonList from './LessonList'
import ProgressCard from './ProgressCard'
import { mockLessons } from './mockData'
import './Dashboard.css'

export default function Dashboard() {
  const [lessons, setLessons] = useState(mockLessons)
  const [resizeWidth, setResizeWidth] = useState(60)
  const [isResizing, setIsResizing] = useState(false)

  const completedCount = lessons.filter(l => l.completed).length
  const completionPercent = Math.round((completedCount / lessons.length) * 100)

  // Handle lesson toggle
  const handleToggleLesson = (id) => {
    setLessons(prev =>
      prev.map(lesson =>
        lesson.id === id
          ? { ...lesson, completed: !lesson.completed }
          : lesson
      )
    )
  }

  // Mouse events for resize
  const handleMouseDown = () => setIsResizing(true)
  const handleMouseUp = () => setIsResizing(false)
  const handleMouseMove = (e) => {
    if (!isResizing) return
    const container = document.querySelector('.dashboard-main')
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100
    if (newWidth > 30 && newWidth < 80) {
      setResizeWidth(newWidth)
    }
  }

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing])

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        {/* Lesson List Section */}
        <div
          className="lesson-list-container"
          style={{ flex: `0 0 ${resizeWidth}%` }}
        >
          <LessonList
            lessons={lessons}
            onToggleLesson={handleToggleLesson}
          />
        </div>

        {/* Resize Handle */}
        <div
          className="dashboard-resize-handle"
          onMouseDown={handleMouseDown}
        />

        {/* Progress Card Section */}
        <aside className="dashboard-aside">
          <ProgressCard
            completionPercent={completionPercent}
            completedLessons={completedCount}
            totalLessons={lessons.length}
          />
        </aside>
      </main>
    </div>
  )
}
