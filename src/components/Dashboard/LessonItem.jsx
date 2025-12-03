import React from 'react'
import { FiCheck } from 'react-icons/fi'
import './LessonItem.css'

/**
 * LessonItem Component
 * 
 * Individual lesson card with:
 * - Completion checkbox
 * - Title and description
 * - Duration badge
 * - Left accent border for selected state
 * - Hover and focus effects with smooth transitions
 * - Keyboard accessible (Enter/Space to toggle)
 */

export default function LessonItem({ lesson, isSelected, onSelect, onToggleComplete }) {
  const handleClick = () => {
    onSelect(lesson.id)
  }

  const handleCheckboxChange = (e) => {
    e.stopPropagation()
    onToggleComplete(lesson.id)
  }

  return (
    <li
      className={`lesson-item ${isSelected ? 'lesson-item--selected' : ''} ${lesson.completed ? 'lesson-item--completed' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      aria-label={`${lesson.title}, ${lesson.duration} minutes, ${lesson.completed ? 'completed' : 'not completed'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        } else if (e.key === 'c' || e.key === 'C') {
          e.preventDefault()
          handleCheckboxChange({ stopPropagation: () => {} })
        }
      }}
    >
      <div className="lesson-item__check">
        <input
          type="checkbox"
          checked={lesson.completed}
          onChange={handleCheckboxChange}
          aria-label={`Mark ${lesson.title} as ${lesson.completed ? 'incomplete' : 'complete'}`}
          className="lesson-item__checkbox"
        />
        {lesson.completed && <FiCheck size={16} className="lesson-item__checkicon" />}
      </div>

      <div className="lesson-item__content">
        <h3 className="lesson-item__title">{lesson.title}</h3>
        <p className="lesson-item__description">{lesson.description}</p>
        <div className="lesson-item__footer">
          <span className="lesson-item__duration">⏱ {lesson.duration} min</span>
          {lesson.completed && <span className="lesson-item__badge">Completed</span>}
        </div>
      </div>

      <div className="lesson-item__accent" aria-hidden="true"></div>
    </li>
  )
}
