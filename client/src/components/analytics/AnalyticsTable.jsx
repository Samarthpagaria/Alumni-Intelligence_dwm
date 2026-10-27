import { useState } from 'react'

export function AnalyticsTable({
  columns = [],
  data = [],
  emptyMessage = 'No analytical records found.',
  pageSize = 10,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')

  function handleSort(key) {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const valA = a[sortKey]
    const valB = b[sortKey]
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA
    }
    return sortOrder === 'asc'
      ? String(valA || '').localeCompare(String(valB || ''))
      : String(valB || '').localeCompare(String(valA || ''))
  })

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="w-full overflow-hidden rounded-sm border border-neutral-800 bg-[#121214]">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="border-b border-neutral-800 bg-[#17171a] text-neutral-400 uppercase tracking-wider text-[10px]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`px-4 py-3 font-semibold ${col.sortable !== false ? 'cursor-pointer hover:text-white select-none' : ''}`}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                    {sortKey === col.key ? (
                      <span className="text-white">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-neutral-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-neutral-800/30 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2.5">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between border-t border-neutral-800 px-4 py-2 text-xs font-mono text-neutral-500">
          <span>
            Page {currentPage} of {totalPages} ({data.length} total rows)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-neutral-300 hover:bg-neutral-800 disabled:opacity-40 cursor-pointer"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1 text-neutral-300 hover:bg-neutral-800 disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default AnalyticsTable
