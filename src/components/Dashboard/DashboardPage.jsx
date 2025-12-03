/**
 * Dashboard Page - Modern ISL Lesson Learning Dashboard
 * 
 * Features:
 * - Three-column responsive layout
 * - Navbar with navigation
 * - Lesson list with selection and completion tracking
 * - Progress visualization with donut chart
 * - Community rank information
 * - Fully keyboard accessible
 * - Mobile responsive
 * 
 * Installation:
 * npm install recharts react-icons
 * 
 * Usage in App.jsx:
 * <Route path="/dashboard" element={<DashboardPage />} />
 */

import React from 'react'
import Dashboard from './Dashboard'

import { Routes, Route } from 'react-router-dom'
import AccountSection from '../Account/AccountSection'

export default function DashboardPage() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="account" element={<AccountSection />} />
    </Routes>
  )
}
