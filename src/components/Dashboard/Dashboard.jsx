import React, { useState } from 'react'
import Navbar from './Navbar'
import LessonList from './LessonList'
import ProgressCard from './ProgressCard'
import './Dashboard.css'

/**
 * Dashboard Component
 * 
 * Main dashboard layout for ISL lesson learning experience.
 * Three-column layout: Navbar | Lesson List | Progress Card
 * 
 * Required packages:
 * - npm i recharts react-icons
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
  const [selectedLessonId, setSelectedLessonId] = useState(1)

  const completedCount = lessons.filter(l => l.completed).length
  const completionPercent = Math.round((completedCount / lessons.length) * 100)

  const handleToggleLesson = (id) => {
    setLessons(prev => 
      prev.map(lesson => 
        lesson.id === id ? { ...lesson, completed: !lesson.completed } : lesson
      )
    )
  }

  const handleSelectLesson = (id) => {
    setSelectedLessonId(id)
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <main className="dashboard-main">
        <LessonList
          lessons={lessons}
          selectedId={selectedLessonId}
          onSelect={handleSelectLesson}
          onToggleComplete={handleToggleLesson}
        />
        
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
