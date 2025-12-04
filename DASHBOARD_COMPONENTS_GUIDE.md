# Dashboard Components - Line-by-Line Code Explanation

---

## 1. DashboardPage.jsx

**Purpose:** Router wrapper that handles navigation between Dashboard and Account views.

```jsx
import React from 'react'
import Dashboard from './Dashboard'
import Navbar from './navbar/Navbar'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import AccountSection from './navbar/account/AccountSection'
```
**Explanation:**
- Import React and router hooks
- `useNavigate` - change routes programmatically
- `useLocation` - get current URL path

```jsx
export default function DashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()
```
**Explanation:**
- `navigate()` - function to navigate to different routes
- `location.pathname` - current URL (e.g., "/dashboard/account")

```jsx
  const handleAccountClick = () => {
    if (location.pathname !== '/dashboard/account') {
      navigate('account')
    }
  }
```
**Explanation:**
- Check if already on account page
- If not, navigate there
- Prevents unnecessary re-renders

```jsx
  const handleBackToDashboard = () => {
    navigate('')
  }
```
**Explanation:**
- Navigate to parent route (/dashboard)

```jsx
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="account" element={...} />
    </Routes>
  )
}
```
**Explanation:**
- `<Routes>` - container for all routes
- `<Route index>` - default route (/dashboard)
- `<Route path="account">` - account route (/dashboard/account)

---

## 2. Dashboard.jsx

**Purpose:** Main 3-column layout with resize functionality.

```jsx
const mockLessons = [
  { id: 1, title: 'Hello & Greetings', description: 'Learn basic greetings in ISL', duration: 5, completed: true },
  // ... more lessons
]
```
**Explanation:**
- Sample lesson data
- Each lesson: id, title, description, duration (minutes), completed status

```jsx
export default function Dashboard() {
  const [lessons, setLessons] = useState(mockLessons)
  const [selectedLessonId, setSelectedLessonId] = useState(null)
  const [lessonListWidth, setLessonListWidth] = useState(55) // percent
  const [isResizing, setIsResizing] = useState(false)
  const dashboardMainRef = useRef(null)
  const navigate = useNavigate()
```
**Explanation:**
- `lessons` - all lessons array
- `selectedLessonId` - currently selected lesson (null = none)
- `lessonListWidth` - lesson list width % (55% default)
- `isResizing` - flag for dragging resize handle
- `dashboardMainRef` - reference to container for mouse position

```jsx
  const handleToggleLesson = id => {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, completed: !l.completed } : l))
  }
```
**Explanation:**
- Loop through lessons
- Find lesson with matching id
- Toggle `completed` property (true ↔ false)
- Keep other lessons unchanged

```jsx
  const completedCount = lessons.filter(l => l.completed).length
  const completionPercent = Math.round((completedCount / lessons.length) * 100)
```
**Explanation:**
- `filter()` - get only completed lessons
- `.length` - count them
- Calculate percentage: (completed / total) × 100
- `Math.round()` - round to whole number

```jsx
  const handleMouseDown = e => {
    setIsResizing(true)
    document.body.style.cursor = 'col-resize'
  }
```
**Explanation:**
- User clicked resize handle
- Set resize flag to true
- Change cursor to resize icon

```jsx
  const handleMouseUp = () => {
    setIsResizing(false)
    document.body.style.cursor = ''
  }
```
**Explanation:**
- User released mouse
- Stop resize mode
- Restore cursor

```jsx
  const handleMouseMove = e => {
    if (!isResizing || !dashboardMainRef.current) return
    const rect = dashboardMainRef.current.getBoundingClientRect()
    let x = e.clientX - rect.left
    let percent = (x / rect.width) * 100
    percent = Math.max(30, Math.min(70, percent))
    setLessonListWidth(percent)
  }
```
**Explanation:**
- Only run if dragging (`isResizing = true`)
- `getBoundingClientRect()` - get container size/position
- `e.clientX` - mouse X position on screen
- `rect.left` - container's left edge
- `x` - mouse position relative to container
- `percent` - convert position to percentage
- `Math.max(30, ...)` - ensure minimum 30%
- `Math.min(..., 70)` - ensure maximum 70%

```jsx
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
```
**Explanation:**
- When `isResizing` changes:
  - If `true` - add global mouse listeners
  - If `false` - remove listeners
