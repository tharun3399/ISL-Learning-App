import React, { useState } from 'react'
import './Sidebar.css'

/**
 * Sidebar Component
 * 
 * Responsive sidebar navigation with smooth slide-in/slide-out animations
 * - Hamburger menu toggle button always visible
 * - Smooth CSS transitions for open/close
 * - Overlay dimming when sidebar opens
 * - Touch-friendly on mobile
 */

export default function Sidebar({ onMenuClick }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  const handleMenuItemClick = (item) => {
    if (onMenuClick) {
      onMenuClick(item)
    }
    closeSidebar()
  }

  const menuItems = [
    { id: 'home', label: '🏠 Home', action: 'home' },
    { id: 'settings', label: '⚙️ Settings', action: 'settings' },
    { id: 'support', label: '❓ Support', action: 'support' },
    { id: 'account', label: '👤 Account', action: 'account' },
  ]

  return (
    <>
      {/* Hamburger Toggle Button - Always Visible */}
      <button
        className="sidebar-toggle-btn"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar menu"
        aria-expanded={isOpen}
        title={isOpen ? 'Close menu' : 'Open menu'}
      >
        <span className="hamburger-icon">
          <span className="line line-1"></span>
          <span className="line line-2"></span>
          <span className="line line-3"></span>
        </span>
      </button>

      {/* Overlay Backdrop */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          role="presentation"
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <h2 className="sidebar-title">Navigation</h2>
          <button
            className="sidebar-close-btn"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.id} className="sidebar-menu-item">
                <button
                  className="sidebar-menu-link"
                  onClick={() => handleMenuItemClick(item.action)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <p className="sidebar-footer-text">ISL Academy v1.0</p>
        </div>
      </aside>
    </>
  )
}
