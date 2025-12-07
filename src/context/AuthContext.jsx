import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'

export const AuthContext = createContext({ authenticated: false, user: null })

export function AuthProvider({ children }) {
  const [state, setState] = useState({ authenticated: false, user: null, loading: true })

  useEffect(() => {
    // ask server if session is valid (cookie-based) OR validate token
    axios.get('http://localhost:5000/profile', { withCredentials: true })
      .then(res => setState({ authenticated: true, user: res.data.user || res.data, loading: false }))
      .catch(() => setState({ authenticated: false, user: null, loading: false }))
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, setState }}>
      {children}
    </AuthContext.Provider>
  )
}
