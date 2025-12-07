// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import RequireAuth from './components/RequireAuth'

import LoginPage from './components/Login/LoginPage'
import RegisterPage from './components/Register/RegisterPage'
import GoogleSignupComplete from './components/Register/GoogleSignupComplete'
import VideoPage from './components/Video/VideoPage'
import DashboardPage from './components/Dashboard/DashboardPage'
import Test from './components/test/test'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE'

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <ThemeProvider>
            <Routes>
              {/* public */}
              <Route path='/' element={<Test />} />
              <Route path="/VideoPage" element={<VideoPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/register/complete" element={<GoogleSignupComplete />} />

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
    </GoogleOAuthProvider>
  )
}
