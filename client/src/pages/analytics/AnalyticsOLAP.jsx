import { useState, useMemo, useEffect } from 'react'
import { BarChart } from '../../components/analytics/AnalyticsCharts.jsx'
import { AnalyticsTable } from '../../components/analytics/AnalyticsTable.jsx'
import ErrorBoundary from '../../components/ErrorBoundary.jsx'
import { fetchOlapData } from '../../services/analytics.service.js'

/**
 * Safely formats an OLAP dimension key for display across charts, tables, and pivot views.
 * Handles numeric years, date objects, ISO strings, nulls/undefined, and dimension-specific labels.
 *
 * @param {string|number|Date|null|undefined} key - Raw dimension key
 * @param {string} [dimension=''] - Dimension name (e.g., 'year', 'department', 'source')
 * @param {object} [options]
 * @param {boolean} [options.compact=false] - Whether to use compact abbreviation for charts
 * @returns {string} Formatted display label
 */
export function formatOlapKey(key, dimension = '', options = {}) {
  if (key === null || key === undefined || key === '') {
    return 'Unassigned'
  }

  // Handle Date instances
  if (key instanceof Date) {
    return !isNaN(key.getTime()) ? String(key.getUTCFullYear()) : 'Unassigned'
  }

  // Handle numeric types (e.g. graduation year as integer: 2026)
  if (typeof key === 'number') {
    if (isNaN(key)) return 'Unassigned'
    return String(key)
  }

  const str = String(key).trim()
  if (!str || str.toLowerCase() === 'null' || str.toLowerCase() === 'undefined') {
    return 'Unassigned'
  }

  // Graduation Year / Date dimension formatting
  if (dimension === 'year') {
    // 4-digit numeric year string (e.g., "2026")
    if (/^\d{4}$/.test(str)) {
      return str
    }
    // ISO or date prefix (e.g., "2025-06-15" or "2025-06-15T00:00:00.000Z")
    // Extract year directly from the leading 4 digits to prevent timezone shift off-by-one errors
    const matchYear = str.match(/^(\d{4})/)
    if (matchYear) {
      return matchYear[1]
    }
    // Fallback for parseable dates
    const parsed = new Date(str)
    if (!isNaN(parsed.getTime())) {
      return String(parsed.getUTCFullYear())
    }
    return str
  }

  // Academic Department compact abbreviations for charts
  if (dimension === 'department' && options.compact) {
    return str.replace('Engineering', 'Eng').replace('Information', 'Info')
  }

  // Provenance Source human-friendly labels
  if (dimension === 'source') {
    if (str === 'csv_import') return 'CSV Import'
    if (str === 'indian_academic_benchmark' || str === 'synthetic_indian_academic_demo') return 'Academic Benchmark'
    if (str === 'operational') return 'Operational'
  }

  return str
}

