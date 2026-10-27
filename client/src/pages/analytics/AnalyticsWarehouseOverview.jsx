import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchWarehouseSummary,
  fetchWarehouseSchema,
  fetchWarehouseTableDetails,
  fetchWarehouseQuality,
  fetchWarehouseDatasets,
  fetchWarehouseAuditLedger,
} from '../../services/analytics.service.js'

export default function AnalyticsWarehouseOverview() {
  const [activeTab, setActiveTab] = useState('erd') // 'erd' | 'tables' | 'quality' | 'datasets' | 'audit'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Data states
  const [summaryData, setSummaryData] = useState(null)
  const [schemaData, setSchemaData] = useState(null)
  const [qualityData, setQualityData] = useState(null)
  const [datasetsData, setDatasetsData] = useState(null)
  const [auditData, setAuditData] = useState(null)

  // Selected table for details drawer
  const [selectedTableName, setSelectedTableName] = useState('dim_alumni')
  const [tableDetails, setTableDetails] = useState(null)
  const [tableDetailsLoading, setTableDetailsLoading] = useState(false)
  const [tableSamplePage, setTableSamplePage] = useState(1)

  // ERD Interactive states
  const [erdSearch, setErdSearch] = useState('')
  const [erdCategoryFilter, setErdCategoryFilter] = useState('ALL') // 'ALL' | 'dimension' | 'fact' | 'bridge' | 'audit'
  const [selectedErdTable, setSelectedErdTable] = useState(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 20, y: 20 })
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })

  // Initial load
  useEffect(() => {
    async function loadAll() {
      setLoading(true)
      setError(null)
      try {
        const [sum, sch, qual, ds, aud] = await Promise.all([
          fetchWarehouseSummary(),
          fetchWarehouseSchema(),
          fetchWarehouseQuality(),
          fetchWarehouseDatasets(),
          fetchWarehouseAuditLedger({ limit: 25 }),
        ])
        setSummaryData(sum)
        setSchemaData(sch)
        setQualityData(qual)
        setDatasetsData(ds)
        setAuditData(aud)
      } catch (err) {
        console.error('Failed to load warehouse overview data', err)
        setError(err.message || 'Failed to load warehouse overview')
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  // Load details when selected table changes
  useEffect(() => {
    if (!selectedTableName) return
    async function loadDetails() {
      setTableDetailsLoading(true)
      try {
        const details = await fetchWarehouseTableDetails(selectedTableName, {
          page: tableSamplePage,
          pageSize: 10,
        })
        setTableDetails(details)
      } catch (err) {
        console.error(`Failed to load details for table ${selectedTableName}`, err)
      } finally {
        setTableDetailsLoading(false)
      }
    }
    loadDetails()
  }, [selectedTableName, tableSamplePage])

  // Category color mapping
  const categoryColors = {
    dimension: {
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-700/60',
      text: 'text-emerald-400',
      badge: 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
      nodeBg: '#062015',
      nodeBorder: '#10b981',
    },
    fact: {
      bg: 'bg-sky-950/40',
      border: 'border-sky-700/60',
      text: 'text-sky-400',
      badge: 'bg-sky-900/60 text-sky-300 border-sky-700',
      nodeBg: '#081d33',
      nodeBorder: '#0ea5e9',
    },
    bridge: {
      bg: 'bg-purple-950/40',
      border: 'border-purple-700/60',
      text: 'text-purple-400',
      badge: 'bg-purple-900/60 text-purple-300 border-purple-700',
      nodeBg: '#1f0d38',
      nodeBorder: '#a855f7',
    },
    audit: {
      bg: 'bg-amber-950/40',
      border: 'border-amber-700/60',
      text: 'text-amber-400',
      badge: 'bg-amber-900/60 text-amber-300 border-amber-700',
      nodeBg: '#261505',
      nodeBorder: '#f59e0b',
    },
  }

  // Filtered ERD tables
  const filteredTables = useMemo(() => {
    if (!schemaData?.tables) return []
    return schemaData.tables.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(erdSearch.toLowerCase()) ||
        t.displayName.toLowerCase().includes(erdSearch.toLowerCase())
      const matchesCategory =
        erdCategoryFilter === 'ALL' || t.category === erdCategoryFilter
      return matchesSearch && matchesCategory
    })
  }, [schemaData, erdSearch, erdCategoryFilter])

  // Pre-calculated topological tier positions for ERD layout
  const tablePositions = useMemo(() => {
    const positions = {}
    // Tier 1: Dimensions (x: 40)
    const dimensions = ['dim_student', 'dim_alumni', 'dim_company', 'dim_skill', 'dim_date', 'dim_job']
    dimensions.forEach((name, i) => {
      positions[name] = { x: 50, y: 40 + i * 140 }
    })

    // Tier 2: Bridges (x: 370)
    const bridges = ['bridge_student_skill', 'bridge_alumni_skill', 'bridge_job_skill']
    bridges.forEach((name, i) => {
      positions[name] = { x: 380, y: 110 + i * 190 }
    })

    // Tier 3: Facts (x: 710)
    const facts = ['fact_placement', 'fact_job_application', 'fact_salary_benchmark', 'fact_career_outcomes']
    facts.forEach((name, i) => {
      positions[name] = { x: 710, y: 70 + i * 170 }
    })

    // Tier 4: Audit (x: 1040)
    const audit = ['etl_batches', 'etl_batch_errors']
    audit.forEach((name, i) => {
      positions[name] = { x: 1040, y: 150 + i * 220 }
    })

    return positions
  }, [])

  // Highlighted relationships for selected ERD table
  const highlightedRelationships = useMemo(() => {
    if (!selectedErdTable || !schemaData?.relationships) return new Set()
    const set = new Set()
    schemaData.relationships.forEach((rel) => {
      if (rel.sourceTable === selectedErdTable || rel.targetTable === selectedErdTable) {
        set.add(rel.id)
      }
    })
    return set
  }, [selectedErdTable, schemaData])

  // Mouse drag handlers for canvas pan
  function handleMouseDown(e) {
    if (e.button !== 0) return
    isDragging.current = true
    dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y }
  }

  function handleMouseMove(e) {
    if (!isDragging.current) return
    setPanOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    })
  }

  function handleMouseUp() {
    isDragging.current = false
  }

  function handleResetView() {
    setZoomLevel(1)
    setPanOffset({ x: 20, y: 20 })
    setSelectedErdTable(null)
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] text-neutral-400 font-mono text-xs gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
        <span>INSPECTING DWM WAREHOUSE TOPOLOGY & CATALOG...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="rounded border border-red-800 bg-red-950/40 p-4 text-xs font-mono text-red-300 space-y-2">
          <div className="font-bold uppercase tracking-wider text-red-200">Warehouse Inspection Error</div>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const counts = summaryData?.counts || {}
  const distinction = summaryData?.measurementDistinction || {}
  const dbInfo = summaryData?.database || {}

  return (
    <div className="flex-1 space-y-6 pb-12">
      {/* COCKPIT HEADER */}
      <div className="border-b border-neutral-800 bg-[#0c0c0e] px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
              PostgreSQL Analytical Engine &bull; Schema: {dbInfo.schema || 'dwh'}
            </span>
            <span className="rounded bg-neutral-800 border border-neutral-700 px-1.5 py-0.5 text-[9px] font-mono text-neutral-300">
              Decoupled from public.*
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1">
            DWM Database & Warehouse Architecture Cockpit
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Full catalog metadata, relational topology graph, data quality diagnostics, and dataset audit ledger.
          </p>
        </div>

        {/* TOP TAB NAVIGATION */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs bg-neutral-900/80 p-1 rounded-sm border border-neutral-800">
          <button
            type="button"
            onClick={() => setActiveTab('erd')}
            className={`px-3 py-1.5 rounded-sm transition-colors cursor-pointer ${
              activeTab === 'erd'
                ? 'bg-neutral-800 text-white font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Schema ERD
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tables')}
            className={`px-3 py-1.5 rounded-sm transition-colors cursor-pointer ${
              activeTab === 'tables'
                ? 'bg-neutral-800 text-white font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Table Explorer ({counts.totalTables || 15})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quality')}
            className={`px-3 py-1.5 rounded-sm transition-colors cursor-pointer ${
              activeTab === 'quality'
                ? 'bg-neutral-800 text-white font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Data Quality ({qualityData?.summary?.passRatePercent || 100}%)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('datasets')}
            className={`px-3 py-1.5 rounded-sm transition-colors cursor-pointer ${
              activeTab === 'datasets'
                ? 'bg-neutral-800 text-white font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Datasets (7)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-sm transition-colors cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-neutral-800 text-white font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Audit Ledger ({counts.totalBatches || 0})
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* EXECUTIVE SUMMARY KPI CARDS (Part 2A) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
          <div className="rounded-sm border border-neutral-800 bg-[#121214] p-3 space-y-1">
            <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider">Total Warehouse Rows</span>
            <div className="text-xl font-bold text-white tracking-tight">{counts.totalRows?.toLocaleString() || 0}</div>
            <span className="text-[10px] text-neutral-400 block truncate">across {counts.totalTables} dwh tables</span>
          </div>

          <div className="rounded-sm border border-emerald-900/50 bg-emerald-950/20 p-3 space-y-1">
            <span className="text-[10px] uppercase text-emerald-400 font-bold tracking-wider">Dimension Tables</span>
            <div className="text-xl font-bold text-emerald-300">{counts.dimensionTables || 6}</div>
            <span className="text-[10px] text-emerald-500 block truncate">student, alumni, job, ...</span>
          </div>

          <div className="rounded-sm border border-sky-900/50 bg-sky-950/20 p-3 space-y-1">
            <span className="text-[10px] uppercase text-sky-400 font-bold tracking-wider">Fact Tables</span>
            <div className="text-xl font-bold text-sky-300">{counts.factTables || 4}</div>
            <span className="text-[10px] text-sky-500 block truncate">placement, career, apps</span>
          </div>

          <div className="rounded-sm border border-purple-900/50 bg-purple-950/20 p-3 space-y-1">
            <span className="text-[10px] uppercase text-purple-400 font-bold tracking-wider">Bridge Tables</span>
            <div className="text-xl font-bold text-purple-300">{counts.bridgeTables || 3}</div>
            <span className="text-[10px] text-purple-500 block truncate">associative skills junctions</span>
          </div>

          <div className="rounded-sm border border-neutral-800 bg-[#121214] p-3 space-y-1">
            <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider">Foreign Keys</span>
            <div className="text-xl font-bold text-amber-300">{counts.totalForeignKeys || 22}</div>
            <span className="text-[10px] text-neutral-400 block truncate">referential links mapped</span>
          </div>

          <div className="rounded-sm border border-neutral-800 bg-[#121214] p-3 space-y-1">
            <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-wider">Catalog Columns</span>
            <div className="text-xl font-bold text-neutral-200">{counts.totalColumns || 157}</div>
            <span className="text-[10px] text-neutral-400 block truncate">typed schema attributes</span>
          </div>
        </div>

        {/* MEASUREMENT DISTINCTION BANNER (Part 2A Requirement) */}
        <div className="rounded-sm border border-neutral-800 bg-[#0c0c0e] p-3 text-xs font-mono flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sky-400 font-bold uppercase text-[10px] tracking-wider">
                Measurement Metric Distinction:
              </span>
              <span className="text-neutral-400 text-[11px]">
                Warehouse Rows vs. Raw CSV File Lines vs. ETL Transactions
              </span>
            </div>
            <p className="text-neutral-500 text-[11px]">
              {distinction.explanation ||
                'Warehouse table rows reflect relational bridge junctions and dimension records; CSV lines reflect raw benchmark input; Ingestion batches reflect audit ledger transactions.'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] shrink-0">
            <div>
              <span className="text-neutral-500">Warehouse Rows:</span>{' '}
              <span className="font-bold text-white">{counts.totalRows?.toLocaleString()}</span>
            </div>
            <div className="h-3 w-px bg-neutral-800" />
            <div>
              <span className="text-neutral-500">CSV Records:</span>{' '}
              <span className="font-bold text-emerald-400">50,150</span>
            </div>
            <div className="h-3 w-px bg-neutral-800" />
            <div>
              <span className="text-neutral-500">Batches:</span>{' '}
              <span className="font-bold text-purple-400">{counts.totalBatches}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: SCHEMA STRUCTURE & ERD VISUALIZATION (Part 2B) */}
        {/* ========================================================================= */}
        {activeTab === 'erd' && (
          <div className="space-y-4">
            {/* ERD Canvas Controls */}
            <div className="rounded-sm border border-neutral-800 bg-[#121214] p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 text-[10px] uppercase font-bold">Search Table:</span>
                  <input
                    type="text"
                    value={erdSearch}
                    onChange={(e) => setErdSearch(e.target.value)}
                    placeholder="Filter by name..."
                    className="rounded bg-neutral-900 border border-neutral-700 px-2 py-1 text-white text-[11px] focus:outline-none w-44"
                  />
                </div>

                {/* Category filter */}
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 text-[10px] uppercase font-bold">Category:</span>
                  <select
                    value={erdCategoryFilter}
                    onChange={(e) => setErdCategoryFilter(e.target.value)}
                    className="rounded bg-neutral-900 border border-neutral-700 px-2 py-1 text-white text-[11px] focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Categories ({schemaData?.tables?.length || 15})</option>
                    <option value="dimension">Dimensions (6)</option>
                    <option value="fact">Facts (4)</option>
                    <option value="bridge">Bridges (3)</option>
                    <option value="audit">Audit Ledger (2)</option>
                  </select>
                </div>
              </div>

              {/* Zoom & Pan Controls */}
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 text-[10px]">Zoom: {Math.round(zoomLevel * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.15))}
                  className="rounded bg-neutral-800 hover:bg-neutral-700 text-white px-2 py-1 text-xs cursor-pointer"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.4, z - 0.15))}
                  className="rounded bg-neutral-800 hover:bg-neutral-700 text-white px-2 py-1 text-xs cursor-pointer"
                  title="Zoom Out"
                >
                  &minus;
                </button>
                <button
                  type="button"
                  onClick={handleResetView}
                  className="rounded bg-neutral-800 hover:bg-neutral-700 text-white px-2 py-1 text-xs cursor-pointer"
                  title="Reset View"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Interactive SVG Diagram Viewport */}
            <div
              className="relative w-full h-[620px] rounded-sm border border-neutral-800 bg-[#08080a] overflow-hidden select-none cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Subtle background grid */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Tier Headers */}
              <div
                className="absolute top-2 left-0 right-0 flex pointer-events-none font-mono text-[10px] uppercase font-bold tracking-wider"
                style={{
                  transform: `translate(${panOffset.x}px, 10px) scale(${zoomLevel})`,
                  transformOrigin: 'top left',
                }}
              >
                <div style={{ position: 'absolute', left: '50px' }} className="text-emerald-400">
                  Tier 1: Dimensions (6)
                </div>
                <div style={{ position: 'absolute', left: '380px' }} className="text-purple-400">
                  Tier 2: Bridges (3)
                </div>
                <div style={{ position: 'absolute', left: '710px' }} className="text-sky-400">
                  Tier 3: Facts (4)
                </div>
                <div style={{ position: 'absolute', left: '1040px' }} className="text-amber-400">
                  Tier 4: Audit & Ledger (2)
                </div>
              </div>

              {/* Zoomable & Pannable SVG Layer */}
              <svg
                className="w-full h-full overflow-visible"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                  transformOrigin: '0 0',
                }}
              >
                <defs>
                  <marker
                    id="arrow-default"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                  </marker>
                  <marker
                    id="arrow-active"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                  </marker>
                </defs>

                {/* 1. Foreign Key Relationship Lines */}
                {schemaData?.relationships?.map((rel) => {
                  const sourcePos = tablePositions[rel.sourceTable]
                  const targetPos = tablePositions[rel.targetTable]
                  if (!sourcePos || !targetPos) return null

                  const isHighlighted = highlightedRelationships.has(rel.id)
                  const startX = sourcePos.x
                  const startY = sourcePos.y + 40
                  const endX = targetPos.x + 220
                  const endY = targetPos.y + 40

                  // Calculate cubic bezier curve between tiers
                  const midX = (startX + endX) / 2
                  const pathD = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`

                  return (
                    <g key={rel.id}>
                      <path
                        d={pathD}
                        fill="none"
                        stroke={isHighlighted ? '#38bdf8' : '#27272a'}
                        strokeWidth={isHighlighted ? 2.5 : 1.2}
                        strokeDasharray={rel.cardinality === 'many-to-many' ? '4 3' : 'none'}
                        markerEnd={isHighlighted ? 'url(#arrow-active)' : 'url(#arrow-default)'}
                        className="transition-all duration-300"
                      />
                    </g>
                  )
                })}

                {/* 2. Interactive Table Nodes */}
                {schemaData?.tables?.map((table) => {
                  const pos = tablePositions[table.name]
                  if (!pos) return null

                  const isSelected = selectedTableName === table.name
                  const isFiltered = filteredTables.some((t) => t.name === table.name)
                  const colors = categoryColors[table.category] || categoryColors.dimension

                  const nodeOpacity = isFiltered ? 1 : 0.2

                  return (
                    <g
                      key={table.name}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      opacity={nodeOpacity}
                      className="cursor-pointer transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedTableName(table.name)
                        setSelectedErdTable(table.name)
                      }}
                    >
                      {/* Node Box */}
                      <rect
                        width="220"
                        height="105"
                        rx="4"
                        fill={colors.nodeBg}
                        stroke={isSelected ? '#ffffff' : colors.nodeBorder}
                        strokeWidth={isSelected ? 2.5 : 1.2}
                        className="hover:stroke-white transition-colors"
                      />

                      {/* Header bar */}
                      <rect
                        width="220"
                        height="26"
                        rx="4"
                        fill="rgba(0,0,0,0.4)"
                      />

                      {/* Category Badge & Table Name */}
                      <text
                        x="10"
                        y="17"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {table.name}
                      </text>

                      {/* Category Tag */}
                      <text
                        x="210"
                        y="17"
                        fill={colors.nodeBorder}
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="end"
                      >
                        {table.category.toUpperCase()}
                      </text>

                      {/* Row count & Column count */}
                      <text
                        x="10"
                        y="42"
                        fill="#9ca3af"
                        fontSize="9.5"
                        fontFamily="monospace"
                      >
                        Rows: <tspan fill="#ffffff" fontWeight="bold">{table.rowCount?.toLocaleString()}</tspan> | Cols: {table.columnCount}
                      </text>

                      {/* Primary Key indicator */}
                      <text
                        x="10"
                        y="60"
                        fill="#fcd34d"
                        fontSize="9"
                        fontFamily="monospace"
                      >
                        PK: {table.primaryKey?.join(', ') || 'none'}
                      </text>

                      {/* Foreign Keys count indicator */}
                      <text
                        x="10"
                        y="78"
                        fill="#9ca3af"
                        fontSize="9"
                        fontFamily="monospace"
                      >
                        Outgoing FKs: {table.foreignKeys?.length || 0} | Refs: {table.referencedBy?.length || 0}
                      </text>

                      {/* Click prompt */}
                      <text
                        x="10"
                        y="95"
                        fill="#38bdf8"
                        fontSize="8.5"
                        fontFamily="monospace"
                      >
                        &bull; Click to inspect columns
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Quick Helper Banner */}
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 px-1">
              <span>
                &bull; Drag to pan canvas &bull; Scroll / buttons to zoom &bull; Click any table node to inspect columns, statistics, and sample records.
              </span>
              <span className="text-neutral-400">
                Selected: <span className="text-white font-bold">{selectedTableName}</span>
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SEARCHABLE TABLE EXPLORER (Part 2C) */}
        {/* ========================================================================= */}
        {activeTab === 'tables' && (
          <div className="space-y-4">
            <div className="rounded-sm border border-neutral-800 bg-[#121214] p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={erdSearch}
                  onChange={(e) => setErdSearch(e.target.value)}
                  placeholder="Search table inventory..."
                  className="rounded bg-neutral-900 border border-neutral-700 px-3 py-1.5 text-white text-xs focus:outline-none w-64"
                />
                <select
                  value={erdCategoryFilter}
                  onChange={(e) => setErdCategoryFilter(e.target.value)}
                  className="rounded bg-neutral-900 border border-neutral-700 px-3 py-1.5 text-white text-xs focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Categories ({schemaData?.tables?.length || 15})</option>
                  <option value="dimension">Dimensions (6)</option>
                  <option value="fact">Facts (4)</option>
                  <option value="bridge">Bridges (3)</option>
                  <option value="audit">Audit Ledger (2)</option>
                </select>
              </div>
              <div className="text-neutral-400 text-xs">
                Showing {filteredTables.length} of {schemaData?.tables?.length || 15} warehouse tables
              </div>
            </div>

            {/* Table Inventory Grid */}
            <div className="rounded-sm border border-neutral-800 bg-[#0c0c0e] overflow-hidden">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 bg-[#121214] text-neutral-400 uppercase text-[10px]">
                    <th className="p-3">Schema & Table</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Row Count</th>
                    <th className="p-3 text-right">Columns</th>
                    <th className="p-3">Primary Key</th>
                    <th className="p-3 text-right">Foreign Keys</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredTables.map((table) => {
                    const colors = categoryColors[table.category] || categoryColors.dimension
                    const isSelected = selectedTableName === table.name

                    return (
                      <tr
                        key={table.name}
                        onClick={() => setSelectedTableName(table.name)}
                        className={`hover:bg-neutral-900/60 transition-colors cursor-pointer ${
                          isSelected ? 'bg-neutral-900/90' : ''
                        }`}
                      >
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <span className="text-neutral-500 text-[10px]">dwh.</span>
                          <span>{table.name}</span>
                        </td>
                        <td className="p-3">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${colors.badge}`}>
                            {table.category}
                          </span>
                        </td>
                        <td className="p-3 text-neutral-400 max-w-xs truncate text-[11px]">
                          {table.description}
                        </td>
                        <td className="p-3 text-right font-bold text-white">
                          {table.rowCount?.toLocaleString()}
                        </td>
                        <td className="p-3 text-right text-neutral-300">
                          {table.columnCount}
                        </td>
                        <td className="p-3 text-amber-300 text-[11px]">
                          {table.primaryKey?.join(', ') || 'none'}
                        </td>
                        <td className="p-3 text-right text-neutral-400">
                          {table.foreignKeys?.length || 0}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedTableName(table.name)
                            }}
                            className="rounded bg-neutral-800 hover:bg-neutral-700 px-2 py-1 text-[10px] text-sky-400 font-bold transition-colors cursor-pointer"
                          >
                            Inspect &rarr;
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TABLE DETAILS INSPECTION PANEL (Part 2D - Shown for ERD and Table views) */}
        {/* ========================================================================= */}
        {(activeTab === 'erd' || activeTab === 'tables') && selectedTableName && (
          <div className="rounded-sm border border-neutral-800 bg-[#121214] p-5 space-y-5 font-mono">
            {/* Header of Table Details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 text-xs">dwh.</span>
                  <span className="text-lg font-bold text-white tracking-tight">{tableDetails?.tableName || selectedTableName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                      categoryColors[tableDetails?.category]?.badge || categoryColors.dimension.badge
                    }`}
                  >
                    {tableDetails?.category || 'TABLE'}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">{tableDetails?.description}</p>
              </div>

              <div className="flex items-center gap-4 text-xs shrink-0">
                <div>
                  <span className="text-neutral-500">Total Rows:</span>{' '}
                  <span className="font-bold text-white">{tableDetails?.totalRows?.toLocaleString() || 0}</span>
                </div>
                <div className="h-3 w-px bg-neutral-800" />
                <div>
                  <span className="text-neutral-500">Columns:</span>{' '}
                  <span className="font-bold text-neutral-300">{tableDetails?.columns?.length || 0}</span>
                </div>
                <div className="h-3 w-px bg-neutral-800" />
                <div>
                  <span className="text-neutral-500">Duplicate PKs:</span>{' '}
                  <span className={`font-bold ${tableDetails?.duplicateKeyCount === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tableDetails?.duplicateKeyCount || 0}
                  </span>
                </div>
              </div>
            </div>

            {tableDetailsLoading ? (
              <div className="p-8 text-center text-neutral-500 text-xs">Loading table metadata and profiles...</div>
            ) : (
              <div className="space-y-6">
                {/* 1. Columns & Profiling Statistics Table */}
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Schema Columns & Statistical Profiles
                  </h3>
                  <div className="rounded border border-neutral-800 bg-[#0c0c0e] overflow-x-auto">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-800 bg-[#16161a] text-neutral-400 uppercase text-[9.5px]">
                          <th className="p-2.5">Column Name</th>
                          <th className="p-2.5">Data Type</th>
                          <th className="p-2.5">Nullable</th>
                          <th className="p-2.5">Keys</th>
                          <th className="p-2.5">Foreign Key Target</th>
                          <th className="p-2.5 text-right">Null Count</th>
                          <th className="p-2.5 text-right">Null %</th>
                          <th className="p-2.5 text-right">Distinct Values</th>
                          <th className="p-2.5">Range (Min / Max)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60">
                        {tableDetails?.columns?.map((col) => (
                          <tr key={col.name} className="hover:bg-neutral-900/40">
                            <td className="p-2.5 font-bold text-white">{col.name}</td>
                            <td className="p-2.5 text-neutral-400 font-mono">{col.dataType}</td>
                            <td className="p-2.5">
                              {col.nullable ? (
                                <span className="text-neutral-500">YES</span>
                              ) : (
                                <span className="text-neutral-300 font-bold">NO</span>
                              )}
                            </td>
                            <td className="p-2.5">
                              {col.isPk ? (
                                <span className="px-1.5 py-0.5 rounded bg-amber-950 border border-amber-700 text-amber-300 text-[9px] font-bold">
                                  PRIMARY KEY
                                </span>
                              ) : col.isFk ? (
                                <span className="px-1.5 py-0.5 rounded bg-sky-950 border border-sky-700 text-sky-300 text-[9px] font-bold">
                                  FOREIGN KEY
                                </span>
                              ) : (
                                <span className="text-neutral-600">&minus;</span>
                              )}
                            </td>
                            <td className="p-2.5 text-sky-400">
                              {col.references ? (
                                <span>{col.references.table}.{col.references.column}</span>
                              ) : (
                                <span className="text-neutral-600">&minus;</span>
                              )}
                            </td>
                            <td className="p-2.5 text-right text-neutral-300 font-mono">
                              {col.stats?.nullCount?.toLocaleString() ?? 0}
                            </td>
                            <td className="p-2.5 text-right font-mono">
                              <span
                                className={
                                  (col.stats?.nullPercentage || 0) > 20
                                    ? 'text-amber-400 font-bold'
                                    : 'text-neutral-400'
                                }
                              >
                                {col.stats?.nullPercentage ?? 0}%
                              </span>
                            </td>
                            <td className="p-2.5 text-right text-neutral-300 font-mono">
                              {col.stats?.distinctCount?.toLocaleString() ?? 0}
                            </td>
                            <td className="p-2.5 text-neutral-400 text-[10px] font-mono truncate max-w-xs">
                              {col.stats?.min !== null && col.stats?.max !== null ? (
                                <span>{col.stats.min} &rarr; {col.stats.max}</span>
                              ) : (
                                <span className="text-neutral-600">&minus;</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Sample Records Preview with Safe Pagination */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Sample Records Preview (Read-Only Allowlisted Query)
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-neutral-500">
                        Page {tableSamplePage} of {tableDetails?.sampleRecords?.totalPages || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => setTableSamplePage((p) => Math.max(1, p - 1))}
                        disabled={tableSamplePage <= 1}
                        className="rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 px-2 py-1 text-xs cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={() => setTableSamplePage((p) => p + 1)}
                        disabled={tableSamplePage >= (tableDetails?.sampleRecords?.totalPages || 1)}
                        className="rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 px-2 py-1 text-xs cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  <div className="rounded border border-neutral-800 bg-[#0c0c0e] overflow-x-auto max-h-72">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-800 bg-[#16161a] text-neutral-400 uppercase text-[9.5px]">
                          {tableDetails?.columns?.map((c) => (
                            <th key={c.name} className="p-2 whitespace-nowrap">
                              {c.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60 font-mono">
                        {tableDetails?.sampleRecords?.records?.map((rec, i) => (
                          <tr key={i} className="hover:bg-neutral-900/40">
                            {tableDetails.columns.map((c) => {
                              const val = rec[c.name]
                              return (
                                <td key={c.name} className="p-2 whitespace-nowrap text-neutral-300">
                                  {val === null || val === undefined ? (
                                    <span className="text-neutral-600 italic">null</span>
                                  ) : typeof val === 'object' ? (
                                    JSON.stringify(val)
                                  ) : (
                                    String(val)
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: WAREHOUSE DATA QUALITY SUITE (Part 2E) */}
        {/* ========================================================================= */}
        {activeTab === 'quality' && (
          <div className="space-y-5 font-mono text-xs">
            {/* Quality Scorecard Banner */}
            <div className="rounded-sm border border-neutral-800 bg-[#121214] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                    Warehouse Data Integrity & Quality Suite
                  </span>
                  <span className="rounded bg-emerald-950 border border-emerald-800 px-2 py-0.5 text-[10px] text-emerald-300 font-bold">
                    {qualityData?.summary?.healthStatus || 'HEALTHY'}
                  </span>
                </div>
                <p className="text-neutral-400 text-xs">
                  Read-only integrity audit testing for duplicate primary keys, orphaned foreign keys, domain ranges, and unhandled batch exceptions.
                </p>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">Overall Pass Rate</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    {qualityData?.summary?.passRatePercent || 100}%
                  </span>
                </div>
                <div className="h-8 w-px bg-neutral-800" />
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">Executed Checks</span>
                  <span className="text-2xl font-bold text-white">
                    {qualityData?.summary?.executedChecks || 0}
                  </span>
                </div>
                <div className="h-8 w-px bg-neutral-800" />
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">Failed Violations</span>
                  <span className={`text-2xl font-bold ${(qualityData?.summary?.failed || 0) > 0 ? 'text-red-400' : 'text-neutral-400'}`}>
                    {qualityData?.summary?.failed || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Quality Checks Table */}
            <div className="rounded-sm border border-neutral-800 bg-[#0c0c0e] overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 bg-[#121214] text-neutral-400 uppercase text-[10px]">
                    <th className="p-3">Check Category</th>
                    <th className="p-3">Table Target</th>
                    <th className="p-3">Tested Attribute / Constraint</th>
                    <th className="p-3">Expected Rule</th>
                    <th className="p-3">Actual Result</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {qualityData?.checks?.map((chk, idx) => (
                    <tr key={idx} className="hover:bg-neutral-900/40">
                      <td className="p-3 font-bold text-white text-[11px]">{chk.category}</td>
                      <td className="p-3 text-sky-400 text-[11px]">dwh.{chk.table}</td>
                      <td className="p-3 text-neutral-300 text-[11px] font-mono">{chk.column}</td>
                      <td className="p-3 text-neutral-400 text-[11px]">{chk.expected}</td>
                      <td className="p-3 text-neutral-200 text-[11px] font-mono">{chk.actual}</td>
                      <td className="p-3">
                        <span
                          className={`text-[9.5px] px-1.5 py-0.5 rounded font-bold ${
                            chk.severity === 'CRITICAL'
                              ? 'bg-red-950/60 text-red-300 border border-red-800'
                              : chk.severity === 'HIGH'
                                ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                                : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {chk.severity}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            chk.status === 'PASSED'
                              ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                              : chk.status === 'WARNING'
                                ? 'bg-amber-950 border border-amber-800 text-amber-300'
                                : 'bg-red-950 border border-red-800 text-red-300'
                          }`}
                        >
                          {chk.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DATASET INVENTORY (Part 2F) */}
        {/* ========================================================================= */}
        {activeTab === 'datasets' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="rounded-sm border border-neutral-800 bg-[#121214] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Physical Benchmark Datasets (7 Files)
                </h2>
                <p className="text-neutral-400 text-xs mt-0.5">
                  Located in <span className="text-sky-300">datasets/</span> &bull; Inspected read-only without modifying or regenerating files.
                </p>
              </div>
              <div className="text-neutral-400 text-xs">
                Total CSV Lines:{' '}
                <span className="font-bold text-emerald-400">
                  {datasetsData?.totalSourceRecords?.toLocaleString() || '50,150'}
                </span>
              </div>
            </div>

            {/* Datasets Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {datasetsData?.datasets?.map((ds) => (
                <div
                  key={ds.fileName}
                  className="rounded-sm border border-neutral-800 bg-[#0c0c0e] p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{ds.fileName}</span>
                      <span className="rounded bg-emerald-950 border border-emerald-800 px-1.5 py-0.5 text-[9px] text-emerald-300 font-bold">
                        {ds.validationStatus}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-400">{ds.description}</p>

                    <div className="rounded bg-neutral-900/60 p-2 text-[10px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Target Warehouse Table:</span>
                        <span className="text-sky-400 font-bold">dwh.{ds.targetTable}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">CSV Record Count:</span>
                        <span className="text-white font-bold">{ds.sourceRecordCount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Current Table Rows:</span>
                        <span className="text-neutral-300">{ds.currentWarehouseRows?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">File Size:</span>
                        <span className="text-neutral-400">{ds.fileSizeFormatted}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9.5px] uppercase text-neutral-500 block mb-1">
                      Columns ({ds.columnCount}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {ds.columns?.map((col) => (
                        <span
                          key={col}
                          className="rounded bg-neutral-800 px-1.5 py-0.2 text-[9px] text-neutral-300"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: INGESTION AUDIT LEDGER (Part 2G) */}
        {/* ========================================================================= */}
        {activeTab === 'audit' && (
          <div className="space-y-4 font-mono text-xs">
            {/* Audit Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-sm border border-neutral-800 bg-[#121214] p-3 space-y-1">
                <span className="text-[10px] uppercase text-neutral-500 font-bold">Total Batches</span>
                <div className="text-xl font-bold text-white">{auditData?.summary?.totalBatches || 0}</div>
              </div>
              <div className="rounded-sm border border-emerald-900/50 bg-emerald-950/20 p-3 space-y-1">
                <span className="text-[10px] uppercase text-emerald-400 font-bold">Completed Batches</span>
                <div className="text-xl font-bold text-emerald-300">{auditData?.summary?.completedBatches || 0}</div>
              </div>
              <div className="rounded-sm border border-neutral-800 bg-[#121214] p-3 space-y-1">
                <span className="text-[10px] uppercase text-neutral-500 font-bold">Total Ingested Rows</span>
                <div className="text-xl font-bold text-white">{auditData?.summary?.totalRowsInserted?.toLocaleString() || 0}</div>
              </div>
              <div className="rounded-sm border border-neutral-800 bg-[#121214] p-3 space-y-1">
                <span className="text-[10px] uppercase text-neutral-500 font-bold">Total Rejected Rows</span>
                <div className="text-xl font-bold text-amber-300">{auditData?.summary?.totalRowsRejected?.toLocaleString() || 0}</div>
              </div>
            </div>

            {/* Audit Ledger Table */}
            <div className="rounded-sm border border-neutral-800 bg-[#0c0c0e] overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 bg-[#121214] text-neutral-400 uppercase text-[10px]">
                    <th className="p-3">Batch ID</th>
                    <th className="p-3">Batch Type</th>
                    <th className="p-3">Dataset Source</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Total Rows</th>
                    <th className="p-3 text-right">Inserted</th>
                    <th className="p-3 text-right">Rejected</th>
                    <th className="p-3">Started At</th>
                    <th className="p-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono">
                  {auditData?.batches?.map((b) => (
                    <tr key={b.id} className="hover:bg-neutral-900/40">
                      <td className="p-3 text-neutral-400 text-[10px]">{b.id?.slice(0, 8)}...</td>
                      <td className="p-3 font-bold text-white">{b.batchType}</td>
                      <td className="p-3 text-sky-400 text-[11px]">{b.fileName}</td>
                      <td className="p-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                            b.status === 'completed'
                              ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                              : b.status === 'processing'
                                ? 'bg-sky-950 border border-sky-800 text-sky-300 animate-pulse'
                                : 'bg-red-950 border border-red-800 text-red-300'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3 text-right text-neutral-300">{b.rowsTotal?.toLocaleString()}</td>
                      <td className="p-3 text-right font-bold text-white">{b.rowsInserted?.toLocaleString()}</td>
                      <td className="p-3 text-right text-neutral-400">{b.rowsRejected || 0}</td>
                      <td className="p-3 text-neutral-400 text-[10px]">
                        {b.startedAt ? new Date(b.startedAt).toLocaleString() : '&minus;'}
                      </td>
                      <td className="p-3 text-neutral-400 text-[10px]">
                        {b.durationMs ? `${(b.durationMs / 1000).toFixed(2)}s` : '&minus;'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
