import React, { useState } from 'react'
import { FiHome, FiSettings, FiHelpCircle, FiUser, FiMenu, FiX } from 'react-icons/fi'
import './Navbar.css'

/**
 * Navbar Component
 * 
 * Vertical navigation bar with collapsible mobile menu.
 * Shows icons + labels on desktop, collapses on mobile.
 */

export default function Navbar({ activeTab, onTabChange, onAccountClick }) {
  const navItems = [
    { label: 'Home', icon: FiHome, id: 'home' },
    { label: 'Settings', icon: FiSettings, id: 'settings' },
    { label: 'Support', icon: FiHelpCircle, id: 'support' },
    { label: 'Account', icon: FiUser, id: 'account' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <div className="navbar-brand">ISL Academy</div>
        <button
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <ul className={`navbar-menu ${isOpen ? 'open' : ''}`}>
        {navItems.map(item => {
          const Icon = item.icon
          return (
            <li key={item.id}>
              <a
                href="#"
                className="navbar-item"
                onClick={e => e.preventDefault()}
                aria-label={item.label}
              >
                <Icon size={20} className="navbar-icon" />
                <span className="navbar-label">{item.label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
