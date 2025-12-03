import React from 'react'
import LessonItem from './LessonItem'
import './LessonList.css'

/**
 * LessonList Component
 * 
 * Displays vertical list of lesson cards with:
 * - Title and description for each lesson
 * - Duration badge
 * - Completion indicator
 * - Selection and completion toggle
 * - Keyboard accessible with focus states
 * - Hover effects with scale and shadow
 */

export default function LessonList({ lessons, selectedId, onSelect, onToggleComplete }) {
  return (
    <main className="lesson-list-container" role="main" aria-label="Lesson list">
      <div className="lesson-list-header">
        <h2 className="lesson-list-title">Your Lessons</h2>
        <p className="lesson-list-subtitle">Progress through Indian Sign Language lessons</p>
      </div>

      <ul className="lesson-list">
        {lessons.map(lesson => (
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            isSelected={selectedId === lesson.id}
            onSelect={onSelect}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </ul>
    </main>
  )
}
