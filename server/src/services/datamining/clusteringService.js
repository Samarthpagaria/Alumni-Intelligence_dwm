/**
 * K-Means Clustering Service.
 * Implements K-Means with K-Means++ initialization, deterministic seeded PRNG,
 * cluster profiling, multi-k elbow evaluation, and 2D PCA projection.
 */
import { getAlumniSkillDataset } from './dataminingRepository.js'
import { buildAlumniFeatureMatrix, computePCA2D } from './featureEngineeringService.js'
import { calculateInertia, calculateSilhouetteScore, squaredEuclidean, euclidean } from './evaluationService.js'

/**
 * Deterministic pseudo-random number generator (Mulberry32).
 */
function createPrng(seed = 2026) {
  let a = seed >>> 0
  return function next() {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Initializes centroids using the K-Means++ algorithm.
 */
function initKMeansPlusPlus(points, k, rng) {
  const n = points.length
  const centroids = []

  // 1. Pick first centroid uniformly at random
  const firstIdx = Math.floor(rng() * n)
  centroids.push([...points[firstIdx]])

  // 2. Pick remaining k - 1 centroids with probability proportional to D(x)^2
  for (let c = 1; c < k; c++) {
    const distances = new Array(n)
    let totalDistSq = 0

    for (let i = 0; i < n; i++) {
      let minDistSq = Infinity
      for (const centroid of centroids) {
        const d2 = squaredEuclidean(points[i], centroid)
        if (d2 < minDistSq) minDistSq = d2
      }
      distances[i] = minDistSq
      totalDistSq += minDistSq
    }

    if (totalDistSq === 0) {
      // All points identical or coincide with centroids; pick random remaining
      const randomIdx = Math.floor(rng() * n)
      centroids.push([...points[randomIdx]])
      continue
    }

    const threshold = rng() * totalDistSq
    let runningSum = 0
    let chosenIdx = 0

    for (let i = 0; i < n; i++) {
      runningSum += distances[i]
      if (runningSum >= threshold) {
        chosenIdx = i
        break
      }
    }
    centroids.push([...points[chosenIdx]])
  }

  return centroids
}

/**
 * Runs K-Means algorithm on a given matrix.
 */
export function fitKMeans(points, { k = 4, maxIterations = 50, tolerance = 1e-4, randomSeed = 2026 } = {}) {
  const n = points.length
  if (n === 0) throw new Error('Cannot fit K-Means on empty dataset')
  if (k <= 0 || k > n) throw new Error(`Invalid k=${k} for ${n} observations`)

  const d = points[0].length
  const rng = createPrng(randomSeed)
  let centroids = initKMeansPlusPlus(points, k, rng)
  let assignments = new Array(n).fill(0)
  let iterations = 0
  let converged = false

  while (iterations < maxIterations && !converged) {
    iterations++

    // 1. Assignment step: Assign each point to nearest centroid
    let changed = false
    for (let i = 0; i < n; i++) {
      let minDistSq = Infinity
      let bestCluster = 0
      for (let c = 0; c < k; c++) {
        const d2 = squaredEuclidean(points[i], centroids[c])
        if (d2 < minDistSq) {
          minDistSq = d2
          bestCluster = c
        }
      }
      if (assignments[i] !== bestCluster) {
        assignments[i] = bestCluster
        changed = true
      }
    }

    // 2. Update step: Recompute centroids
    const nextCentroids = Array.from({ length: k }, () => new Array(d).fill(0))
    const counts = new Array(k).fill(0)

    for (let i = 0; i < n; i++) {
      const c = assignments[i]
      counts[c]++
      for (let j = 0; j < d; j++) {
        nextCentroids[c][j] += points[i][j]
      }
    }

    // Handle empty clusters: reassign centroid to point with largest distance
    for (let c = 0; c < k; c++) {
      if (counts[c] === 0) {
        let maxD = -1
        let furthestIdx = 0
        for (let i = 0; i < n; i++) {
          const d2 = squaredEuclidean(points[i], centroids[assignments[i]])
          if (d2 > maxD) {
            maxD = d2
            furthestIdx = i
          }
        }
        nextCentroids[c] = [...points[furthestIdx]]
        counts[c] = 1
      } else {
        for (let j = 0; j < d; j++) {
          nextCentroids[c][j] /= counts[c]
        }
      }
    }

    // Check convergence tolerance
    let maxShift = 0
    for (let c = 0; c < k; c++) {
      const shift = euclidean(centroids[c], nextCentroids[c])
      if (shift > maxShift) maxShift = shift
    }

    centroids = nextCentroids
    if (!changed || maxShift < tolerance) {
      converged = true
    }
  }

  const inertia = calculateInertia(points, assignments, centroids)

  return {
    centroids,
    assignments,
    iterations,
    converged,
    inertia,
  }
}

/**
 * Derives a human-interpretable domain label from dominant skills in a cluster.
 */
function deriveClusterLabel(topSkills = [], avgExp = 0) {
  const skillNames = topSkills.map((s) => s.name.toLowerCase())
  const has = (keyword) => skillNames.some((name) => name.includes(keyword))

  let role = 'General Software Engineering'
  if (has('react') || has('css') || has('html') || has('vue') || has('angular') || has('frontend') || has('ui')) {
    if (has('node') || has('express') || has('sql') || has('mongo') || has('django') || has('spring')) {
      role = 'Full-Stack Web Development'
    } else {
      role = 'Frontend & UI Architecture'
    }
  } else if (has('python') || has('machine learning') || has('data') || has('pandas') || has('tensorflow') || has('sql') || has('r') || has('analytics')) {
    role = 'Data Analytics & AI / ML'
  } else if (has('aws') || has('docker') || has('kubernetes') || has('devops') || has('ci/cd') || has('linux') || has('cloud')) {
    role = 'Cloud Infrastructure & DevOps'
  } else if (has('java') || has('c++') || has('go') || has('microservices') || has('system design') || has('backend')) {
    role = 'Backend & Distributed Systems'
  } else if (has('security') || has('cyber') || has('penetration') || has('networking')) {
    role = 'Cybersecurity & Network Systems'
  }

  let seniority = 'Specialist'
  if (avgExp <= 2) seniority = 'Early-Career'
  else if (avgExp <= 5) seniority = 'Mid-Career'
  else seniority = 'Senior'

  return `${seniority} ${role}`
}

/**
 * Executes K-Means Clustering on the warehouse alumni dataset.
 *
 * @param {Object} options
 * @param {number} options.k - Number of clusters
 * @param {number} options.randomSeed - PRNG seed
 * @param {string} options.recordSource - Filter source
 * @param {number} options.topSkillsCount - Number of skills in feature matrix
 * @param {boolean} options.computeProjection - Whether to compute PCA 2D coordinates
 */
export async function runAlumniClustering({
  k = 4,
  randomSeed = 2026,
  recordSource = 'indian_academic_benchmark',
  topSkillsCount = 35,
  computeProjection = true,
} = {}) {
  const startTime = Date.now()

  // 1. Fetch alumni dataset
  const alumniList = await getAlumniSkillDataset({ recordSource, limit: 3000 })
  if (alumniList.length === 0) {
    throw new Error(`No alumni records found for source '${recordSource}'`)
  }

  // 2. Build feature matrix
  const { featureNames, matrix, alumniMetadata } = buildAlumniFeatureMatrix(alumniList, {
    topSkillsCount,
    includeExperience: true,
  })

  // 3. Fit K-Means
  const parsedK = Math.max(2, Math.min(k, Math.min(10, alumniList.length - 1)))
  const fitResult = fitKMeans(matrix, {
    k: parsedK,
    randomSeed,
    maxIterations: 60,
    tolerance: 1e-4,
  })

  // 4. Compute Silhouette Score
  const silhouetteScore = calculateSilhouetteScore(matrix, fitResult.assignments, 600)

  // 5. Cluster Profiling
  const clusterAlumni = Array.from({ length: parsedK }, () => [])
  for (let i = 0; i < fitResult.assignments.length; i++) {
    const c = fitResult.assignments[i]
    clusterAlumni[c].push(alumniMetadata[i])
  }

  const clusters = []
  for (let c = 0; c < parsedK; c++) {
    const members = clusterAlumni[c]
    const size = members.length
    const percentage = Number(((size / alumniList.length) * 100).toFixed(1))

    // Aggregate skill frequencies in cluster
    const clusterSkillFreq = new Map()
    let expSum = 0
    for (const m of members) {
      expSum += m.experience_years
      for (const skill of m.skills) {
        clusterSkillFreq.set(skill, (clusterSkillFreq.get(skill) || 0) + 1)
      }
    }

    const topSkillsInCluster = [...clusterSkillFreq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({
        name,
        count,
        prevalencePct: size > 0 ? Number(((count / size) * 100).toFixed(1)) : 0,
      }))

    const avgExperience = size > 0 ? Number((expSum / size).toFixed(1)) : 0
    const profileLabel = deriveClusterLabel(topSkillsInCluster, avgExperience)

    clusters.push({
      clusterId: c,
      size,
      percentage,
      averageExperienceYears: avgExperience,
      topSkills: topSkillsInCluster,
      profileLabel,
      sampleAlumniIds: members.slice(0, 5).map((m) => m.natural_alumni_id),
    })
  }

  // 6. PCA 2D coordinates for scatter plot visualization
  let projections = []
  if (computeProjection && matrix.length > 0) {
    const coords = computePCA2D(matrix, 40)
    projections = coords.map((pt, idx) => ({
      x: pt.x,
      y: pt.y,
      clusterId: fitResult.assignments[idx],
      alumniId: alumniMetadata[idx].natural_alumni_id,
      department: alumniMetadata[idx].department,
      experienceYears: alumniMetadata[idx].experience_years,
    }))
  }

  const executionTimeMs = Date.now() - startTime

  return {
    algorithm: 'kmeans',
    dataset: 'alumni_skill_profiles',
    parameters: {
      k: parsedK,
      randomSeed,
      maxIterations: fitResult.iterations,
      converged: fitResult.converged,
      topSkillsCount,
    },
    metrics: {
      inertia: fitResult.inertia,
      silhouetteScore,
      executionTimeMs,
    },
    clusters,
    projections: projections.slice(0, 500), // Return sample for responsive scatter rendering
    metadata: {
      recordSource,
      recordsUsed: alumniList.length,
      featuresUsed: featureNames.length,
      generatedAt: new Date().toISOString(),
      disclaimer: 'Cluster labels are data-derived thematic interpretations of dominant skill centroids, not native algorithm labels.',
    },
  }
}

/**
 * Runs multi-k evaluation across candidate k values [minK..maxK]
 * Computes Inertia (Elbow method) and Silhouette scores for each candidate k.
 */
export async function evaluateCandidateKClusters({
  minK = 2,
  maxK = 8,
  recordSource = 'indian_academic_benchmark',
  randomSeed = 2026,
} = {}) {
  const alumniList = await getAlumniSkillDataset({ recordSource, limit: 2500 })
  if (alumniList.length === 0) {
    throw new Error(`No alumni records found for source '${recordSource}'`)
  }

  const { matrix } = buildAlumniFeatureMatrix(alumniList, { topSkillsCount: 30, includeExperience: true })

  const candidateKList = []
  for (let k = minK; k <= maxK; k++) {
    if (k >= matrix.length) break

    const fit = fitKMeans(matrix, { k, randomSeed, maxIterations: 40 })
    const silhouette = calculateSilhouetteScore(matrix, fit.assignments, 350)

    candidateKList.push({
      k,
      inertia: fit.inertia,
      silhouetteScore: silhouette,
      iterations: fit.iterations,
    })
  }

  return {
    algorithm: 'kmeans_evaluation',
    dataset: 'alumni_skill_profiles',
    recordSource,
    recordsUsed: matrix.length,
    randomSeed,
    candidateKList,
    explanation: 'The Elbow Method identifies where the marginal drop in Inertia (WCSS) levels off. Silhouette Score measures cluster separation (higher is better). Both are heuristics for optimal k selection.',
    generatedAt: new Date().toISOString(),
  }
}
