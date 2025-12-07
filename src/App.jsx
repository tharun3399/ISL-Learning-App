// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import RequireAuth from './components/RequireAuth'

import LoginPage from './components/Login/LoginPage'
import RegisterPage from './components/Register/RegisterPage'
import VideoPage from './components/Video/VideoPage'
import DashboardPage from './components/Dashboard/DashboardPage'
import Test from './components/test/test'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            {/* public */}
            <Route path='/' element={<Test />} />
            <Route path="/VideoPage" element={<VideoPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* protected group */}
            <Route element={<RequireAuth />}>
              <Route path="/dashboard/*" element={<DashboardPage />} />
            </Route>

            {/* redirect any /login/* to /login (handles /login/dashboard) */}
            <Route path="/login/*" element={<Navigate to="/login" replace />} />

            {/* catch-all: unknown paths → send to login (or change to '/' if you prefer) */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
