import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { KpiCard, WarehouseHealthCard } from '../../components/analytics/AnalyticsCards.jsx'
import { BarChart, LineChart, DonutChart } from '../../components/analytics/AnalyticsCharts.jsx'
import { fetchWarehouseOverview, fetchPlacementsData } from '../../services/analytics.service.js'

export default function AnalyticsOverview() {
  const [sourceFilter, setSourceFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [warehouseInfo, setWarehouseInfo] = useState(null)
  const [placements, setPlacements] = useState(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [wh, pl] = await Promise.all([
          fetchWarehouseOverview({ recordSource: sourceFilter }),
          fetchPlacementsData({ recordSource: sourceFilter }),
        ])
        setWarehouseInfo(wh)
        setPlacements(pl)
      } catch (err) {
        console.error('Failed to load overview data', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [sourceFilter])

  const kpis = placements?.kpis || { placementRate: 0, avgPackageLpa: 0, medianPackageLpa: 0, highestPackageLpa: 0, totalJobOffers: 0, activeRecruiters: 0 }
  const departments = placements?.departments || []
  const trends = placements?.trends || []
  const topRecruiters = placements?.recruiters || []
  const provenance = warehouseInfo?.warehouse?.provenanceBreakdown || {}

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              Analytics Overview Cockpit
            </h1>
            <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-300">
              DWH v1.0
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Grounded multi-dimensional career metrics, placement trends, and alumni intelligence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* PROVENANCE SELECTOR */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-neutral-500 uppercase text-[10px]">Source Filter:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Warehouse Records (Combined)</option>
              <option value="benchmark">DWM Benchmark Dataset (Academic Simulation)</option>
              <option value="csv_import">User CSV Imports (ETL Batches)</option>
              <option value="operational">Ingested Operational Snapshot (Historical)</option>
            </select>
          </div>

          <Link
            to="/analytics/warehouse"
            className="rounded bg-sky-500/10 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 px-3 py-1.5 text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.8} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7M4 7c0-2 1.5-3 3.5-3h9c2 0 3.5 1 3.5 3M4 7l8 4 8-4M4 12l8 4 8-4" />
            </svg>
            Warehouse Explorer
          </Link>
          <Link
            to="/analytics/olap"
            className="rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 text-xs font-mono transition-colors"
          >
            Launch OLAP Cube
          </Link>
          <Link
            to="/analytics/data"
            className="rounded bg-white text-black font-semibold hover:bg-neutral-200 px-3 py-1.5 text-xs font-mono transition-colors"
          >
            + Ingest CSV Data
          </Link>
        </div>
      </div>

      {/* PROVENANCE NOTICE BANNER */}
      <div className="rounded border border-neutral-800 bg-[#0f0f12] p-3 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 text-[10px] uppercase tracking-wider font-bold">Data Provenance:</span>
          {sourceFilter === 'operational' ? (
            <span className="text-emerald-400 font-bold">Ingested Operational Snapshot (Historical snapshot in warehouse; sync decoupled)</span>
          ) : sourceFilter === 'benchmark' ? (
            <span className="text-amber-400 font-bold">Historical Benchmark Seed Dataset (Academic simulation distribution)</span>
          ) : sourceFilter === 'csv_import' ? (
            <span className="text-purple-400 font-bold">CSV Ingested Batches (Imported via independent ETL pipeline ledger)</span>
          ) : (
            <span className="text-sky-300 font-bold">Combined Analytical View (All Ingested DWM Warehouse Datasets)</span>
          )}
        </div>
        <div className="text-[11px] text-neutral-500">
          Students: <span className="text-white font-bold">{provenance.students?.[sourceFilter === 'ALL' ? 'benchmark' : sourceFilter] || warehouseInfo?.warehouse?.totalStudents || 0}</span> | Placements: <span className="text-white font-bold">{provenance.placements?.[sourceFilter === 'ALL' ? 'benchmark' : sourceFilter] || warehouseInfo?.warehouse?.totalPlacements || 0}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center p-12 text-neutral-400 font-mono text-sm">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>QUERYING ANALYTICAL DATA WAREHOUSE...</span>
          </div>
        </div>
      ) : (
        <>
          {/* WAREHOUSE HEALTH STRIP */}
          <WarehouseHealthCard
            status={warehouseInfo?.warehouse?.status || 'ACTIVE_HEALTHY'}
            totalRows={warehouseInfo?.warehouse?.totalWarehouseRecords || warehouseInfo?.warehouse?.totalStudents + warehouseInfo?.warehouse?.totalPlacements || 0}
            schema="dwh"
            lastSync={warehouseInfo?.warehouse?.lastRefreshedAt}
          />

          {/* EXECUTIVE KPI GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Campus Placement Rate"
              value={`${kpis.placementRate}%`}
              delta={kpis.placementRate > 0 ? `${kpis.placementRate}% eligible placed` : '0%'}
              subtext="Grounded fact_placement query"
              trend={kpis.placementRate >= 75 ? 'up' : 'neutral'}
            />
            <KpiCard
              title="Average CTC (LPA)"
              value={`₹${kpis.avgPackageLpa} LPA`}
              delta={`Median: ₹${kpis.medianPackageLpa} LPA`}
              subtext={kpis.highestPackageLpa > 0 ? `Highest offer: ₹${kpis.highestPackageLpa} LPA` : 'No verified packages'}
              trend="up"
            />
            <KpiCard
              title="Active Recruiters"
              value={kpis.activeRecruiters}
              delta="Enterprise partners"
              subtext="dwh.dim_company recruiters"
              trend="up"
            />
            <KpiCard
              title="Total Job Offers"
              value={kpis.totalJobOffers}
              delta="Zero duplicate inflation"
              subtext="Aggregated fact_placement count"
              trend="up"
            />
          </div>

          {/* MAIN ANALYTICAL CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Department Placement Comparison */}
            <div className="lg:col-span-2 rounded-sm border border-neutral-800 bg-[#121214] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Average CTC by Department (LPA)
                  </h2>
                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    Aggregated across graduating cohorts in dwh.fact_placement
                  </p>
                </div>
                <Link to="/analytics/career" className="text-xs font-mono text-neutral-400 hover:text-white">
                  Details &rarr;
                </Link>
              </div>

              {departments.length > 0 ? (
                <BarChart
                  data={departments.map((d) => ({
                    label: d.department.replace('Engineering', 'Eng').replace('Information', 'Info'),
                    value: d.avgLpa,
                  }))}
                  xKey="label"
                  yKey="value"
                  unit="LPA"
                  barColor="#fafafa"
                  height={200}
                />
              ) : (
                <div className="py-12 text-center font-mono text-xs text-neutral-500">
                  No department placement records available for current filter selection.
                </div>
              )}
            </div>

            {/* Top Recruiter Breakdown */}
            <div className="rounded-sm border border-neutral-800 bg-[#121214] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Offer Share
                  </h2>
                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    Top enterprise recruiting partners
                  </p>
                </div>
              </div>

              {topRecruiters.length > 0 ? (
                <DonutChart
                  data={topRecruiters.slice(0, 5).map((r) => ({
                    name: r.company,
                    value: r.offers,
                  }))}
                  nameKey="name"
                  valKey="value"
                />
              ) : (
                <div className="py-12 text-center font-mono text-xs text-neutral-500">
                  No recruiter offers recorded for current filter.
                </div>
              )}
            </div>
          </div>

          {/* LONGITUDINAL SALARY TRENDS */}
          <div className="rounded-sm border border-neutral-800 bg-[#121214] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Year-over-Year Average CTC Progression
                </h2>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                  Reflects dimensional date roll-ups across academic cohorts
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400">{trends.length} Cohort Years</span>
            </div>

            {trends.length > 0 ? (
              <LineChart
                data={trends.map((t) => ({ year: t.year, value: t.avgLpa }))}
                xKey="year"
                yKey="value"
                unit="LPA"
                strokeColor="#38bdf8"
                height={180}
              />
            ) : (
              <div className="py-10 text-center font-mono text-xs text-neutral-500">
                No longitudinal trend data available for current selection.
              </div>
            )}
          </div>

          {/* QUICK WORKFLOW SHORTCUTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <Link
              to="/analytics/warehouse"
              className="rounded border border-sky-800/60 bg-sky-950/20 p-4 hover:border-sky-600 transition-colors"
            >
              <div className="flex items-center justify-between text-sky-200 font-bold mb-1">
                <span>Warehouse Explorer & ERD</span>
                <span>&rarr;</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Inspect 15 dwh tables, 22 foreign keys, ERD topology, data quality, and CSV dataset inventory.
              </p>
            </Link>

            <Link
              to="/analytics/olap"
              className="rounded border border-neutral-800 bg-[#141417] p-4 hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-center justify-between text-neutral-200 font-bold mb-1">
                <span>Multi-Dimensional OLAP</span>
                <span>&rarr;</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Execute Roll-Up, Drill-Down, Slice, Dice, and 2D Cross-Tabulation Pivot tables.
              </p>
            </Link>

            <Link
              to="/analytics/career"
              className="rounded border border-neutral-800 bg-[#141417] p-4 hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-center justify-between text-neutral-200 font-bold mb-1">
                <span>Career Analytics</span>
                <span>&rarr;</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Filter placements across Department, Cohort, Tier, and Company simultaneously.
              </p>
            </Link>

            <Link
              to="/analytics/dictionary"
              className="rounded border border-neutral-800 bg-[#141417] p-4 hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-center justify-between text-neutral-200 font-bold mb-1">
                <span>Warehouse Dictionary</span>
                <span>&rarr;</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Review dimensions, fact grains, surrogate keys, formulas, and data provenance.
              </p>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
