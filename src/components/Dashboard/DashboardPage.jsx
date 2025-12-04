import React from 'react'
import Dashboard from './Dashboard'
import Navbar from './navbar/Navbar'
import SettingsPage from './navbar/settings/SettingsPage'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import AccountSection from './navbar/account/AccountSection'

export default function DashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleAccountClick = () => {
    // Only navigate to account if we're not already there
    if (location.pathname !== '/dashboard/account') {
      navigate('account')
    }
  }

  const handleBackToDashboard = () => {
    navigate('')
  }

  const handleSettingsClick = () => {
    // Only navigate to settings if we're not already there
    if (location.pathname !== '/dashboard/settings') {
      navigate('settings')
    }
  }

  return (
    <Routes>
      <Route index element={
        <div className="dashboard-container">
          <Navbar onAccountClick={handleAccountClick} onSettingsClick={handleSettingsClick} onHomeClick={handleBackToDashboard} />
          <Dashboard />
        </div>
      } />
      <Route
        path="account"
        element={
          <div className="dashboard-container">
            <Navbar onAccountClick={handleAccountClick} onSettingsClick={handleSettingsClick} onHomeClick={handleBackToDashboard} />
            <main style={{ flex: 1, overflow: 'auto', background: 'var(--gradient)' }}>
              <AccountSection />
            </main>
          </div>
        }
      />
      <Route
        path="settings"
        element={
          <div className="dashboard-container">
            <Navbar onAccountClick={handleAccountClick} onSettingsClick={handleSettingsClick} onHomeClick={handleBackToDashboard} />
            <main style={{ flex: 1, overflow: 'auto', background: 'var(--gradient)' }}>
              <SettingsPage />
            </main>
          </div>
        }
      />
    </Routes>
  )
}
