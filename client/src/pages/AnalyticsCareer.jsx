import { useState, useMemo, useEffect } from 'react'
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar.jsx'
import { BarChart, LineChart } from '../../components/analytics/AnalyticsCharts.jsx'
import { AnalyticsTable } from '../../components/analytics/AnalyticsTable.jsx'
import { fetchPlacementsData } from '../../services/analytics.service.js'

export default function AnalyticsCareer() {
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedSource, setSelectedSource] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [careerData, setCareerData] = useState({
    departments: [],
    trends: [],
    recruiters: [],
  })

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const res = await fetchPlacementsData({
          department: selectedDept,
          year: selectedYear,
          recordSource: selectedSource,
        })
        setCareerData(res)
      } catch (err) {
        console.error('Failed to load career analytics', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [selectedDept, selectedYear, selectedSource])

  const rawDepts = useMemo(() => careerData.departments || [], [careerData.departments])
  const rawRecruiters = useMemo(() => careerData.recruiters || [], [careerData.recruiters])
  const salaryTrends = useMemo(() => careerData.trends || [], [careerData.trends])

  // Filtered Departments
  const filteredDepts = useMemo(() => {
    return rawDepts.filter((d) => {
      const matchDept = !selectedDept || d.department.toLowerCase().includes(selectedDept.toLowerCase())
      const matchSearch = !searchQuery || d.department.toLowerCase().includes(searchQuery.toLowerCase()) || d.topCompany.toLowerCase().includes(searchQuery.toLowerCase())
      return matchDept && matchSearch
    })
  }, [rawDepts, selectedDept, searchQuery])

  // Filtered Recruiters
  const filteredRecruiters = useMemo(() => {
    return rawRecruiters.filter((r) => {
      return !searchQuery || r.company.toLowerCase().includes(searchQuery.toLowerCase()) || r.industry.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }, [rawRecruiters, searchQuery])

  const deptColumns = [
    { key: 'department', label: 'Academic Department', sortable: true },
    { key: 'eligible', label: 'Eligible', sortable: true },
    { key: 'placed', label: 'Placed', sortable: true },
    {
      key: 'rate',
      label: 'Placement %',
      sortable: true,
      render: (val) => (
        <span className={`font-bold ${val >= 90 ? 'text-emerald-400' : val >= 80 ? 'text-sky-400' : 'text-amber-400'}`}>
          {val}%
        </span>
      ),
    },
    {
      key: 'avgLpa',
      label: 'Avg CTC (LPA)',
      sortable: true,
      render: (val) => <span className="text-white font-semibold">₹{val} LPA</span>,
    },
    {
      key: 'maxLpa',
      label: 'Max CTC (LPA)',
      sortable: true,
      render: (val) => <span className="text-emerald-400 font-bold">₹{val} LPA</span>,
    },
    { key: 'topCompany', label: 'Primary Recruiter', sortable: true },
  ]

  const recruiterColumns = [
    { key: 'company', label: 'Recruiting Enterprise', sortable: true },
    { key: 'industry', label: 'Industry Sector', sortable: true },
    {
      key: 'tier',
      label: 'Hiring Tier',
      sortable: true,
      render: (val) => (
        <span className="rounded bg-neutral-800 border border-neutral-700 px-1.5 py-0.5 text-[10px] text-neutral-300">
          {val}
        </span>
      ),
    },
    {
      key: 'offers',
      label: 'Offers Extended',
      sortable: true,
      render: (val) => <span className="font-bold text-white">{val}</span>,
    },
    {
      key: 'avgLpa',
      label: 'Avg Package (LPA)',
      sortable: true,
      render: (val) => <span className="text-emerald-400 font-semibold">₹{val} LPA</span>,
    },
  ]

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-neutral-400 font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span>QUERYING ANALYTICAL DATA WAREHOUSE...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      {/* FILTER CONTROLS */}
      <AnalyticsFilterBar
        selectedDepartment={selectedDept}
        onSelectDepartment={setSelectedDept}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* VIEW TITLE & PROVENANCE SELECTOR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white font-sans">
              Campus Placements & Compensation Analytics
            </h1>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              Statistical outcomes from dwh.fact_placement partitioned by department and hiring tier.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-neutral-500 uppercase text-[10px]">Data Source:</span>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="rounded bg-neutral-900 border border-neutral-800 px-2 py-1 text-white text-xs cursor-pointer focus:outline-none"
            >
              <option value="ALL">All Sources (Combined)</option>
              <option value="operational">Operational Only</option>
              <option value="benchmark">Benchmark Only</option>
              <option value="csv_import">CSV Imports Only</option>
            </select>
          </div>
        </div>

        {/* PROVENANCE NOTICE */}
        <div className="rounded border border-neutral-800 bg-[#0f0f12] px-4 py-2 text-xs font-mono flex items-center justify-between">
          <span className="text-neutral-400">
            Current Filter:{' '}
            <strong className={selectedSource === 'operational' ? 'text-emerald-400' : selectedSource === 'benchmark' ? 'text-amber-400' : 'text-sky-400'}>
              {selectedSource === 'operational' ? 'Live Operational Verified Profiles' : selectedSource === 'benchmark' ? 'Academic Benchmark Dataset (Simulated)' : 'Combined Analytical Warehouse'}
            </strong>
          </span>
          <span className="text-[11px] text-neutral-500">
            Offers: <strong className="text-white">{careerData?.kpis?.totalJobOffers || 0}</strong> | Placement Rate: <strong className="text-emerald-400">{careerData?.kpis?.placementRate || 0}%</strong>
          </span>
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Average Package by Department */}
          <div className="rounded-sm border border-neutral-800 bg-[#121214] p-5 space-y-4">
            <div className="border-b border-neutral-800 pb-2">
              <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Average CTC by Department
              </h2>
            </div>
            <BarChart
              data={filteredDepts.map((d) => ({
                label: d.department.split(' ')[0],
                value: d.avgLpa,
              }))}
              xKey="label"
              yKey="value"
              unit="LPA"
              height={180}
            />
          </div>

          {/* Longitudinal Salary Progression */}
          <div className="rounded-sm border border-neutral-800 bg-[#121214] p-5 space-y-4">
            <div className="border-b border-neutral-800 pb-2">
              <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Average CTC Progression (2020 &ndash; 2025)
              </h2>
            </div>
            <LineChart
              data={salaryTrends.map((t) => ({ year: t.year, value: t.avgLpa }))}
              xKey="year"
              yKey="value"
              unit="LPA"
              strokeColor="#38bdf8"
              height={180}
            />
          </div>
        </div>

        {/* DEPARTMENT PLACEMENTS TABLE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Department Cohort Breakdown
            </h2>
            <span className="text-[11px] font-mono text-neutral-500">
              {filteredDepts.length} Departments
            </span>
          </div>
          <AnalyticsTable columns={deptColumns} data={filteredDepts} />
        </div>

        {/* TOP RECRUITERS TABLE */}
        <div className="space-y-3 pt-4 border-t border-neutral-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Recruiting Enterprise Ledger
            </h2>
            <span className="text-[11px] font-mono text-neutral-500">
              {filteredRecruiters.length} Partner Employers
            </span>
          </div>
          <AnalyticsTable columns={recruiterColumns} data={filteredRecruiters} />
        </div>
      </div>
    </div>
  )
}
