import { useState, useMemo, useEffect } from 'react'
import { DonutChart, BarChart } from '../../components/analytics/AnalyticsCharts.jsx'
import { AnalyticsTable } from '../../components/analytics/AnalyticsTable.jsx'
import { fetchAlumniInsights } from '../../services/analytics.service.js'

export default function AnalyticsAlumni() {
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [alumniData, setAlumniData] = useState({
    kpis: { totalAlumni: 0, totalMentors: 0, mentorRatio: 0 },
    geographic: [],
    industries: [],
  })

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const res = await fetchAlumniInsights()
        setAlumniData(res)
      } catch (err) {
        console.error('Failed to load alumni insights', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const rawGeo = useMemo(() => alumniData.geographic || [], [alumniData.geographic])
  const rawIndustries = useMemo(() => alumniData.industries || [], [alumniData.industries])

  const filteredGeo = useMemo(() => {
    return rawGeo.filter((g) => {
      return !searchQuery || g.location.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }, [rawGeo, searchQuery])

  const geoColumns = [
    { key: 'location', label: 'Metropolitan Hub / Location', sortable: true },
    {
      key: 'count',
      label: 'Verified Alumni',
      sortable: true,
      render: (val) => <span className="font-bold text-white font-mono">{val}</span>,
    },
    {
      key: 'percentage',
      label: 'Cohort Share (%)',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-2 font-mono">
          <div className="w-16 bg-neutral-800 rounded-xs h-1.5 overflow-hidden">
            <div className="bg-sky-400 h-full" style={{ width: `${Math.min(100, val * 2.5)}%` }} />
          </div>
          <span className="text-neutral-300 font-semibold">{val}%</span>
        </div>
      ),
    },
  ]

  const industryColumns = [
    { key: 'industry', label: 'Domain Sector / Industry', sortable: true },
    {
      key: 'totalAlumni',
      label: 'Verified Alumni',
      sortable: true,
      render: (val) => <span className="font-bold text-white font-mono">{val}</span>,
    },
    {
      key: 'mentors',
      label: 'Active Mentors',
      sortable: true,
      render: (val) => <span className="text-emerald-400 font-semibold">{val}</span>,
    },
    {
      key: 'mentorPercentage',
      label: 'Mentorship Share (%)',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-2 font-mono">
          <div className="w-16 bg-neutral-800 rounded-xs h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(100, val)}%` }} />
          </div>
          <span className="text-neutral-300 font-semibold">{val}%</span>
        </div>
      ),
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* TITLE */}
      <div className="border-b border-neutral-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans">
            Alumni Distribution & Career Cohorts
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Dimensional insights derived from dwh.dim_alumni across graduation cohorts.
          </p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Filter location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-xs font-mono text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none"
          />
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-sm border border-neutral-800 bg-[#121214] p-5 space-y-4">
          <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider border-b border-neutral-800 pb-2">
            Top Metropolitan Geographic Hubs
          </h2>
          <BarChart
            data={filteredGeo.slice(0, 6).map((g) => ({
              label: g.location.split(',')[0],
              value: g.count,
            }))}
            xKey="label"
            yKey="value"
            unit="Alumni"
            barColor="#38bdf8"
            height={190}
          />
        </div>

        <div className="rounded-sm border border-neutral-800 bg-[#121214] p-5 space-y-4">
          <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider border-b border-neutral-800 pb-2">
            Alumni Geo Concentration
          </h2>
          <DonutChart
            data={rawGeo.map((g) => ({ name: g.location.split(',')[0], value: g.count }))}
            nameKey="name"
            valKey="value"
          />
        </div>
      </div>

      {/* GEOGRAPHIC TABLE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
            Alumni Regional Distribution
          </h2>
          <span className="text-[11px] font-mono text-neutral-500">
            {filteredGeo.length} Locations
          </span>
        </div>
        <AnalyticsTable columns={geoColumns} data={filteredGeo} />
      </div>

      {/* INDUSTRY & MENTORSHIP DISTRIBUTION */}
      <div className="space-y-3 pt-4 border-t border-neutral-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Industry Domains & Mentorship Engagement
            </h2>
            <p className="text-[11px] font-mono text-neutral-500">
              Distribution of verified alumni across economic sectors and active mentor ratios
            </p>
          </div>
          <span className="text-[11px] font-mono text-neutral-500">
            {rawIndustries.length} Sectors
          </span>
        </div>
        <AnalyticsTable columns={industryColumns} data={rawIndustries} />
      </div>
    </div>
  )
}
