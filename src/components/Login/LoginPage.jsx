import React from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

function SocialButton({ children, onClick, className }) {
  return (
    <button className={`social-btn ${className || ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  
  function handleLogin(e) {
    e.preventDefault()
    navigate('/dashboard')
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
              />

              <div className="pw-row">
                <div style={{flex:1}}>
                  <label className="label">Password</label>
                  <br />
                  <input 
                    className="input underline password-input" 
                    type="password" 
                    placeholder="Enter your password" 
                    required 
                  />
                  <div className="input-help">Use at least 8 characters. Avoid common words.</div>
                </div>
                <a className="forgot" href="#">Forgot?</a>
              </div>

              <button type="submit" className="primary">Sign in</button>
            </form>

            <div className="divider"><span>or</span></div>

            <div className="social-row">
              <SocialButton className="google">
                <span>🔍</span> Google
              </SocialButton>
              <SocialButton className="github">
                <span>💻</span> GitHub
              </SocialButton>
              <SocialButton className="facebook">
                <span>👥</span> Facebook
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
