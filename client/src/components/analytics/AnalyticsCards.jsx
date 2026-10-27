import React from 'react'

export function KpiCard({ title, value, subtext, delta, icon, trend = 'up' }) {
  const isPositive = trend === 'up'
  return (
    <div className="rounded-sm border border-neutral-800 bg-[#121214] p-5 transition-colors hover:border-neutral-700">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono tracking-wider uppercase text-neutral-400">{title}</span>
        {icon ? <div className="text-neutral-500">{icon}</div> : null}
      </div>
      <div className="mt-3 flex items-baseline gap-3">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        {delta ? (
          <span className={`inline-flex items-center text-xs font-mono font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {delta}
          </span>
        ) : null}
      </div>
      {subtext ? (
        <p className="mt-1 text-xs text-neutral-500 font-mono">{subtext}</p>
      ) : null}
    </div>
  )
}

export function WarehouseHealthCard({ status = 'HEALTHY', totalRows = 753, schema = 'dwh', lastSync }) {
  return (
    <div className="rounded-sm border border-neutral-800 bg-[#121214] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-wide">Warehouse Cluster: {status}</span>
            <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-300">schema: {schema}</span>
          </div>
          <p className="text-xs text-neutral-400 font-mono mt-0.5">
            Operational Records: <strong className="text-neutral-200">{totalRows}</strong> &bull; Isolation: Strict Read-Only Extraction
          </p>
        </div>
      </div>
      <div className="text-left sm:text-right font-mono text-xs text-neutral-500">
        <div>Refreshed: <span className="text-neutral-300">{lastSync ? new Date(lastSync).toLocaleTimeString() : 'Live'}</span></div>
        <div className="text-[10px] text-neutral-400">PostgreSQL Wire &bull; Port 54329</div>
      </div>
    </div>
  )
}

export default {
  KpiCard,
  WarehouseHealthCard,
}
