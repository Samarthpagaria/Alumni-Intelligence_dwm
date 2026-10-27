import { useState, useMemo, useEffect } from 'react'
import { BarChart, DonutChart } from '../../components/analytics/AnalyticsCharts.jsx'
import { AnalyticsTable } from '../../components/analytics/AnalyticsTable.jsx'
import { fetchSkillsAnalytics } from '../../services/analytics.service.js'

export default function AnalyticsSkills() {
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [skillsData, setSkillsData] = useState({
    topSkills: [],
    categoryDistribution: [],
    categories: ['ALL'],
  })

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const res = await fetchSkillsAnalytics({ category: selectedCategory })
        setSkillsData(res)
      } catch (err) {
        console.error('Failed to load skills data', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [selectedCategory])

  const rawSkills = useMemo(() => skillsData.topSkills || [], [skillsData.topSkills])
  const categories = skillsData.categories || ['ALL']
  const categoryDistribution = skillsData.categoryDistribution || []

  const filteredSkills = useMemo(() => {
    return rawSkills.filter((s) => {
      const matchCat = selectedCategory === 'ALL' || s.category === selectedCategory
      const matchSearch = !searchQuery || s.skill.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
  }, [rawSkills, selectedCategory, searchQuery])

  const skillColumns = [
    { key: 'skill', label: 'Technical Competency / Skill', sortable: true },
    {
      key: 'category',
      label: 'Domain Category',
      sortable: true,
      render: (val) => (
        <span className="rounded bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300">
          {val}
        </span>
      ),
    },
    {
      key: 'demandCount',
      label: 'Job Posting Mentions',
      sortable: true,
      render: (val) => <span className="font-bold text-white font-mono">{val}</span>,
    },
    {
      key: 'growthYoY',
      label: 'YoY Demand Delta',
      sortable: true,
      render: (val) => (
        <span className="text-emerald-400 font-bold font-mono">
          {val}
        </span>
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
    <div className="flex flex-col flex-1">
      {/* FILTER STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 bg-[#0f0f11] px-5 py-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px] mr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded px-2.5 py-1 transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div>
          <input
            type="text"
            placeholder="Search skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* TITLE */}
        <div className="border-b border-neutral-800 pb-4">
          <h1 className="text-xl font-bold tracking-tight text-white font-sans">
            Technical Skills Intelligence & Market Demand
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Aggregated skill demands mapped across dwh.dim_skill and dwh.bridge_student_skill.
          </p>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-sm border border-neutral-800 bg-[#121214] p-5 space-y-4">
            <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider border-b border-neutral-800 pb-2">
              Most In-Demand Skills (Posting Citations)
            </h2>
            <BarChart
              data={filteredSkills.slice(0, 7).map((s) => ({
                label: s.skill,
                value: s.demandCount,
              }))}
              xKey="label"
              yKey="value"
              unit="Jobs"
              height={190}
            />
          </div>

          <div className="rounded-sm border border-neutral-800 bg-[#121214] p-5 space-y-4">
            <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider border-b border-neutral-800 pb-2">
              Demand by Domain
            </h2>
            <DonutChart
              data={categoryDistribution}
              nameKey="name"
              valKey="value"
            />
          </div>
        </div>

        {/* SKILLS TABLE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Skills Demand Ledger
            </h2>
            <span className="text-[11px] font-mono text-neutral-500">
              {filteredSkills.length} Verified Competencies
            </span>
          </div>
          <AnalyticsTable columns={skillColumns} data={filteredSkills} />
        </div>
      </div>
    </div>
  )
}
