import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './RegisterPage.css'
import axios from 'axios'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  // optional: basic client-side validation example
  if (!formData.email || !formData.name) {
    alert('Name and email are required');
    return;
  }

  try {
    console.log('Registering user with', formData);
    const res = await axios.post('http://localhost:5000/register', formData);
    console.log('Registration successful:', res.data);
    // optionally show success message before navigate
    navigate('/dashboard');
  } catch (err) {
    console.error('Registration error:', err);
    const msg = err.response?.data?.message || 'Registration failed. Please try again.';
    alert(msg);
  }
};

  const togglePasswordVisibility = (e) => {
    e.preventDefault()
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = (e) => {
    e.preventDefault()
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">Create Account</h1>
        <p className="register-subtitle">Join our community today</p>

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="form-input"
              pattern="[0-9]{10,15}"
              title="Please enter a valid phone number"
            />
          </div>

          <div className="form-group">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
              />
              <button 
                className="password-toggle-btn" 
                onClick={togglePasswordVisibility}
                type="button"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-input"
              />
              <button 
                className="password-toggle-btn" 
                onClick={toggleConfirmPasswordVisibility}
                type="button"
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button type="submit" className="register-btn">Create Account</button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <button onClick={() => navigate('/login')} className="sign-in-link">Sign in</button></p>
        </div>
      </div>
    </div>
  )
}
