import React from 'react'

export function AnalyticsFilterBar({
  selectedDepartment,
  onSelectDepartment,
  selectedYear,
  onSelectYear,
  searchQuery,
  onSearchChange,
  extraControls,
}) {
  const departments = [
    'All Departments',
    'Computer Engineering',
    'Information Technology',
    'Data Science & AI',
    'Electronics & Telecom',
    'Cybersecurity',
    'Applied Mathematics',
  ]

  const years = ['All Cohorts', '2025', '2024', '2023', '2022', '2021', '2020']

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 bg-[#0f0f11] px-5 py-3 text-xs font-mono">
      <div className="flex flex-wrap items-center gap-3">
        {/* Department Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Dept:</span>
          <select
            value={selectedDepartment || 'All Departments'}
            onChange={(e) => onSelectDepartment(e.target.value === 'All Departments' ? '' : e.target.value)}
            className="rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-neutral-200 focus:border-neutral-600 focus:outline-none"
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Cohort Year Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Year:</span>
          <select
            value={selectedYear || 'All Cohorts'}
            onChange={(e) => onSelectYear(e.target.value === 'All Cohorts' ? '' : e.target.value)}
            className="rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-neutral-200 focus:border-neutral-600 focus:outline-none"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        {onSearchChange ? (
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by keyword..."
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-48 rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none"
            />
          </div>
        ) : null}
      </div>

      {extraControls ? (
        <div className="flex items-center gap-2">
          {extraControls}
        </div>
      ) : null}
    </div>
  )
}

export default AnalyticsFilterBar
