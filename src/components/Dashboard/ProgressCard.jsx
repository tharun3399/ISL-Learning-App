import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import './ProgressCard.css'

/**
 * ProgressCard Component
 * 
 * Displays:
 * - Donut chart showing lesson completion percentage
 * - Community rank and percentile
 * - Community member avatars
 * - Streak and stats
 */

export default function ProgressCard({ completionPercent, completedLessons, totalLessons }) {
  // Mock community data
  const communityRank = 14
  const percentile = 73
  const streakDays = 5

  const donutData = [
    { name: 'Completed', value: completionPercent },
    { name: 'Remaining', value: 100 - completionPercent }
  ]

  const COLORS = ['#00CFFF', 'rgba(255,255,255,0.15)']

  return (
    <aside className="progress-card" role="complementary" aria-label="Progress summary">
      <div className="progress-card__header">
        <h2 className="progress-card__title">Your Progress</h2>
      </div>

      {/* Donut Chart */}
      <div className="progress-card__chart-container">
        <p className="progress-card__subtitle">Overall Completion</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={105}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {donutData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="progress-card__percent">
          <div className="progress-card__percent-value">{completionPercent}%</div>
          <div className="progress-card__percent-label">Complete</div>
        </div>
      </div>

      {/* Stats */}
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

      {/* Rank Card */}
      <div className="progress-card__rank">
        <div className="progress-card__rank-header">
          <h3 className="progress-card__rank-title">Community Rank</h3>
        </div>
        <div className="progress-card__rank-content">
          <div className="progress-card__rank-number">#{communityRank}</div>
          <div className="progress-card__rank-percentile">Top {percentile}%</div>
        </div>

        {/* Avatar Row */}
        <div className="progress-card__avatars">
          <div className="progress-card__avatar">A</div>
          <div className="progress-card__avatar">R</div>
          <div className="progress-card__avatar">S</div>
          <span className="progress-card__more">+12 more</span>
        </div>
      </div>
    </aside>
  )
}
