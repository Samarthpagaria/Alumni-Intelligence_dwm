import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AnalyticsLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()
  const location = useLocation()

  const navItems = [
    {
      to: '/analytics',
      end: true,
      label: 'Overview',
      badge: 'Cockpit',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      to: '/analytics/warehouse',
      label: 'Warehouse Explorer',
      badge: 'ERD / DWH',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.8} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7M4 7c0-2 1.5-3 3.5-3h9c2 0 3.5 1 3.5 3M4 7l8 4 8-4M4 12l8 4 8-4" />
        </svg>
      ),
    },
    {
      to: '/analytics/career',
      label: 'Placements & Careers',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      to: '/analytics/skills',
      label: 'Skills Intelligence',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.8} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      to: '/analytics/alumni',
      label: 'Alumni Insights',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      to: '/analytics/olap',
      label: 'OLAP Explorer',
      badge: 'Multi-D',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      to: '/analytics/mining',
      label: 'Data Mining Cockpit',
      badge: 'ML Engine',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      to: '/analytics/data',
      label: 'Data Ingestion & ETL',
      badge: 'CSV',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
    },
    {
      to: '/analytics/dictionary',
      label: 'Data Dictionary',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ]

  // Breadcrumb helper
  const activeItem = navItems.find((item) => {
    if (item.end) return location.pathname === item.to
    return location.pathname.startsWith(item.to)
  }) || { label: 'Analytics' }

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 font-sans selection:bg-neutral-800 selection:text-white flex flex-col">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-[#0c0c0e]/95 backdrop-blur px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-neutral-400 hover:text-white"
            aria-label="Toggle navigation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/analytics" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-white text-black font-mono font-bold text-xs">
              DW
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block leading-none">
                ALUMNI INTELLIGENCE
              </span>
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mt-0.5">
                Career Analytics Platform
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-neutral-800 text-xs font-mono text-neutral-400">
            <span>/</span>
            <span className="text-neutral-200">{activeItem.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Warehouse: dwh</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-300">OLAP Online</span>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 px-3 py-1.5 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Exit to Portal</span>
          </Link>
        </div>
      </header>

      <div className="flex flex-1">
        {/* SIDEBAR NAVIGATION (Desktop) */}
        <aside className="hidden md:flex flex-col w-64 border-r border-neutral-800 bg-[#0e0e11] p-4 shrink-0">
          <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 px-3 mb-2">
            Analytics Modules
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded px-3 py-2 text-xs font-mono transition-colors ${
                    isActive
                      ? 'bg-neutral-800 text-white font-bold'
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="opacity-80">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="rounded bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-neutral-400">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-neutral-800 text-xs font-mono text-neutral-500 px-3 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span>Role Access</span>
              <span className="text-neutral-300 font-bold uppercase">{user?.roles?.[0] || 'RESEARCHER'}</span>
            </div>
            <div className="text-[10px] text-neutral-400">
              Dimensional Warehouse Engine v1.0
            </div>
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen ? (
          <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
            <div
              className="fixed inset-y-0 left-0 w-64 bg-[#0e0e11] border-r border-neutral-800 p-4 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="font-bold text-sm text-white font-mono">ANALYTICS MENU</span>
                <button type="button" onClick={() => setMobileMenuOpen(false)} className="text-neutral-400 p-1">✕</button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded px-3 py-2 text-xs font-mono ${
                        isActive ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        ) : null}

        {/* MAIN OUTLET CONTAINER */}
        <main className="flex-1 overflow-x-hidden min-w-0 bg-[#09090b] flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