- `return () => {...}` - cleanup when component unmounts
- Prevents memory leaks

```jsx
      <Navbar onAccountClick={handleAccountClick} onHomeClick={() => window.location.href = '/dashboard'} />
```
**Explanation:**
- Pass handler functions to Navbar as props
- `onHomeClick` - reload dashboard page

```jsx
      <main className="dashboard-main" ref={dashboardMainRef}>
        <div style={{ width: `calc(${lessonListWidth}% - 4px)`, ... }}>
          <LessonList lessons={lessons} selectedId={selectedLessonId} onSelect={handleSelectLesson} onToggleComplete={handleToggleLesson} />
        </div>
```
**Explanation:**
- `ref={dashboardMainRef}` - attach reference for resize calculation
- `width: calc(55% - 4px)` - lesson list takes 55% minus resize handle width
- Pass lessons data and handlers to LessonList

```jsx
        <div className="dashboard-resize-handle" onMouseDown={handleMouseDown} ... />
```
**Explanation:**
- 8px invisible resize handle
- `onMouseDown={handleMouseDown}` - trigger resize on click
- `role="separator"` - accessibility (screen reader)
- `cursor: 'col-resize'` - show resize cursor

```jsx
        <aside style={{ width: `calc(${100 - lessonListWidth}% - 4px)` }}>
          <ProgressCard completionPercent={completionPercent} completedLessons={completedCount} totalLessons={lessons.length} />
        </aside>
```
**Explanation:**
- `<aside>` - semantic sidebar element
- `width: calc(45% - 4px)` - takes remaining space (100 - 55 = 45%)
- Pass progress data to ProgressCard

---

## 3. LessonList.jsx

**Purpose:** Container displaying all lessons.

```jsx
export default function LessonList({ lessons, selectedId, onSelect, onToggleComplete }) {
  return (
    <main className="lesson-list-container" role="main" aria-label="Lesson list">
```
**Explanation:**
- Receive 4 props from Dashboard component
- `role="main"` - accessibility: this is main content
- `aria-label` - screen reader description

```jsx
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
```
**Explanation:**
- `<ul>` - unordered list
- `.map()` - loop through lessons array
- Create `LessonItem` for each lesson
- `key={lesson.id}` - React optimization (unique identifier)
- `isSelected={selectedId === lesson.id}` - check if selected
- Pass handlers to LessonItem

---

## 4. LessonItem.jsx

**Purpose:** Individual lesson card with checkbox.

```jsx
export default function LessonItem({ lesson, isSelected, onSelect, onToggleComplete }) {
  const handleClick = () => {
    onSelect(lesson.id)
  }
```
**Explanation:**
- Call `onSelect` callback with lesson id
- Tell parent which lesson was clicked

```jsx
  const handleCheckboxChange = (e) => {
    e.stopPropagation()
    onToggleComplete(lesson.id)
  }
```
**Explanation:**
- `e.stopPropagation()` - prevent click from bubbling to parent
- Call toggle completion handler

