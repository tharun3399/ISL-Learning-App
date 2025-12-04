import React from 'react'
import { useTheme } from '../../../../context/ThemeContext'
import './SettingsPage.css'

export default function SettingsPage() {
  const { currentTheme, applyTheme, themes } = useTheme()

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Customize your learning experience</p>
      </div>

      <div className="settings-card">
        <div className="settings-section">
          <h2 className="section-title">⚙️ Display Settings</h2>

          <div className="settings-group">
            <label className="settings-label">Theme</label>
            <p className="settings-description">Choose your preferred color theme across the app</p>

            <div className="theme-grid">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  className={`theme-option ${currentTheme === key ? 'theme-option--active' : ''}`}
                  onClick={() => applyTheme(key)}
                  style={{
                    backgroundColor: theme.bgDark,
                    borderColor: currentTheme === key ? theme.accent : theme.borderColor,
                  }}
                >
                  <div className="theme-preview">
                    <div
                      className="theme-color-1"
                      style={{ backgroundColor: theme.accent }}
                    ></div>
                    <div
                      className="theme-color-2"
                      style={{ backgroundColor: theme.accentCyan }}
                    ></div>
                    <div
                      className="theme-color-3"
                      style={{ backgroundColor: theme.accentPink }}
                    ></div>
                  </div>
                  <span
                    className="theme-name"
                    style={{ color: theme.textPrimary }}
                  >
                    {theme.name}
                  </span>
                  {currentTheme === key && (
                    <div className="theme-checkmark">✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-info">
            <p>
              <strong>Current Theme:</strong> {themes[currentTheme].name}
            </p>
            <p>Your theme preference is automatically saved and applied to all pages.</p>
          </div>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-section">
          <h2 className="section-title">ℹ️ About</h2>
          <p className="about-text">ISL Academy v1.0</p>
          <p className="about-text">Learn Indian Sign Language at your own pace</p>
        </div>
      </div>
    </div>
  )
}
