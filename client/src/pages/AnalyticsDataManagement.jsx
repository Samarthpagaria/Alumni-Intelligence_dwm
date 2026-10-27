import { useState, useEffect } from 'react'
import { AnalyticsTable } from '../../components/analytics/AnalyticsTable.jsx'
import {
  uploadAndStageCsv,
  confirmStagedImport,
  fetchEtlHistory,
} from '../../services/analytics.service.js'

export default function AnalyticsDataManagement() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [stagedResult, setStagedResult] = useState(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [confirmSuccess, setConfirmSuccess] = useState(null)
  // Real Ingestion history ledger from dwh.etl_batches
  const [historyBatches, setHistoryBatches] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)

  async function loadHistory() {
    setHistoryLoading(true)
    try {
      const batches = await fetchEtlHistory()
      setHistoryBatches(batches)
    } catch (err) {
      console.error('Failed to load ETL history', err)
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  // Handle file selection and server-side validation & staging
  async function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setUploadError(null)
    setConfirmSuccess(null)
    setStagedResult(null)
    setIsUploading(true)

    try {
      const res = await uploadAndStageCsv(file)
      setStagedResult(res)
    } catch (err) {
      setUploadError(err?.response?.data?.message || err.message || 'CSV validation failed')
    } finally {
      setIsUploading(false)
    }
  }

  // Handle confirmed batch import
  async function handleConfirmImport() {
    if (!stagedResult?.batchId) return

    setIsConfirming(true)
    setUploadError(null)

    try {
      const res = await confirmStagedImport(stagedResult.batchId)
      setConfirmSuccess(res.message || `Successfully imported ${res.rowsInserted} rows into warehouse.`)
      setStagedResult(null)
      setSelectedFile(null)
      await loadHistory()
    } catch (err) {
      setUploadError(err?.response?.data?.message || err.message || 'Import confirmation failed')
    } finally {
      setIsConfirming(false)
    }
  }

  const historyColumns = [
    {
      key: 'id',
      label: 'Batch ID',
      sortable: true,
      render: (val) => <span className="font-mono text-[10px] text-neutral-400">{val?.slice(0, 8)}...</span>,
    },
    { key: 'type', label: 'Source Type', sortable: true },
    { key: 'fileName', label: 'Dataset File / Target', sortable: true },
    { key: 'rowsTotal', label: 'Total Rows', sortable: true },
    {
      key: 'rowsInserted',
      label: 'Inserted',
      sortable: true,
      render: (val) => <span className="text-emerald-400 font-bold">{val}</span>,
    },
    {
      key: 'rowsRejected',
      label: 'Rejected',
      sortable: true,
      render: (val) => (
        <span className={val > 0 ? 'text-rose-400 font-bold' : 'text-neutral-500'}>
          {val}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono uppercase ${
          val === 'completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
          val === 'staged' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
          val === 'failed' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
          'bg-neutral-800 text-neutral-400'
        }`}>
          {val}
        </span>
      ),
    },
    {
      key: 'startedAt',
      label: 'Timestamp',
      sortable: true,
      render: (val) => <span className="text-neutral-400 text-[10px]">{val ? new Date(val).toLocaleString() : 'N/A'}</span>,
    },
  ]

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            ETL & Ingestion Control Console
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            End-to-end extraction from operational database and structured external CSV ingestion.
          </p>
        </div>

      </div>

      {/* CSV UPLOAD & COLUMN MAPPING CARD */}
      <div className="rounded-sm border border-neutral-800 bg-[#121214] p-5 space-y-4">
        <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider border-b border-neutral-800 pb-2">
          Upload External CSV Dataset
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label className="flex flex-1 flex-col items-center justify-center border-2 border-dashed border-neutral-800 hover:border-neutral-600 rounded-sm p-6 cursor-pointer bg-[#0c0c0e] w-full transition-colors">
            <svg className="w-8 h-8 text-neutral-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-xs font-mono text-neutral-300">
              {selectedFile ? selectedFile.name : 'Select or drag CSV dataset (placements, salaries, skills, alumni)'}
            </span>
            <span className="text-[10px] font-mono text-neutral-500 mt-1">
              Supports CSV format &bull; Multi-schema auto-detection &bull; Max 10MB
            </span>
            <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
          </label>

          {isUploading ? (
            <div className="w-full sm:w-64 flex flex-col items-center justify-center p-4 bg-neutral-900 border border-neutral-800 rounded font-mono text-xs text-neutral-400 gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>VALIDATING ON SERVER...</span>
            </div>
          ) : stagedResult ? (
            <div className="w-full sm:w-80 space-y-3 font-mono text-xs">
              <div className="rounded bg-neutral-900 border border-neutral-800 p-3 space-y-1">
                <div className="text-neutral-400">File: <span className="text-white font-bold">{stagedResult.fileName}</span></div>
                <div className="text-neutral-400">Schema: <span className="text-sky-400 font-bold uppercase">{stagedResult.datasetType}</span></div>
                <div className="text-neutral-400">Valid Rows: <span className="text-emerald-400 font-bold">{stagedResult.rowsValid} / {stagedResult.rowsTotal}</span></div>
                {stagedResult.rowsInvalid > 0 && (
                  <div className="text-neutral-400">Rejected Rows: <span className="text-rose-400 font-bold">{stagedResult.rowsInvalid}</span></div>
                )}
              </div>

              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={isConfirming || stagedResult.rowsValid === 0}
                className="w-full rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isConfirming ? 'Importing into DWH...' : `Confirm & Ingest ${stagedResult.rowsValid} Rows`}
              </button>
            </div>
          ) : null}
        </div>

        {uploadError ? (
          <div className="rounded bg-rose-950/40 border border-rose-800 p-3 text-xs font-mono text-rose-300">
            {uploadError}
          </div>
        ) : null}

        {confirmSuccess ? (
          <div className="rounded bg-emerald-950/40 border border-emerald-800 p-3 text-xs font-mono text-emerald-300">
            {confirmSuccess}
          </div>
        ) : null}

        {/* PARSED DATA PREVIEW */}
        {stagedResult?.preview?.length > 0 ? (
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Server-Validated Preview (First {stagedResult.preview.length} Rows):</span>
              <span className="text-emerald-400">Provenance: dwh.* (record_source = 'csv_import')</span>
            </div>
            <div className="overflow-x-auto border border-neutral-800 rounded bg-[#09090b]">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-neutral-900 text-neutral-400 border-b border-neutral-800">
                  <tr>
                    {Object.keys(stagedResult.preview[0] || {}).map((h) => (
                      <th key={h} className="px-3 py-2 font-semibold uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                  {stagedResult.preview.map((row, idx) => (
                    <tr key={idx}>
                      {Object.keys(stagedResult.preview[0] || {}).map((h) => (
                        <td key={h} className="px-3 py-1.5">{String(row[h])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {/* VALIDATION REJECTION SAMPLES */}
        {stagedResult?.sampleErrors?.length > 0 ? (
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <span className="text-xs font-mono text-rose-400 block">
              Rejected Rows Log ({stagedResult.rowsInvalid} rows failed validation):
            </span>
            <div className="space-y-1 font-mono text-[11px]">
              {stagedResult.sampleErrors.map((err, idx) => (
                <div key={idx} className="rounded bg-rose-950/20 border border-rose-900/60 p-2 text-rose-300">
                  <span className="font-bold">Row {err.rowNumber}:</span> {err.validationError}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* INGESTION AUDIT LEDGER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
            Ingestion Batch Audit Ledger (dwh.etl_batches)
          </h2>
          <span className="text-[11px] font-mono text-neutral-500">
            {historyBatches.length} Execution Runs Recorded
          </span>
        </div>
        {historyLoading ? (
          <div className="p-8 text-center text-xs font-mono text-neutral-500">
            LOADING AUDIT LEDGER...
          </div>
        ) : (
          <AnalyticsTable columns={historyColumns} data={historyBatches} />
        )}
      </div>
    </div>
  )
}