```jsx
  return (
    <li
      className={`lesson-item ${isSelected ? 'lesson-item--selected' : ''} ${lesson.completed ? 'lesson-item--completed' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      aria-label={`${lesson.title}, ${lesson.duration} minutes`}
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
```
**Explanation:**
- Dynamic CSS classes based on state
- `onClick` - select lesson
- `role="button"` - treat like button for accessibility
- `tabIndex={0}` - make keyboard focusable
- `aria-selected` - screen reader: if selected
- `aria-label` - screen reader: full description
- `onKeyDown` - handle keyboard:
  - Enter/Space: select
  - C: toggle completion

```jsx
      <div className="lesson-item__check">
        <input
          type="checkbox"
          checked={lesson.completed}
          onChange={handleCheckboxChange}
          className="lesson-item__checkbox"
        />
        {lesson.completed && <FiCheck size={16} className="lesson-item__checkicon" />}
      </div>
```
**Explanation:**
- Checkbox controlled by `lesson.completed`
- `onChange` - call toggle handler
- Show checkmark icon only if completed

```jsx
      <div className="lesson-item__content">
        <h3 className="lesson-item__title">{lesson.title}</h3>
        <p className="lesson-item__description">{lesson.description}</p>
        <div className="lesson-item__footer">
          <span className="lesson-item__duration">⏱ {lesson.duration} min</span>
          {lesson.completed && <span className="lesson-item__badge">Completed</span>}
        </div>
      </div>
```
**Explanation:**
- Title, description, duration display
- Show "Completed" badge only if completed

---

## 5. ProgressCard.jsx

**Purpose:** Display progress visualization and stats.

```jsx
export default function ProgressCard({ completionPercent, completedLessons, totalLessons }) {
  const communityRank = 14
  const percentile = 73
  const streakDays = 5
```
**Explanation:**
- Receive progress data as props
- Mock community data (hardcoded)

```jsx
  const donutData = [
    { name: 'Completed', value: completionPercent },
    { name: 'Remaining', value: 100 - completionPercent }
  ]
  const COLORS = ['#00ff7f', 'rgba(0, 217, 255, 0.1)']
```
**Explanation:**
- Create donut chart data (two segments)
- Completed = green, remaining = light cyan

```jsx
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {donutData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
```
**Explanation:**
- `<ResponsiveContainer>` - responsive chart sizing
- `innerRadius={60}` - donut hole size
- `outerRadius={100}` - donut outer size
- `.map()` - loop through segments, apply colors

```jsx
        <div className="progress-card__percent">
          <div className="progress-card__percent-value">{completionPercent}%</div>
          <div className="progress-card__percent-label">Complete</div>
        </div>
```
**Explanation:**
- Display percentage in center of donut chart

```jsx
      <div className="progress-card__stats">
        <div className="progress-card__stat">
          <div className="progress-card__stat-value">{completedLessons}/{totalLessons}</div>
          <div className="progress-card__stat-label">Lessons</div>
        </div>
        <div className="progress-card__stat">
          <div className="progress-card__stat-value">{streakDays}</div>
          <div className="progress-card__stat-label">Day Streak</div>
        </div>
      </div>
```
**Explanation:**
- Two stat cards in grid
- Show lessons completed (e.g., 3/10)
- Show streak days (e.g., 5)

```jsx
      <div className="progress-card__rank">
        <div className="progress-card__rank-content">
          <div className="progress-card__rank-number">#{communityRank}</div>
          <div className="progress-card__rank-percentile">Top {percentile}%</div>
        </div>
        <div className="progress-card__avatars">
          <div className="progress-card__avatar">A</div>
          <div className="progress-card__avatar">R</div>
          <div className="progress-card__avatar">S</div>
          <span className="progress-card__more">+12 more</span>
        </div>
      </div>
```
**Explanation:**
- Display rank number (#14)
- Display percentile (Top 73%)
- Show community avatars (A, R, S)
- Show "+12 more" indicator

---

## CSS Key Points

### Dashboard.css

```css
:root {
  --bg-dark: #0a0e27;
  --accent: #00ff7f;
  --accent-cyan: #00d9ff;
}
```
**Explanation:** CSS variables for consistent colors

```css
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-dark) 0%, var(--bg-dark-secondary) 100%);
}
```
**Explanation:**
- `display: flex` - horizontal layout
- `min-height: 100vh` - full screen height
- `linear-gradient` - diagonal color blend

```css
.dashboard-main {
  display: flex;
  flex: 1;
  gap: 0;
}
```
**Explanation:**
- `flex: 1` - take remaining space
- `gap: 0` - no space between columns

### LessonItem.css

```css
.lesson-item {
  display: flex;
  gap: 1.5rem;
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
}

.lesson-item:hover {
  border-left-color: #00d9ff;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 217, 255, 0.15);
}

.lesson-item--selected {
  border-left-color: #00d9ff;
  background: rgba(0, 217, 255, 0.1);
}
```
**Explanation:**
- Flex layout for checkbox + content
- Left border changes color on hover/select
- Smooth transitions (0.2s)
- Lift effect on hover (`translateY(-2px)`)

---

## Quick Summary

| Component | Purpose |
|-----------|---------|
| **DashboardPage** | Router - shows Dashboard or Account |
| **Dashboard** | Main layout - manages state, resize, routes |
| **LessonList** | Container - loops through lessons |
| **LessonItem** | Card - checkbox, select, keyboard nav |
| **ProgressCard** | Stats - donut chart, rank, community |

Each component has clear responsibility and passes data via props.