export default function AnalyticsOLAP() {
  // Dimensions and Measures
  const [primaryDimension, setPrimaryDimension] = useState('department')
  const [secondaryDimension, setSecondaryDimension] = useState('none')
  const [selectedMeasure, setSelectedMeasure] = useState('avgLpa')

  // Slice & Dice Filters
  const [sliceDept, setSliceDept] = useState('ALL')
  const [sliceTier, setSliceTier] = useState('ALL')
  const [sliceYear, setSliceYear] = useState('ALL')
  const [sliceSource, setSliceSource] = useState('ALL')
  const [minLpaFilter, setMinLpaFilter] = useState(0)

  // Drill-Down State
  const [drillDownKey, setDrillDownKey] = useState(null)
  const [drillDownData, setDrillDownData] = useState(null)

  // Data State
  const [olapResponse, setOlapResponse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetchOlapData({
          primaryDimension,
          secondaryDimension: secondaryDimension !== 'none' ? secondaryDimension : undefined,
          measure: selectedMeasure,
          sliceDept,
          sliceTier,
          sliceYear,
          sliceSource,
          minLpa: minLpaFilter,
          drillDownKey: drillDownKey || undefined,
        })
        setOlapResponse(res)
        if (drillDownKey && res?.drillDown) {
          setDrillDownData(res.drillDown)
        } else if (!drillDownKey) {
          setDrillDownData(null)
        }
      } catch (err) {
        console.error('Failed to load OLAP data', err)
        setError(err?.response?.data?.message || err.message || 'Error querying warehouse OLAP engine')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [
    primaryDimension,
    secondaryDimension,
    selectedMeasure,
    sliceDept,
    sliceTier,
    sliceYear,
    sliceSource,
    minLpaFilter,
    drillDownKey,
  ])

  // Swap Primary and Secondary Dimensions (Pivot Flip)
  function handleSwapDimensions() {
    if (secondaryDimension === 'none') return
    const prevPrimary = primaryDimension
    const prevSecondary = secondaryDimension
    setPrimaryDimension(prevSecondary)
    setSecondaryDimension(prevPrimary)
    setDrillDownKey(null)
  }

  const olapCells = useMemo(() => olapResponse?.cells || [], [olapResponse])
  const pivotData = useMemo(() => olapResponse?.pivot || null, [olapResponse])
  const rollupSummary = useMemo(() => olapResponse?.rollup || null, [olapResponse])

  // Flat data for 1D breakdown table
  const aggregatedData = useMemo(() => {
    return olapCells.map((cell) => ({
      key: cell.primary != null && cell.primary !== '' ? cell.primary : 'Unassigned',
      placedCount: cell.placedCount,
      eligibleCount: cell.eligibleCount,
      placementRate: cell.placementRate,
      totalOffers: cell.totalOffers,
      avgLpa: cell.avgLpa,
      medianLpa: cell.medianLpa,
      maxLpa: cell.maxLpa,
      minLpa: cell.minLpa,
    }))
  }, [olapCells])

  const tableColumns = [
    {
      key: 'key',
      label: `Dimension: ${primaryDimension.toUpperCase()}`,
      sortable: true,
      render: (val) => <span className="font-semibold text-white">{formatOlapKey(val, primaryDimension)}</span>,
    },
    {
      key: 'placedCount',
      label: 'Placed Students',
      sortable: true,
      render: (val) => <span className="font-bold text-white">{val}</span>,
    },
    { key: 'totalOffers', label: 'Offers Extended', sortable: true },
    {
      key: 'placementRate',
      label: 'Placement %',
      sortable: true,
      render: (val) => (
        <span className={`font-mono font-bold ${val >= 85 ? 'text-emerald-400' : val >= 70 ? 'text-sky-400' : 'text-amber-400'}`}>
          {val}%
        </span>
      ),
    },
    {
      key: 'avgLpa',
      label: 'Avg CTC (LPA)',
      sortable: true,
      render: (val) => <span className="text-emerald-400 font-semibold font-mono">₹{val} LPA</span>,
    },
    {
      key: 'medianLpa',
      label: 'Median CTC (LPA)',
      sortable: true,
      render: (val) => <span className="text-neutral-300 font-mono">₹{val} LPA</span>,
    },
    {
      key: 'maxLpa',
      label: 'Max CTC (LPA)',
      sortable: true,
      render: (val) => <span className="text-sky-400 font-bold font-mono">₹{val} LPA</span>,
    },
    {
      key: 'actions',
      label: 'Drill-Down',
      render: (_, row) => (
        <button
          type="button"
          onClick={() => setDrillDownKey(row.key != null ? String(row.key) : '')}
          className="rounded bg-neutral-800 hover:bg-neutral-700 text-sky-400 px-2 py-0.5 text-[10px] font-mono cursor-pointer"
        >
          Inspect &rarr;
        </button>
      ),
    },
  ]

  return (
    <div className="flex flex-col flex-1">
      {/* OLAP CONTROL PANEL */}
      <div className="border-b border-neutral-800 bg-[#0f0f11] p-4 font-mono text-xs space-y-3">
        {/* ROW 1: DIMENSIONS, MEASURES, AND PIVOT CONTROLS */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Primary (Row) Dimension */}
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500 uppercase text-[10px]">Row Axis:</span>
              <select
                value={primaryDimension}
                onChange={(e) => {
                  setPrimaryDimension(e.target.value)
                  setDrillDownKey(null)
                }}
                className="rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="department">Academic Department</option>
                <option value="tier">Company Hiring Tier</option>
                <option value="company">Enterprise Employer</option>
                <option value="year">Graduation Year / Date</option>
                <option value="industry">Industry Sector</option>
                <option value="degree">Academic Degree</option>
                <option value="source">Provenance Source</option>
              </select>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwapDimensions}
              disabled={secondaryDimension === 'none'}
              title="Exchange Row and Column Dimensions (Pivot Swap)"
              className={`rounded border px-2 py-1 text-[11px] font-bold transition-colors ${
                secondaryDimension !== 'none'
                  ? 'border-neutral-700 bg-neutral-800 text-sky-300 hover:bg-neutral-700 cursor-pointer'
                  : 'border-neutral-900 bg-neutral-950 text-neutral-600 cursor-not-allowed'
              }`}
            >
              &#8644; Pivot Swap
            </button>

            {/* Secondary (Column) Dimension for Pivot */}
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500 uppercase text-[10px]">Column (Pivot):</span>
              <select
                value={secondaryDimension}
                onChange={(e) => {
                  setSecondaryDimension(e.target.value)
                  setDrillDownKey(null)
                }}
                className="rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-white focus:outline-none cursor-pointer"
              >
                <option value="none">None (1D Summary Roll-Up)</option>
                <option value="tier">Company Hiring Tier</option>
                <option value="department">Academic Department</option>
                <option value="year">Graduation Year / Date</option>
                <option value="industry">Industry Sector</option>
                <option value="degree">Academic Degree</option>
                <option value="source">Provenance Source</option>
              </select>
            </div>

            {/* Measure Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500 uppercase text-[10px]">Measure:</span>
              <select
                value={selectedMeasure}
                onChange={(e) => setSelectedMeasure(e.target.value)}
                className="rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-white focus:outline-none cursor-pointer"
              >
                <option value="avgLpa">Avg CTC Package (₹ LPA)</option>
                <option value="medianLpa">Median CTC Package (₹ LPA)</option>
                <option value="placedCount">Placed Scholars Count</option>
                <option value="totalOffers">Total Offers Extended</option>
                <option value="maxLpa">Highest CTC Package (₹ LPA)</option>
                <option value="minLpa">Lowest CTC Package (₹ LPA)</option>
                <option value="placementRate">Placement Rate (%)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 text-[10px] text-emerald-400 font-bold">
              Exact SQL Aggregation
            </span>
          </div>
        </div>

        {/* ROW 2: SLICE & DICE FILTER CONTROLS */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-neutral-800/80">
          <span className="text-neutral-500 uppercase text-[10px] tracking-wider">Slice &amp; Dice:</span>

          {/* Department Slice */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 text-[10px]">Dept:</span>
            <select
              value={sliceDept}
              onChange={(e) => setSliceDept(e.target.value)}
              className="rounded bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-neutral-300 text-[11px]"
            >
              <option value="ALL">All Departments</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Data Science & AI">Data Science & AI</option>
              <option value="Electronics & Telecom">Electronics & Telecom</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Applied Mathematics">Applied Mathematics</option>
            </select>
          </div>

          {/* Tier Slice */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 text-[10px]">Tier:</span>
            <select
              value={sliceTier}
              onChange={(e) => setSliceTier(e.target.value)}
              className="rounded bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-neutral-300 text-[11px]"
            >
              <option value="ALL">All Tiers</option>
              <option value="Super Dream">Super Dream (&gt; 20 LPA)</option>
              <option value="Dream">Dream (10-20 LPA)</option>
              <option value="Core / Mass">Core / Mass (&lt; 10 LPA)</option>
            </select>
          </div>

          {/* Year Slice */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 text-[10px]">Year:</span>
            <select
              value={sliceYear}
              onChange={(e) => setSliceYear(e.target.value)}
              className="rounded bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-neutral-300 text-[11px]"
            >
              <option value="ALL">All Years</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          {/* Provenance Source Slice */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 text-[10px]">Source:</span>
            <select
              value={sliceSource}
              onChange={(e) => setSliceSource(e.target.value)}
              className="rounded bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-neutral-300 text-[11px]"
            >
              <option value="ALL">All (Combined)</option>
              <option value="operational">Operational Only</option>
              <option value="benchmark">Benchmark Demo Only</option>
              <option value="csv_import">CSV Imports Only</option>
            </select>
          </div>

          {/* Min CTC Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 text-[10px]">Min CTC:</span>
            <input
              type="number"
              min="0"
              max="100"
              value={minLpaFilter}
              onChange={(e) => setMinLpaFilter(e.target.value)}
              className="w-16 rounded bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-neutral-300 text-[11px]"
            />
            <span className="text-neutral-500 text-[10px]">LPA</span>
          </div>

          {(sliceDept !== 'ALL' || sliceTier !== 'ALL' || sliceYear !== 'ALL' || sliceSource !== 'ALL' || minLpaFilter > 0) ? (
            <button
              type="button"
              onClick={() => {
                setSliceDept('ALL')
                setSliceTier('ALL')
                setSliceYear('ALL')
                setSliceSource('ALL')
                setMinLpaFilter(0)
                setDrillDownKey(null)
              }}
              className="text-[10px] text-rose-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          ) : null}
        </div>
      </div>

      {/* PROVENANCE NOTICE STRIP */}
      <div className="bg-neutral-900/60 border-b border-neutral-800 px-6 py-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500">PROVENANCE:</span>
          {sliceSource === 'operational' ? (
            <span className="text-emerald-400 font-bold">Showing Live Operational Database Records Only</span>
          ) : sliceSource === 'benchmark' ? (
            <span className="text-amber-400 font-bold">Showing Benchmark Multi-Year Historical Dataset</span>
          ) : (
            <span className="text-sky-400 font-bold">Showing Combined View (Operational Records + Academic Benchmark Datasets)</span>
          )}
        </div>
        <div className="text-neutral-500">
          Source Tag: <span className="text-neutral-300">{olapResponse?.activeSource || 'ALL'}</span>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {error ? (
          <div className="rounded border border-rose-900 bg-rose-950/40 p-4 font-mono text-xs text-rose-400">
            <strong>Query Error:</strong> {error}
          </div>
        ) : null}

        {loading ? (
          <div className="flex flex-1 items-center justify-center p-12 text-neutral-400 font-mono text-sm">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>COMPUTING MULTI-DIMENSIONAL WAREHOUSE CUBE...</span>
            </div>
          </div>
        ) : (
          <ErrorBoundary
            fallback={(err, reset) => (
              <div className="rounded border border-amber-900/60 bg-amber-950/20 p-6 font-mono text-xs text-amber-300 space-y-3">
                <div className="font-bold uppercase tracking-wider text-amber-400">OLAP Visualizer Error</div>
                <p className="text-neutral-300">An unexpected rendering error occurred in the OLAP view.</p>
                {err?.message ? (
                  <pre className="p-2 bg-neutral-900 border border-neutral-800 rounded text-rose-400 overflow-x-auto">
                    {err.message}
                  </pre>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setPrimaryDimension('department')
                    setSecondaryDimension('none')
                    reset()
                  }}
                  className="rounded bg-neutral-800 hover:bg-neutral-700 text-sky-400 px-3 py-1 font-bold cursor-pointer"
                >
                  Reset to Academic Department
                </button>
              </div>
            )}
          >
            {/* ROLLUP INSTITUTION-WIDE SUMMARY STRIP */}
            {rollupSummary ? (
              <div className="rounded-sm border border-neutral-800 bg-[#121214] p-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
                    Institution-Wide Roll-Up Aggregation (All Slices Combined)
                  </span>
                  <span className="text-[10px] text-neutral-500">Zero Join Inflation Guarantee</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
                  <div className="rounded bg-neutral-900 p-2">
                    <span className="text-[10px] text-neutral-500 block">Total Offers</span>
                    <span className="text-sm font-bold text-white">{rollupSummary.totalOffers}</span>
                  </div>
                  <div className="rounded bg-neutral-900 p-2">
                    <span className="text-[10px] text-neutral-500 block">Placed Scholars</span>
                    <span className="text-sm font-bold text-white">{rollupSummary.placedCount}</span>
                  </div>
                  <div className="rounded bg-neutral-900 p-2">
                    <span className="text-[10px] text-neutral-500 block">Placement Rate</span>
                    <span className="text-sm font-bold text-emerald-400">{rollupSummary.placementRate}%</span>
                  </div>
                  <div className="rounded bg-neutral-900 p-2">
                    <span className="text-[10px] text-neutral-500 block">Average CTC</span>
                    <span className="text-sm font-bold text-sky-400">₹{rollupSummary.avgLpa} LPA</span>
                  </div>
                  <div className="rounded bg-neutral-900 p-2">
                    <span className="text-[10px] text-neutral-500 block">Median CTC</span>
                    <span className="text-sm font-bold text-neutral-300">₹{rollupSummary.medianLpa} LPA</span>
                  </div>
                  <div className="rounded bg-neutral-900 p-2">
                    <span className="text-[10px] text-neutral-500 block">Highest CTC</span>
                    <span className="text-sm font-bold text-purple-400">₹{rollupSummary.maxLpa} LPA</span>
                  </div>
                  <div className="rounded bg-neutral-900 p-2">
                    <span className="text-[10px] text-neutral-500 block">Lowest CTC</span>
                    <span className="text-sm font-bold text-amber-400">₹{rollupSummary.minLpa} LPA</span>
                  </div>
                </div>
              </div>
            ) : null}

            {/* CHART VISUALIZATION */}
            <div className="rounded-sm border border-neutral-800 bg-[#121214] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div>
                  <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    OLAP Projection: {selectedMeasure.toUpperCase()} across {primaryDimension.toUpperCase()}
                  </h2>
                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    Parameterized aggregation recomputed dynamically from analytical schema dwh.fact_placement
                  </p>
                </div>
                <span className="text-xs font-mono text-neutral-400">{aggregatedData.length} Bins</span>
              </div>

              {aggregatedData.length > 0 ? (
                <BarChart
                  data={aggregatedData.map((d) => ({
                    label: formatOlapKey(d.key, primaryDimension, { compact: true }),
                    value: d[selectedMeasure] || 0,
                  }))}
                  xKey="label"
                  yKey="value"
                  unit={selectedMeasure.toLowerCase().includes('lpa') ? 'LPA' : ''}
                  height={220}
                  barColor="#38bdf8"
                />
              ) : (
                <div className="py-12 text-center font-mono text-xs text-neutral-500">
                  No placement records match the currently selected slice/dice criteria.
                </div>
              )}
            </div>

            {/* PIVOT TABLE OR 1D BREAKDOWN TABLE */}
            {secondaryDimension !== 'none' && pivotData ? (
              /* 2D CROSS-TABULATED PIVOT TABLE */
              <div className="rounded-sm border border-neutral-800 bg-[#121214] p-5 space-y-4 font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                  <div>
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                      2D Multidimensional Cross-Tabulation Pivot Matrix
                    </h2>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Rows: <span className="text-sky-400 font-bold">{primaryDimension}</span> &times; Columns:{' '}
                      <span className="text-emerald-400 font-bold">{secondaryDimension}</span> (Measure:{' '}
                      <span className="text-white font-bold">{selectedMeasure}</span>)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSwapDimensions}
                      className="rounded bg-neutral-800 hover:bg-neutral-700 text-sky-400 px-2.5 py-1 text-[11px] font-bold cursor-pointer"
                    >
                      &#8644; Exchange Axes
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto border border-neutral-800 rounded bg-[#09090b]">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="bg-neutral-900 text-neutral-400 border-b border-neutral-800">
                      <tr>
                        <th className="px-3 py-2 font-bold text-white">
                          {primaryDimension.toUpperCase()} \ {secondaryDimension.toUpperCase()}
                        </th>
                        {pivotData.columns.map((col) => (
                          <th key={String(col)} className="px-3 py-2 font-semibold text-center text-emerald-400">
                            {formatOlapKey(col, secondaryDimension)}
                          </th>
                        ))}
                        <th className="px-3 py-2 font-bold text-right text-sky-400 bg-neutral-900/80">
                          Row Total (Offers)
                        </th>
                        <th className="px-3 py-2 font-bold text-right text-emerald-400 bg-neutral-900/80">
                          Row Avg CTC
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                      {pivotData.rows.map((row) => (
                        <tr key={String(row)} className="hover:bg-neutral-800/30">
                          <td className="px-3 py-2 font-bold text-white">{formatOlapKey(row, primaryDimension)}</td>
                          {pivotData.columns.map((col) => {
                            const cell = pivotData.matrix[row]?.[col]
                            const val = cell ? cell[selectedMeasure] : 0
                            return (
                              <td key={String(col)} className="px-3 py-2 text-center">
                                {cell && cell.totalOffers > 0 ? (
                                  selectedMeasure.toLowerCase().includes('lpa') ? (
                                    <span className="text-white font-semibold">₹{val}</span>
                                  ) : (
                                    <span className="text-white font-semibold">{val}</span>
                                  )
                                ) : (
                                  <span className="text-neutral-600">-</span>
                                )}
                              </td>
                            )
                          })}
                          <td className="px-3 py-2 text-right font-bold text-white bg-neutral-950/40">
                            {pivotData.matrix[row]?.rowTotalOffers || 0}
                          </td>
                          <td className="px-3 py-2 text-right font-bold text-emerald-400 bg-neutral-950/40">
                            ₹{pivotData.matrix[row]?.rowAvgLpa || 0} LPA
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-neutral-900/90 text-neutral-300 border-t-2 border-neutral-700 font-bold">
                      <tr>
                        <td className="px-3 py-2 text-white">COLUMN TOTALS / GRAND TOTAL</td>
                        {pivotData.columns.map((col) => (
                          <td key={String(col)} className="px-3 py-2 text-center text-sky-300">
                            {selectedMeasure === 'avgLpa'
                              ? `₹${pivotData.columnTotals[col]?.avgLpa || 0} LPA`
                              : pivotData.columnTotals[col]?.totalOffers || 0}
                          </td>
                        ))}
                        <td className="px-3 py-2 text-right text-white">
                          {pivotData.grandTotal?.totalOffers || 0}
                        </td>
                        <td className="px-3 py-2 text-right text-emerald-400">
                          ₹{pivotData.grandTotal?.avgLpa || 0} LPA
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ) : (
              /* 1D SUMMARY TABLE */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Multidimensional OLAP Summary Table
                  </h2>
                  <span className="text-[11px] font-mono text-neutral-500">
                    Grain: dwh.fact_placement
                  </span>
                </div>
                <AnalyticsTable columns={tableColumns} data={aggregatedData} />
              </div>
            )}

            {/* INTERACTIVE DRILL-DOWN INSPECTOR PANEL */}
            {drillDownData ? (
              <div className="rounded-sm border border-sky-800/80 bg-[#0d1520] p-5 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-sky-800/60 pb-3">
                  <div>
                    <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">
                      DRILL-DOWN RECORD INSPECTOR
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      Granular Placement Records for {drillDownData.dimension ? drillDownData.dimension.toUpperCase() : primaryDimension.toUpperCase()}: &quot;{formatOlapKey(drillDownData.key, drillDownData.dimension || primaryDimension)}&quot;
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrillDownKey(null)}
                    className="rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1 text-xs cursor-pointer"
                  >
                    Close Drill-Down &times;
                  </button>
                </div>

                <div className="overflow-x-auto border border-neutral-800 rounded bg-[#09090b]">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="bg-neutral-900 text-neutral-400 border-b border-neutral-800">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Recruiting Company</th>
                        <th className="px-3 py-2 font-semibold">Tier</th>
                        <th className="px-3 py-2 font-semibold">Degree / Program</th>
                        <th className="px-3 py-2 font-semibold">Department</th>
                        <th className="px-3 py-2 font-semibold">CTC (LPA)</th>
                        <th className="px-3 py-2 font-semibold">Cohort Year</th>
                        <th className="px-3 py-2 font-semibold">Data Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                      {drillDownData.records.map((r, idx) => (
                        <tr key={idx} className="hover:bg-neutral-800/30">
                          <td className="px-3 py-1.5 font-bold text-white">{r.companyName}</td>
                          <td className="px-3 py-1.5 text-neutral-400">{r.companyTier}</td>
                          <td className="px-3 py-1.5 text-neutral-400">{r.degree}</td>
                          <td className="px-3 py-1.5 text-neutral-300">{r.department}</td>
                          <td className="px-3 py-1.5 font-bold text-emerald-400 font-mono">₹{r.annualPackageLpa} LPA</td>
                          <td className="px-3 py-1.5 text-neutral-400">{r.offerYear}</td>
                          <td className="px-3 py-1.5 text-[10px] text-sky-400">{r.recordSource}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </ErrorBoundary>
        )}
      </div>
    </div>
  )
}
