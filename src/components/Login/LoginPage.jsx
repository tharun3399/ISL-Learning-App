import React, { useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import './LoginPage.css'
import { AuthContext } from '../../context/AuthContext' // adjust path if needed

function SocialButton({ children, onClick, className }) {
  return (
    <button type="button" className={`social-btn ${className || ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = location.state?.from?.pathname || '/dashboard'

  // auth context: set auth state after login
  const { setState: setAuthState } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleLogin(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // POST to your server's login route.
      // withCredentials:true is required if server sets httpOnly cookie
      const res = await axios.post(
        'http://localhost:5000/login',
        { email, password },
        { withCredentials: true }
      )

      // login success — server returns minimal user info in body (or cookie)
      const user = res.data.user || res.data // adapt to your server response shape

      // update global auth state so RequireAuth and other components know we're logged in
      if (setAuthState) {
        setAuthState({ authenticated: true, user, loading: false })
      }

      console.log('Login success:', res.data)

      // navigate back to where the user wanted to go (or dashboard)
      navigate(returnTo, { replace: true })
    } catch (err) {
      console.error('Login failed', err)
      const msg = err.response?.data?.message || err.message || 'Login failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  function forgotPassword(e) {
    e.preventDefault()
    alert('Password reset link has been sent to your email.')
  }

  const togglePasswordVisibility = (e) => {
    e.preventDefault()
    setShowPassword(!showPassword)
  }

  return (
    <div className="page-bg">
      <div className="container">
        <div className="card">
          <div className="card-left">
            <div className="brand">Indian Sign Language Academy</div>
            <h1 className="title">Welcome back</h1>
            <p className="subtitle">Sign in to continue to your dashboard</p>

            <form className="form" onSubmit={handleLogin}>
              <label className="label">Email</label>
              <input
                className="input underline"
                type="email"
                placeholder="you@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="pw-row">
                <div style={{ flex: 1 }}>
                  <label className="label">Password</label>
                  <br />
                  <div className="password-input-wrapper">
                    <input
                      className="input underline password-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="password-toggle-btn"
                      onClick={togglePasswordVisibility}
                      type="button"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <div className="input-help">Use at least 8 characters. Avoid common words.</div>
                </div>
                <button className="forgot" onClick={forgotPassword} type="button">Forgot?</button>
              </div>

              {error && <div style={{ color: 'red', margin: '8px 0' }}>{error}</div>}

              <button type="submit" className="primary" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <div className="divider"><span>or</span></div>

            <div className="social-row">
              <SocialButton className="google" onClick={() => console.log('Google sign-in')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </SocialButton>
            </div>

            <div className="footer">
              Don't have an account?
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register') }}>
                Sign up
              </a>
            </div>
          </div>

          <div className="card-right">
            <div className="right-inner">
              <h2>New here?</h2>
              <p>Learn ISL at your own pace with our interactive lessons and expert instructors.</p>
              <button
                className="ghost"
                onClick={() => navigate('/register')}
                type="button"
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
