import { useState, useEffect, useMemo, useCallback } from 'react'
import { AnalyticsTable } from '../../components/analytics/AnalyticsTable.jsx'
import {
  fetchDataMiningSummary,
  fetchClustering,
  fetchClusteringEvaluation,
  fetchAssociationRules,
  fetchClassificationMetadata,
  trainClassificationModel,
  predictCareerOutcome,
} from '../../services/datamining.service.js'

const CLUSTER_COLORS = ['#38bdf8', '#34d399', '#f43f5e', '#fbbf24', '#a855f7', '#ec4899', '#14b8a6', '#f97316']

export default function AnalyticsMining() {
  const [activeTab, setActiveTab] = useState('clustering') // 'clustering' | 'apriori' | 'classification'
  const [sourceFilter, setSourceFilter] = useState('indian_academic_benchmark')

  // Overview summary
  const [summaryData, setSummaryData] = useState(null)
  const [_summaryLoading, setSummaryLoading] = useState(false)

  // 1. K-Means State
  const [kParam, setKParam] = useState(4)
  const [randomSeed, setRandomSeed] = useState(2026)
  const [clusteringData, setClusteringData] = useState(null)
  const [clusteringLoading, setClusteringLoading] = useState(false)
  const [clusteringError, setClusteringError] = useState(null)
  const [showElbow, setShowElbow] = useState(false)
  const [evaluationData, setEvaluationData] = useState(null)
  const [evalLoading, setEvalLoading] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState(null)

  // 2. Apriori State
  const [aprioriMode, setAprioriMode] = useState('alumni_skills')
  const [minSupport, setMinSupport] = useState(5) // percent
  const [minConfidence, setMinConfidence] = useState(50) // percent
  const [minLift, setMinLift] = useState(1.1)
  const [maxItemsetLength, _setMaxItemsetLength] = useState(3)
  const [ruleSearch, setRuleSearch] = useState('')
  const [aprioriData, setAprioriData] = useState(null)
  const [aprioriLoading, setAprioriLoading] = useState(false)
  const [aprioriError, setAprioriError] = useState(null)

  // 3. Classification State
  const [classifMeta, setClassifMeta] = useState(null)
  const [testRatio, setTestRatio] = useState(20) // percent
  const [classifResult, setClassifResult] = useState(null)
  const [trainingLoading, setTrainingLoading] = useState(false)
  const [trainError, setTrainError] = useState(null)

  // Prediction Form State
  const [candSkillsInput, setCandSkillsInput] = useState('Python, SQL, Machine Learning')
  const [candExp, setCandExp] = useState(2.0)
  const [predictionData, setPredictionData] = useState(null)
  const [predictLoading, setPredictLoading] = useState(false)
  const [predictError, setPredictError] = useState(null)

  // Load summary on source change
  useEffect(() => {
    async function loadSummary() {
      setSummaryLoading(true)
      try {
        const data = await fetchDataMiningSummary({ recordSource: sourceFilter })
        setSummaryData(data)
      } catch (err) {
        console.error('Failed to load mining summary', err)
      } finally {
        setSummaryLoading(false)
      }
    }
    loadSummary()
  }, [sourceFilter])

  // Load clustering
  const loadClustering = useCallback(async () => {
    setClusteringLoading(true)
    setClusteringError(null)
    try {
      const data = await fetchClustering({
        k: kParam,
        randomSeed,
        recordSource: sourceFilter,
        topSkillsCount: 35,
        computeProjection: true,
      })
      setClusteringData(data)
    } catch (err) {
      setClusteringError(err?.response?.data?.message || err?.message || 'Failed to execute K-Means clustering')
    } finally {
      setClusteringLoading(false)
    }
  }, [kParam, randomSeed, sourceFilter])

  // Load candidate k evaluation
  const loadEvaluation = useCallback(async () => {
    setEvalLoading(true)
    try {
      const data = await fetchClusteringEvaluation({
        minK: 2,
        maxK: 7,
        recordSource: sourceFilter,
        randomSeed,
      })
      setEvaluationData(data)
    } catch (err) {
      console.error('Failed to evaluate candidate k', err)
    } finally {
      setEvalLoading(false)
    }
  }, [sourceFilter, randomSeed])

  // Load Apriori
  const loadApriori = useCallback(async (overrideMode = null, overrideSource = null) => {
    const targetMode = overrideMode || aprioriMode
    const targetSource = overrideSource || sourceFilter
    setAprioriLoading(true)
    setAprioriError(null)
    try {
      const data = await fetchAssociationRules({
        mode: targetMode,
        minSupport: minSupport / 100,
        minConfidence: minConfidence / 100,
        minLift,
        maxItemsetLength,
        limit: 100,
        recordSource: targetSource,
      })
      setAprioriData(data)
    } catch (err) {
      setAprioriError(err?.response?.data?.message || err?.message || 'Failed to mine association rules')
    } finally {
      setAprioriLoading(false)
    }
  }, [aprioriMode, minSupport, minConfidence, minLift, maxItemsetLength, sourceFilter])

  // Load classification metadata
  const loadClassifMetadata = useCallback(async () => {
    try {
      const data = await fetchClassificationMetadata({ recordSource: sourceFilter })
      setClassifMeta(data)
      if (data?.activeModelMetrics) {
        setClassifResult({ evaluation: data.activeModelMetrics })
      }
    } catch (err) {
      console.error('Failed to load classification metadata', err)
    }
  }, [sourceFilter])

  // Initial trigger for active tab
  useEffect(() => {
    if (activeTab === 'clustering' && !clusteringData) {
      loadClustering()
    } else if (activeTab === 'apriori' && !aprioriData) {
      loadApriori()
    } else if (activeTab === 'classification' && !classifMeta) {
      loadClassifMetadata()
    }
  }, [activeTab, clusteringData, aprioriData, classifMeta, loadClustering, loadApriori, loadClassifMetadata])

  // Handle train classification
  async function handleTrainClassifier() {
    setTrainingLoading(true)
    setTrainError(null)
    try {
      const res = await trainClassificationModel({
        recordSource: sourceFilter,
        testRatio: testRatio / 100,
        randomSeed,
        topSkillsCount: 30,
      })
      setClassifResult(res)
      loadClassifMetadata()
    } catch (err) {
      setTrainError(err?.response?.data?.message || err?.message || 'Classification training failed')
    } finally {
      setTrainingLoading(false)
    }
  }

  // Handle predict classification
  async function handleRunPrediction() {
    setPredictLoading(true)
    setPredictError(null)
    try {
      const skillsArray = candSkillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const res = await predictCareerOutcome({
        skills: skillsArray,
        experience_years: Number(candExp),
      })
      setPredictionData(res)
    } catch (err) {
      setPredictError(err?.response?.data?.message || err?.message || 'Prediction execution failed')
    } finally {
      setPredictLoading(false)
    }
  }

  // Apriori filtered rules
  const filteredAprioriRules = useMemo(() => {
    const rules = aprioriData?.rules || []
    if (!ruleSearch) return rules
    const q = ruleSearch.toLowerCase()
    return rules.filter(
      (r) =>
        r.antecedent.some((s) => s.toLowerCase().includes(q)) ||
        r.consequent.some((s) => s.toLowerCase().includes(q))
    )
  }, [aprioriData?.rules, ruleSearch])

  // Apriori Table Columns
  const ruleColumns = [
    {
      key: 'antecedent',
      label: 'Antecedent (IF)',
      sortable: false,
      render: (val) => (
        <div className="flex flex-wrap gap-1">
          {val.map((item, idx) => (
            <span key={idx} className="rounded bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 text-[11px] text-neutral-200">
              {item}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'arrow',
      label: 'Implies',
      sortable: false,
      render: () => <span className="text-neutral-500 font-bold">&rArr;</span>,
    },
    {
      key: 'consequent',
      label: 'Consequent (THEN)',
      sortable: false,
      render: (val) => (
        <div className="flex flex-wrap gap-1">
          {val.map((item, idx) => (
            <span
              key={idx}
              className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${
                item.startsWith('Target:')
                  ? 'bg-purple-950/80 border border-purple-700 text-purple-300'
                  : 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-400'
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'support',
      label: 'Support',
      sortable: true,
      render: (val, row) => (
        <span className="font-mono text-neutral-300" title={`${row.supportCount} transactions`}>
          {(val * 100).toFixed(1)}% <span className="text-[10px] text-neutral-500">({row.supportCount})</span>
        </span>
      ),
    },
    {
      key: 'confidence',
      label: 'Confidence',
      sortable: true,
      render: (val) => <span className="font-mono text-sky-400 font-bold">{(val * 100).toFixed(1)}%</span>,
    },
    {
      key: 'lift',
      label: 'Lift',
      sortable: true,
      render: (val) => (
        <span className={`font-mono font-bold ${val >= 1.5 ? 'text-emerald-400' : val >= 1.0 ? 'text-sky-300' : 'text-neutral-400'}`}>
          {val.toFixed(2)}x
        </span>
      ),
    },
  ]

  // Render 2D PCA Scatter plot
  const projections = useMemo(() => clusteringData?.projections || [], [clusteringData?.projections])
  const pcaBounds = useMemo(() => {
    if (projections.length === 0) return { minX: -2, maxX: 2, minY: -2, maxY: 2 }
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
    for (const p of projections) {
      if (p.x < minX) minX = p.x
      if (p.x > maxX) maxX = p.x
      if (p.y < minY) minY = p.y
      if (p.y > maxY) maxY = p.y
    }
    const padX = (maxX - minX) * 0.1 || 0.5
    const padY = (maxY - minY) * 0.1 || 0.5
    return { minX: minX - padX, maxX: maxX + padX, minY: minY - padY, maxY: maxY + padY }
  }, [projections])

  return (
    <div className="flex flex-col flex-1">
      {/* MINING NAVIGATION TABS & PROVENANCE BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 bg-[#0f0f11] px-6 py-2.5 font-mono text-xs gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('clustering')}
            className={`rounded px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'clustering' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            1. K-Means Career Clustering
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('apriori')}
            className={`rounded px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'apriori' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            2. Apriori Association Rules
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('classification')}
            className={`rounded px-3 py-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'classification' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            3. Career Outcome Classifier
          </button>
        </div>

        {/* PROVENANCE SELECTOR */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 uppercase text-[10px]">Data Source:</span>
          <select
            value={sourceFilter}
            onChange={(e) => {
              const newSource = e.target.value
              setSourceFilter(newSource)
              setClusteringData(null)
              setAprioriData(null)
              setClassifMeta(null)
              if (activeTab === 'apriori') {
                loadApriori(null, newSource)
              }
            }}
            className="rounded bg-neutral-900 border border-neutral-700 px-2 py-1 text-white text-[11px] focus:outline-none"
          >
            <option value="indian_academic_benchmark">Academic Benchmark (~50k)</option>
            <option value="operational">Ingested Operational Snapshot (Historical)</option>
            <option value="ALL">ALL (All Ingested Warehouse Data)</option>
          </select>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* EDUCATIONAL DISCLAIMER & PROVENANCE METADATA BANNER */}
        <div className="rounded-sm border border-neutral-800 bg-[#121214] p-4 text-xs font-mono flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sky-400 font-bold uppercase text-[10px] tracking-wider">
                DWM Mining Engine v1.0 &bull; Verified Warehouse Execution
              </span>
              <span className="rounded bg-neutral-800 px-1.5 py-0.2 text-[9px] text-neutral-300">
                {sourceFilter}
              </span>
            </div>
            <p className="text-neutral-400 text-[11px]">
              {summaryData?.educationalNotice ||
                'All clustering centroids, frequent itemsets, and supervised predictions execute genuine mathematical algorithms against the local PostgreSQL warehouse.'}
            </p>
          </div>
          {summaryData?.counts ? (
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-300 shrink-0 border-t md:border-t-0 md:border-l border-neutral-800 pt-2 md:pt-0 md:pl-4">
              <div>Alumni: <strong className="text-white">{summaryData.counts.alumniProfiles}</strong></div>
              <div>Jobs: <strong className="text-white">{summaryData.counts.jobPostings}</strong></div>
              <div>Outcomes: <strong className="text-white">{summaryData.counts.careerOutcomes}</strong></div>
              <div>Catalog Skills: <strong className="text-white">{summaryData.counts.catalogSkills}</strong></div>
            </div>
          ) : null}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: K-MEANS CAREER CLUSTERING                              */}
        {/* ============================================================== */}
        {activeTab === 'clustering' ? (
          <div className="space-y-6">
            <div className="border-b border-neutral-800 pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                  Alumni Career Trajectory Clustering (K-Means)
                </h1>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Partitioning verified alumni profiles across skill vectors & normalized experience via K-Means++ initialization.
                </p>
              </div>

              {/* CLUSTERING PARAMETERS & EXECUTION */}
              <div className="flex flex-wrap items-center gap-3 bg-neutral-900 border border-neutral-800 p-2.5 rounded font-mono text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400">Clusters (k):</span>
                  <select
                    value={kParam}
                    onChange={(e) => setKParam(Number(e.target.value))}
                    className="rounded bg-black border border-neutral-700 px-2 py-1 text-white font-bold"
                  >
                    {[2, 3, 4, 5, 6, 7, 8].map((k) => (
                      <option key={k} value={k}>k = {k}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400">Seed:</span>
                  <input
                    type="number"
                    value={randomSeed}
                    onChange={(e) => setRandomSeed(Number(e.target.value))}
                    className="w-16 rounded bg-black border border-neutral-700 px-1.5 py-1 text-white font-mono text-xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={loadClustering}
                  disabled={clusteringLoading}
                  className="rounded bg-white text-black font-bold px-3 py-1 hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {clusteringLoading ? 'Fitting...' : 'Run K-Means'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowElbow(!showElbow)
                    if (!evaluationData && !showElbow) loadEvaluation()
                  }}
                  className="rounded border border-neutral-700 bg-neutral-800 text-neutral-200 px-2.5 py-1 hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  {showElbow ? 'Hide Evaluation' : 'Elbow & Silhouette'}
                </button>
              </div>
            </div>

            {clusteringError ? (
              <div className="rounded border border-rose-800 bg-rose-950/40 p-4 text-xs font-mono text-rose-300">
                <strong>Clustering Error:</strong> {clusteringError}
              </div>
            ) : null}

            {/* METRICS & CONVERGENCE BAR */}
            {clusteringData?.metadata ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="rounded border border-neutral-800 bg-[#121214] p-3">
                  <span className="text-neutral-500 text-[10px] uppercase">Records Clustered</span>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {clusteringData.metadata?.recordsUsed || 0} Alumni
                  </div>
                </div>
                <div className="rounded border border-neutral-800 bg-[#121214] p-3">
                  <span className="text-neutral-500 text-[10px] uppercase">WCSS (Inertia)</span>
                  <div className="text-lg font-bold text-sky-400 mt-0.5">
                    {clusteringData.metrics?.inertia || 0}
                  </div>
                </div>
                <div className="rounded border border-neutral-800 bg-[#121214] p-3">
                  <span className="text-neutral-500 text-[10px] uppercase">Silhouette Score</span>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">
                    {clusteringData.metrics?.silhouetteScore !== undefined && clusteringData.metrics?.silhouetteScore !== null
                      ? clusteringData.metrics.silhouetteScore
                      : 'N/A'}
                  </div>
                </div>
                <div className="rounded border border-neutral-800 bg-[#121214] p-3">
                  <span className="text-neutral-500 text-[10px] uppercase">Convergence</span>
                  <div className="text-lg font-bold text-neutral-200 mt-0.5">
                    {clusteringData.parameters?.maxIterations || 0} iter ({clusteringData.metrics?.executionTimeMs || 0}ms)
                  </div>
                </div>
              </div>
            ) : null}

            {/* MULTI-K ELBOW & SILHOUETTE EVALUATION CARD */}
            {showElbow ? (
              <div className="rounded-sm border border-neutral-800 bg-[#121214] p-5 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Cluster Quality Evaluation (Elbow Heuristic & Silhouette Score)
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Evaluating candidate k &isin; [2, 7] across Within-Cluster Sum of Squares (WCSS) and Silhouette separation.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={loadEvaluation}
                    disabled={evalLoading}
                    className="text-[10px] rounded bg-neutral-800 px-2 py-1 text-neutral-300 hover:text-white"
                  >
                    {evalLoading ? 'Computing...' : 'Recalculate'}
                  </button>
                </div>

                {evaluationData?.candidateKList ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-neutral-800 text-neutral-500 uppercase text-[10px]">
                        <tr>
                          <th className="py-2">Candidate (k)</th>
                          <th className="py-2">WCSS / Inertia</th>
                          <th className="py-2">Marginal Drop (&Delta;WCSS)</th>
                          <th className="py-2">Silhouette Score</th>
                          <th className="py-2">Iterations</th>
                          <th className="py-2">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                        {evaluationData.candidateKList.map((row, idx, arr) => {
                          const prevInertia = idx > 0 ? arr[idx - 1].inertia : null
                          const drop = prevInertia ? (prevInertia - row.inertia).toFixed(1) : '-'
                          const isSelected = row.k === kParam

                          return (
                            <tr key={row.k} className={isSelected ? 'bg-sky-950/40 text-white font-bold' : ''}>
                              <td className="py-2.5">k = {row.k}</td>
                              <td className="py-2.5 font-mono text-sky-400">{row.inertia}</td>
                              <td className="py-2.5 font-mono text-neutral-400">{drop}</td>
                              <td className="py-2.5 font-mono text-emerald-400">{row.silhouetteScore}</td>
                              <td className="py-2.5">{row.iterations}</td>
                              <td className="py-2.5">
                                {!isSelected ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setKParam(row.k)
                                      setTimeout(loadClustering, 50)
                                    }}
                                    className="rounded border border-neutral-700 px-2 py-0.5 text-[10px] text-neutral-300 hover:text-white"
                                  >
                                    Select k={row.k}
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-sky-400 font-bold">Active Model</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-neutral-500">Evaluating candidate cluster range...</div>
                )}
              </div>
            ) : null}

            {/* 2D PCA PROJECTION SCATTER PLOT */}
            <div className="rounded-sm border border-neutral-800 bg-[#121214] p-5 space-y-3 font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-2 gap-2">
                <div>
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                    2D Principal Component Projection (PCA Dim 1 vs Dim 2)
                  </h2>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    Unsupervised projection of alumni skill vectors and experience using power-iteration eigenvector extraction.
                  </p>
                </div>
                {hoveredPoint ? (
                  <div className="rounded bg-neutral-900 border border-neutral-700 px-2 py-1 text-[11px] text-neutral-200">
                    Alumnus: <strong className="text-white">{hoveredPoint.alumniId}</strong> | Cluster {hoveredPoint.clusterId + 1} | Dept: {hoveredPoint.department} | Exp: {hoveredPoint.experienceYears}y
                  </div>
                ) : (
                  <span className="text-[10px] text-neutral-500">Hover over points to inspect profiles</span>
                )}
              </div>

              {projections.length > 0 ? (
                <div className="relative w-full h-72 bg-[#09090b] border border-neutral-800/80 rounded overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="200" x2="1000" y2="200" stroke="#262626" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="500" y1="0" x2="500" y2="400" stroke="#262626" strokeWidth="1" strokeDasharray="4 4" />

                    {/* Data Points */}
                    {projections.map((pt, idx) => {
                      const cx = ((pt.x - pcaBounds.minX) / (pcaBounds.maxX - pcaBounds.minX)) * 960 + 20
                      const cy = 380 - ((pt.y - pcaBounds.minY) / (pcaBounds.maxY - pcaBounds.minY)) * 360
                      const color = CLUSTER_COLORS[pt.clusterId % CLUSTER_COLORS.length]
                      const isHovered = hoveredPoint?.alumniId === pt.alumniId

                      return (
                        <circle
                          key={idx}
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 6 : 3.5}
                          fill={color}
                          fillOpacity={isHovered ? 1 : 0.75}
                          stroke={isHovered ? '#ffffff' : color}
                          strokeWidth={isHovered ? 2 : 0.5}
                          className="cursor-pointer transition-all duration-100"
                          onMouseEnter={() => setHoveredPoint(pt)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      )
                    })}
                  </svg>

                  {/* Axis Legend */}
                  <div className="absolute bottom-1.5 left-2 text-[9px] text-neutral-500">
                    PC1 (Dominant Skill Variance) &bull; PC2 (Secondary Skill & Seniority Variance)
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-neutral-500">
                  {clusteringLoading ? 'Computing 2D PCA Projections...' : 'No projection coordinates available'}
                </div>
              )}
            </div>

            {/* CLUSTER PERSONA CARDS */}
            {clusteringData?.clusters ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {clusteringData.clusters.map((cluster) => {
                  const color = CLUSTER_COLORS[cluster.clusterId % CLUSTER_COLORS.length]

                  return (
                    <div
                      key={cluster.clusterId}
                      className="rounded-sm border border-neutral-800 bg-[#121214] p-4 font-mono space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                            <span className="font-bold text-xs text-white">Cluster {cluster.clusterId + 1}</span>
                          </div>
                          <span className="rounded bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 text-[10px] text-sky-400 font-bold">
                            {cluster.size} ({cluster.percentage}%)
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-neutral-200">
                          {cluster.profileLabel}
                        </div>

                        <div className="space-y-1 text-xs text-neutral-400">
                          <div className="flex justify-between">
                            <span>Avg Experience:</span>
                            <strong className="text-neutral-200">{cluster.averageExperienceYears} yrs</strong>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-neutral-800 text-[10px] text-neutral-500">
                          <span className="block text-neutral-400 font-bold mb-1">Dominant Skills:</span>
                          <div className="flex flex-wrap gap-1">
                            {cluster.topSkills.map((sk, sidx) => (
                              <span
                                key={sidx}
                                className="rounded bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 text-neutral-300"
                                title={`${sk.count} alumni (${sk.prevalencePct}%)`}
                              >
                                {sk.name} <span className="text-[9px] text-neutral-500">{sk.prevalencePct}%</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-800/60 text-[9px] text-neutral-500 truncate">
                        Sample IDs: {cluster.sampleAlumniIds?.join(', ') || 'N/A'}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ============================================================== */}
        {/* TAB 2: APRIORI ASSOCIATION MINING                             */}
        {/* ============================================================== */}
        {activeTab === 'apriori' ? (
          <div className="space-y-6">
            <div className="border-b border-neutral-800 pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                  Apriori Association Rule Mining
                </h1>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Discovering frequent itemsets and association rules among technical skills and career milestones.
                </p>
              </div>

              {/* APRIORI CONTROLS */}
              <div className="flex flex-wrap items-center gap-3 bg-neutral-900 border border-neutral-800 p-2.5 rounded font-mono text-xs">
                {/* Transaction Mode */}
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500 text-[10px]">Mode:</span>
                  <select
                    value={aprioriMode}
                    onChange={(e) => {
                      const newMode = e.target.value
                      setAprioriMode(newMode)
                      setAprioriData(null)
                      loadApriori(newMode)
                    }}
                    className="rounded bg-black border border-neutral-700 px-2 py-1 text-white text-[11px]"
                  >
                    <option value="alumni_skills">Mode A: Alumni Skills</option>
                    <option value="job_skills">Mode B: Job Requirements</option>
                    <option value="career_outcomes">Mode C: Career Outcomes</option>
                  </select>
                </div>

                {/* Min Support */}
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500 text-[10px]">Min Sup:</span>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={minSupport}
                    onChange={(e) => setMinSupport(Number(e.target.value))}
                    className="w-16 accent-sky-400 cursor-pointer"
                  />
                  <span className="text-neutral-200 font-bold w-7 text-right">{minSupport}%</span>
                </div>

                {/* Min Confidence */}
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500 text-[10px]">Min Conf:</span>
                  <input
                    type="range"
                    min="20"
                    max="95"
                    value={minConfidence}
                    onChange={(e) => setMinConfidence(Number(e.target.value))}
                    className="w-16 accent-emerald-400 cursor-pointer"
                  />
                  <span className="text-neutral-200 font-bold w-7 text-right">{minConfidence}%</span>
                </div>

                {/* Min Lift */}
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500 text-[10px]">Min Lift:</span>
                  <select
                    value={minLift}
                    onChange={(e) => setMinLift(Number(e.target.value))}
                    className="rounded bg-black border border-neutral-700 px-1.5 py-1 text-white text-[11px]"
                  >
                    <option value="0.8">0.8x</option>
                    <option value="1.0">1.0x (Indep)</option>
                    <option value="1.1">1.1x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2.0">2.0x</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => loadApriori()}
                  disabled={aprioriLoading}
                  className="rounded bg-white text-black font-bold px-3 py-1 hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {aprioriLoading ? 'Mining...' : 'Mine Rules'}
                </button>
              </div>
            </div>

            {aprioriError ? (
              <div className="rounded border border-rose-800 bg-rose-950/40 p-4 text-xs font-mono text-rose-300">
                <strong>Apriori Error:</strong> {aprioriError}
              </div>
            ) : null}

            {/* APRIORI INVENTORY SUMMARY */}
            {aprioriData ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded border border-neutral-800 bg-[#121214] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 text-[10px] uppercase">Transactions</span>
                      <span className="text-[10px] text-sky-400 font-bold">
                        {aprioriData.mode === 'alumni_skills' ? 'Mode A: Alumni' : aprioriData.mode === 'job_skills' ? 'Mode B: Jobs' : 'Mode C: Outcomes'}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-white mt-0.5">{aprioriData.transactionsUsed} Baskets</div>
                  </div>
                  <div className="rounded border border-neutral-800 bg-[#121214] p-3">
                    <span className="text-neutral-500 text-[10px] uppercase">Frequent Itemsets</span>
                    <div className="text-lg font-bold text-sky-400 mt-0.5">{aprioriData.frequentItemsetsCount} Itemsets</div>
                    {aprioriData.diagnostics?.itemsetsBySize ? (
                      <div className="text-[10px] text-neutral-400 mt-1">
                        {Object.entries(aprioriData.diagnostics.itemsetsBySize)
                          .map(([sz, cnt]) => `${sz}-item: ${cnt}`)
                          .join(' | ')}
                      </div>
                    ) : null}
                  </div>
                  <div className="rounded border border-neutral-800 bg-[#121214] p-3">
                    <span className="text-neutral-500 text-[10px] uppercase">Rules Qualified</span>
                    <div className={`text-lg font-bold mt-0.5 ${aprioriData.rulesCount > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {aprioriData.rulesCount} Rules
                    </div>
                    {aprioriData.diagnostics ? (
                      <div className="text-[10px] text-neutral-400 mt-1">
                        {aprioriData.diagnostics.candidateRulesGenerated} evaluated ({aprioriData.diagnostics.rejectedByConfidence || 0} low conf, {aprioriData.diagnostics.rejectedByLift || 0} low lift)
                      </div>
                    ) : null}
                  </div>
                  <div className="rounded border border-neutral-800 bg-[#121214] p-3">
                    <span className="text-neutral-500 text-[10px] uppercase">Execution Speed</span>
                    <div className="text-lg font-bold text-neutral-200 mt-0.5">{aprioriData.metadata?.executionTimeMs || 0} ms</div>
                    <div className="text-[10px] text-neutral-400 mt-1 truncate">
                      Source: {aprioriData.metadata?.recordSource || sourceFilter}
                    </div>
                  </div>
                </div>

                {aprioriData.diagnostics?.note ? (
                  <div className="rounded border border-amber-800/60 bg-amber-950/20 p-3 text-[11px] text-amber-300">
                    <strong>Diagnostic Finding:</strong> {aprioriData.diagnostics.note}
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* SEARCH & RULES TABLE */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                    Statistically Significant Association Rules (Lift &ge; {minLift}x, Conf &ge; {minConfidence}%)
                  </h2>
                  <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300 font-mono">
                    {filteredAprioriRules.length} Shown
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Filter rules by skill..."
                  value={ruleSearch}
                  onChange={(e) => setRuleSearch(e.target.value)}
                  className="rounded bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-xs font-mono text-neutral-200 placeholder:text-neutral-600 focus:outline-none"
                />
              </div>

              <AnalyticsTable columns={ruleColumns} data={filteredAprioriRules} pageSize={12} />
            </div>

            {/* METRICS INTERPRETATION CALLOUT */}
            <div className="rounded border border-neutral-800 bg-[#121214] p-4 text-xs font-mono space-y-1.5">
              <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-wider block">
                Academic Association Rule Metrics Guide:
              </span>
              <p className="text-neutral-300">
                &bull; <strong>Support (S):</strong> Fraction of all transactions containing both Antecedent and Consequent.<br />
                &bull; <strong>Confidence (C):</strong> Conditional probability P(Consequent | Antecedent). Measures rule certainty.<br />
                &bull; <strong>Lift (L):</strong> Ratio of observed joint support to expected support under statistical independence. A Lift &gt; 1.0 indicates a positive associative relationship beyond random co-occurrence.
              </p>
            </div>
          </div>
        ) : null}

        {/* ============================================================== */}
        {/* TAB 3: SUPERVISED CAREER OUTCOME CLASSIFICATION               */}
        {/* ============================================================== */}
        {activeTab === 'classification' ? (
          <div className="space-y-6">
            <div className="border-b border-neutral-800 pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                  Supervised Classification: Career Outcome Prediction
                </h1>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Predicting 6-month post-graduation placement outcomes using Regularized Logistic Regression with leakage prevention.
                </p>
              </div>

              {/* CLASSIFICATION TRAINING CONTROLS */}
              <div className="flex flex-wrap items-center gap-3 bg-neutral-900 border border-neutral-800 p-2.5 rounded font-mono text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400">Test Split:</span>
                  <select
                    value={testRatio}
                    onChange={(e) => setTestRatio(Number(e.target.value))}
                    className="rounded bg-black border border-neutral-700 px-2 py-1 text-white font-bold"
                  >
                    <option value="15">15% Test</option>
                    <option value="20">20% Test (80/20)</option>
                    <option value="25">25% Test (75/25)</option>
                    <option value="30">30% Test (70/30)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400">Seed:</span>
                  <input
                    type="number"
                    value={randomSeed}
                    onChange={(e) => setRandomSeed(Number(e.target.value))}
                    className="w-16 rounded bg-black border border-neutral-700 px-1.5 py-1 text-white font-mono text-xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleTrainClassifier}
                  disabled={trainingLoading}
                  className="rounded bg-white text-black font-bold px-3 py-1 hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {trainingLoading ? 'Training Model...' : 'Train / Retrain Classifier'}
                </button>
              </div>
            </div>

            {/* EDUCATIONAL DISCLAIMER ALERT */}
            <div className="rounded border border-amber-900/60 bg-amber-950/30 p-3.5 text-xs font-mono text-amber-300">
              <strong>Academic Notice & Target Provenance:</strong> The target <code>dwh.fact_career_outcomes.employed_within_6_months</code> is generated from curriculum benchmark formulas for teaching machine learning evaluation (Precision, Recall, ROC-AUC). Predictions must never be used for actual recruitment screening.
            </div>

            {trainError ? (
              <div className="rounded border border-rose-800 bg-rose-950/40 p-4 text-xs font-mono text-rose-300">
                <strong>Training Error:</strong> {trainError}
              </div>
            ) : null}

            {/* EVALUATION METRIC CARDS (HELD-OUT TEST SET) */}
            {classifResult?.evaluation ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
                  <div className="rounded border border-neutral-800 bg-[#121214] p-3">
                    <span className="text-neutral-500 text-[10px] uppercase">Test Accuracy</span>
                    <div className="text-xl font-bold text-white mt-0.5">
                      {(classifResult.evaluation.accuracy * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="rounded border border-neutral-800 bg-[#121214] p-3">
                    <span className="text-neutral-500 text-[10px] uppercase">Precision (Class 1)</span>
                    <div className="text-xl font-bold text-sky-400 mt-0.5">
                      {(classifResult.evaluation.precision * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="rounded border border-neutral-800 bg-[#121214] p-3">
                    <span className="text-neutral-500 text-[10px] uppercase">Recall (Sensitivity)</span>
                    <div className="text-xl font-bold text-emerald-400 mt-0.5">
                      {(classifResult.evaluation.recall * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="rounded border border-neutral-800 bg-[#121214] p-3">
                    <span className="text-neutral-500 text-[10px] uppercase">F1-Score</span>
                    <div className="text-xl font-bold text-purple-400 mt-0.5">
                      {(classifResult.evaluation.f1Score * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="rounded border border-neutral-800 bg-[#121214] p-3">
                    <span className="text-neutral-500 text-[10px] uppercase">ROC-AUC</span>
                    <div className="text-xl font-bold text-amber-400 mt-0.5">
                      {classifResult.evaluation.rocAuc !== null ? classifResult.evaluation.rocAuc : 'N/A'}
                    </div>
                  </div>
                </div>

                {/* CONFUSION MATRIX & BASELINE COMPARISON */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {/* Confusion Matrix Card */}
                  <div className="rounded-sm border border-neutral-800 bg-[#121214] p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                      <span className="font-bold text-xs text-white uppercase tracking-wider">
                        Held-Out Confusion Matrix (2x2)
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {classifResult.evaluation.sampleCounts?.totalSamples} Test Samples
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-3 rounded bg-emerald-950/40 border border-emerald-800/80">
                        <span className="text-[10px] text-emerald-400 uppercase font-bold block">True Positive (TP)</span>
                        <span className="text-xl font-bold text-white mt-1 block">
                          {classifResult.evaluation.confusionMatrix.truePositive}
                        </span>
                        <span className="text-[10px] text-neutral-400">Predicted Placed / Actually Placed</span>
                      </div>
                      <div className="p-3 rounded bg-rose-950/40 border border-rose-800/80">
                        <span className="text-[10px] text-rose-400 uppercase font-bold block">False Positive (FP)</span>
                        <span className="text-xl font-bold text-white mt-1 block">
                          {classifResult.evaluation.confusionMatrix.falsePositive}
                        </span>
                        <span className="text-[10px] text-neutral-400">Predicted Placed / Actually Not Placed</span>
                      </div>
                      <div className="p-3 rounded bg-rose-950/40 border border-rose-800/80">
                        <span className="text-[10px] text-rose-400 uppercase font-bold block">False Negative (FN)</span>
                        <span className="text-xl font-bold text-white mt-1 block">
                          {classifResult.evaluation.confusionMatrix.falseNegative}
                        </span>
                        <span className="text-[10px] text-neutral-400">Predicted Unplaced / Actually Placed</span>
                      </div>
                      <div className="p-3 rounded bg-emerald-950/40 border border-emerald-800/80">
                        <span className="text-[10px] text-emerald-400 uppercase font-bold block">True Negative (TN)</span>
                        <span className="text-xl font-bold text-white mt-1 block">
                          {classifResult.evaluation.confusionMatrix.trueNegative}
                        </span>
                        <span className="text-[10px] text-neutral-400">Predicted Unplaced / Actually Not Placed</span>
                      </div>
                    </div>
                  </div>

                  {/* Baseline & Feature Weights */}
                  <div className="rounded-sm border border-neutral-800 bg-[#121214] p-4 space-y-3">
                    <div className="border-b border-neutral-800 pb-2">
                      <span className="font-bold text-xs text-white uppercase tracking-wider block">
                        Majority Class Baseline Comparison
                      </span>
                    </div>

                    <div className="space-y-2 text-neutral-300">
                      <div className="flex justify-between">
                        <span>Majority Baseline Accuracy:</span>
                        <strong className="text-neutral-200">
                          {(classifResult.evaluation.baselineComparison.baselineAccuracy * 100).toFixed(1)}%
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Trained Classifier Accuracy:</span>
                        <strong className="text-sky-400">
                          {(classifResult.evaluation.accuracy * 100).toFixed(1)}%
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Accuracy Delta (&Delta;):</span>
                        <strong className={classifResult.evaluation.baselineComparison.modelAccuracyDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {(classifResult.evaluation.baselineComparison.modelAccuracyDelta * 100).toFixed(1)}%
                        </strong>
                      </div>
                    </div>

                    {classifResult.featureImportance ? (
                      <div className="pt-2 border-t border-neutral-800 space-y-1">
                        <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                          Dominant Feature Weights (Coefficients):
                        </span>
                        <div className="grid grid-cols-2 gap-1 text-[10px]">
                          {classifResult.featureImportance.slice(0, 6).map((feat, fidx) => (
                            <div key={fidx} className="flex justify-between bg-neutral-900 px-2 py-0.5 rounded">
                              <span className="truncate">{feat.feature}</span>
                              <span className={feat.weight > 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                                {feat.weight > 0 ? `+${feat.weight}` : feat.weight}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            {/* LIVE INFERENCE PREDICTION PANEL */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
              {/* Prediction Input Form */}
              <div className="rounded-sm border border-neutral-800 bg-[#121214] p-5 space-y-4">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2">
                  Real-Time Placement Inference
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Technical Skills (Comma-Separated):</label>
                    <textarea
                      rows={3}
                      value={candSkillsInput}
                      onChange={(e) => setCandSkillsInput(e.target.value)}
                      placeholder="e.g. Python, SQL, Machine Learning, Docker"
                      className="w-full rounded bg-neutral-900 border border-neutral-800 p-2 text-white text-xs focus:outline-none"
                    />
                    <div className="flex flex-wrap gap-1 mt-1 text-[10px]">
                      {['Python', 'React.js', 'Node.js', 'SQL', 'AWS', 'Java', 'Docker'].map((sk) => (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => {
                            if (!candSkillsInput.includes(sk)) {
                              setCandSkillsInput(candSkillsInput ? `${candSkillsInput}, ${sk}` : sk)
                            }
                          }}
                          className="rounded bg-neutral-800 px-1.5 py-0.5 text-neutral-300 hover:text-white"
                        >
                          +{sk}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">
                      Experience at Observation: <strong className="text-white">{candExp} years</strong>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={candExp}
                      onChange={(e) => setCandExp(Number(e.target.value))}
                      className="w-full accent-sky-400 cursor-pointer"
                    />
                  </div>

                  {predictError ? (
                    <div className="p-2 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-[10px]">
                      {predictError}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleRunPrediction}
                    disabled={predictLoading}
                    className="w-full rounded bg-white text-black font-bold py-2 hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {predictLoading ? 'Evaluating Model...' : 'Predict 6-Month Placement'}
                  </button>
                </div>
              </div>

              {/* Prediction Result Display */}
              <div className="lg:col-span-2 rounded-sm border border-neutral-800 bg-[#121214] p-5 space-y-4">
                <div className="border-b border-neutral-800 pb-2">
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                    Model Inference Output
                  </h2>
                </div>

                {predictionData ? (
                  <div className="space-y-4 font-mono">
                    <div className="flex items-center gap-4 p-4 rounded bg-neutral-900 border border-neutral-800">
                      <div className={`text-4xl font-bold ${predictionData.prediction === 1 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {predictionData.prediction === 1 ? 'PLACED' : 'UNPLACED'}
                      </div>
                      <div className="space-y-0.5 text-xs text-neutral-400">
                        <div>Outcome: <strong className="text-white">{predictionData.predictedClass}</strong></div>
                        <div>Estimated Probability: <strong className="text-sky-400">{predictionData.probabilityPercentage}%</strong></div>
                        <div>Confidence Level: <span className="text-neutral-200">{predictionData.confidenceLevel}</span></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded border border-neutral-800 bg-neutral-900/60 p-3">
                        <span className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">Matched Model Features:</span>
                        <div className="flex flex-wrap gap-1">
                          {predictionData.inputFeatures.matchedSkills.map((s, idx) => (
                            <span key={idx} className="rounded bg-black border border-neutral-700 px-1.5 py-0.5 text-neutral-200 text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded border border-neutral-800 bg-neutral-900/60 p-3">
                        <span className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">Model Lineage:</span>
                        <p className="text-[11px] text-neutral-300">
                          Trained with <strong>{predictionData.modelContext.algorithm}</strong> on <strong>{predictionData.modelContext.recordSource}</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-48 flex-col items-center justify-center text-neutral-500 font-mono text-xs space-y-2">
                    <span>AWAITING INPUT PROFILE</span>
                    <p className="text-[11px] text-neutral-600 text-center max-w-sm">
                      Select technical skills and experience on the left, then click "Predict 6-Month Placement" to execute probabilistic classification.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
