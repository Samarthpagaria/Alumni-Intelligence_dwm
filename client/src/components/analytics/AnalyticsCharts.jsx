import { useState } from 'react'

/**
 * Responsive Minimalist SVG Bar Chart
 */
export function BarChart({ data = [], xKey = 'label', yKey = 'value', height = 220, barColor = '#fafafa', unit = '' }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  if (!data || data.length === 0) {
    return <div className="flex h-48 items-center justify-center text-xs font-mono text-neutral-500">NO DATA AVAILABLE</div>
  }

  const values = data.map((d) => Number(d[yKey]) || 0)
  const maxValue = Math.max(...values, 1)

  return (
    <div className="w-full">
      <div className="relative flex items-end gap-2 sm:gap-3" style={{ height: `${height}px` }}>
        {data.map((item, idx) => {
          const val = Number(item[yKey]) || 0
          const pct = Math.max(4, Math.round((val / maxValue) * 100))
          const isHovered = hoveredIdx === idx

          return (
            <div
              key={idx}
              className="group relative flex flex-1 flex-col items-center h-full justify-end"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered ? (
                <div className="absolute -top-10 z-20 whitespace-nowrap rounded bg-neutral-900 border border-neutral-700 px-2 py-1 text-[11px] font-mono text-white shadow-lg pointer-events-none">
                  {item[xKey]}: <strong>{val} {unit}</strong>
                </div>
              ) : null}

              {/* Bar */}
              <div
                className={`w-full rounded-t-sm transition-all duration-150 ${isHovered ? 'bg-white' : 'bg-neutral-300 opacity-80 hover:opacity-100'}`}
                style={{
                  height: `${pct}%`,
                  backgroundColor: isHovered ? '#ffffff' : barColor,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* X-Axis Labels */}
      <div className="mt-2.5 flex items-center justify-between border-t border-neutral-800 pt-2 gap-1 overflow-x-auto">
        {data.map((item, idx) => (
          <span
            key={idx}
            className={`flex-1 text-center font-mono text-[10px] truncate ${hoveredIdx === idx ? 'text-white font-bold' : 'text-neutral-500'}`}
            title={item[xKey]}
          >
            {item[xKey]}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Responsive Minimalist SVG Line Chart
 */
export function LineChart({ data = [], xKey = 'year', yKey = 'value', height = 200, strokeColor = '#38bdf8', unit = '' }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  if (!data || data.length < 2) {
    return <div className="flex h-48 items-center justify-center text-xs font-mono text-neutral-500">INSUFFICIENT DATA POINTS</div>
  }

  const values = data.map((d) => Number(d[yKey]) || 0)
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  const range = maxVal - minVal || 1

  const width = 600
  const paddingX = 40
  const paddingY = 25
  const usableWidth = width - paddingX * 2
  const usableHeight = height - paddingY * 2

  const points = data.map((d, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * usableWidth
    const y = height - paddingY - ((Number(d[yKey]) - minVal) / range) * usableHeight
    return { x, y, raw: d }
  })

  const pathD = points.reduce((acc, pt, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`
  }, '')

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
          {/* Subtle horizontal grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#262626" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#262626" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#333333" />

          {/* Area fill */}
          <path d={areaD} fill={strokeColor} fillOpacity="0.08" />

          {/* Line stroke */}
          <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Nodes */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIdx === idx
            return (
              <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}>
                <circle cx={pt.x} cy={pt.y} r={isHovered ? 6 : 4} fill="#121214" stroke={strokeColor} strokeWidth={isHovered ? 3 : 2} />
              </g>
            )
          })}
        </svg>

        {/* Hover info badge */}
        {hoveredIdx !== null ? (
          <div className="absolute top-2 right-2 rounded bg-neutral-900 border border-neutral-700 px-2.5 py-1 text-xs font-mono text-white shadow-md">
            {points[hoveredIdx].raw[xKey]}: <strong className="text-sky-400">{points[hoveredIdx].raw[yKey]} {unit}</strong>
          </div>
        ) : null}
      </div>

      {/* Axis markers */}
      <div className="flex justify-between px-2 pt-2 text-[10px] font-mono text-neutral-500 border-t border-neutral-800">
        <span>{data[0][xKey]}</span>
        <span>{data[Math.floor(data.length / 2)][xKey]}</span>
        <span>{data[data.length - 1][xKey]}</span>
      </div>
    </div>
  )
}

/**
 * Minimalist Donut Distribution Chart
 */
export function DonutChart({ data = [], nameKey = 'name', valKey = 'value', size = 160 }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const total = data.reduce((acc, d) => acc + (Number(d[valKey]) || 0), 0) || 1
  const colors = ['#fafafa', '#a1a1aa', '#71717a', '#52525b', '#3f3f46', '#27272a']

  let accumulatedPercent = 0
  const slices = data.map((d, idx) => {
    const val = Number(d[valKey]) || 0
    const pct = val / total
    const strokeDasharray = `${pct * 100} ${100 - pct * 100}`
    const strokeDashoffset = -accumulatedPercent * 100
    accumulatedPercent += pct
    return { ...d, pct, strokeDasharray, strokeDashoffset, color: colors[idx % colors.length] }
  })

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90">
          <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#262626" strokeWidth="6" />
          {slices.map((slice, idx) => (
            <circle
              key={idx}
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              stroke={slice.color}
              strokeWidth={hoveredIdx === idx ? 8 : 6}
              strokeDasharray={slice.strokeDasharray}
              strokeDashoffset={slice.strokeDashoffset}
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold font-mono text-white">
            {hoveredIdx !== null ? `${Math.round(slices[hoveredIdx].pct * 100)}%` : `${total}`}
          </span>
          <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400">
            {hoveredIdx !== null ? slices[hoveredIdx][nameKey] : 'Total'}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-1.5 w-full">
        {slices.slice(0, 5).map((slice, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between text-xs font-mono p-1 rounded transition-colors ${hoveredIdx === idx ? 'bg-neutral-800 text-white' : 'text-neutral-400'}`}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="h-2 w-2 rounded-xs" style={{ backgroundColor: slice.color }} />
              <span className="truncate">{slice[nameKey]}</span>
            </div>
            <span className="font-semibold text-neutral-200 ml-2">{Math.round(slice.pct * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 2D Scatter Plot for K-Means Clustering
 */
export function ScatterPlot({ clusters = [], height = 240 }) {
  const [selectedCluster, setSelectedCluster] = useState(null)
  const colors = ['#38bdf8', '#34d399', '#f43f5e', '#fbbf24']

  return (
    <div className="w-full">
      <div className="relative border border-neutral-800 rounded bg-[#09090b] p-4" style={{ height: `${height}px` }}>
        {/* Coordinate grid */}
        <div className="absolute inset-4 grid grid-cols-4 grid-rows-4 pointer-events-none">
          <div className="border-r border-b border-neutral-800/60" />
          <div className="border-r border-b border-neutral-800/60" />
          <div className="border-r border-b border-neutral-800/60" />
          <div className="border-b border-neutral-800/60" />
          <div className="border-r border-b border-neutral-800/60" />
          <div className="border-r border-b border-neutral-800/60" />
          <div className="border-r border-b border-neutral-800/60" />
          <div className="border-b border-neutral-800/60" />
        </div>

        {/* Centroid projections */}
        {clusters.map((cluster, idx) => {
          const color = colors[idx % colors.length]
          const isSelected = selectedCluster === cluster.id
          const cx = `${cluster.centroid.x}%`
          const cy = `${100 - cluster.centroid.y}%`

          return (
            <div
              key={cluster.id || idx}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125"
              style={{ left: cx, top: cy }}
              onClick={() => setSelectedCluster(isSelected ? null : cluster.id)}
            >
              <div
                className="flex items-center justify-center rounded-full border-2 text-[10px] font-bold text-white shadow-lg"
                style={{
                  width: isSelected ? '44px' : '32px',
                  height: isSelected ? '44px' : '32px',
                  borderColor: color,
                  backgroundColor: `${color}33`,
                }}
              >
                C{idx + 1}
              </div>
            </div>
          )
        })}

        {/* Legend overlay */}
        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-neutral-500">
          X: Experience Years &bull; Y: Salary Comp Index
        </div>
      </div>
    </div>
  )
}

export default {
  BarChart,
  LineChart,
  DonutChart,
  ScatterPlot,
}
