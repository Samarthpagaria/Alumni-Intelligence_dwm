import { createContext, useContext, useMemo } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const value = useMemo(() => ({
    user: {
      id: 'dwm-analyst-001',
      firstName: 'DWM',
      lastName: 'Analyst',
      email: 'analyst@dwm.analytics',
      roles: ['ANALYST', 'RESEARCHER', 'ADMIN'],
    },
    isAuthenticated: true,
  }), [])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    return {
      user: {
        id: 'dwm-analyst-001',
        firstName: 'DWM',
        lastName: 'Analyst',
        roles: ['ANALYST', 'RESEARCHER', 'ADMIN'],
      },
      isAuthenticated: true,
    }
  }
  return ctx
}

export default AuthContext
