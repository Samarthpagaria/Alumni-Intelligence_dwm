/**
 * Evaluation Metrics Service for Data Mining Models.
 * Provides standard mathematical implementations for Clustering (Inertia, Silhouette Score),
 * and Classification (Confusion Matrix, Precision, Recall, F1, ROC-AUC, Majority Baseline).
 */

/**
 * Calculates Euclidean distance squared between two points.
 */
export function squaredEuclidean(a, b) {
  let sum = 0
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i]
    sum += diff * diff
  }
  return sum
}

/**
 * Calculates Euclidean distance between two points.
 */
export function euclidean(a, b) {
  return Math.sqrt(squaredEuclidean(a, b))
}

/**
 * Computes Within-Cluster Sum of Squares (WCSS / Inertia).
 *
 * @param {Array<Array<number>>} points - Data vectors
 * @param {Array<number>} assignments - Cluster index per point
 * @param {Array<Array<number>>} centroids - Cluster center vectors
 */
export function calculateInertia(points, assignments, centroids) {
  let totalInertia = 0
  for (let i = 0; i < points.length; i++) {
    const clusterIdx = assignments[i]
    if (clusterIdx >= 0 && clusterIdx < centroids.length) {
      totalInertia += squaredEuclidean(points[i], centroids[clusterIdx])
    }
  }
  return Number(totalInertia.toFixed(2))
}

/**
 * Computes the mean Silhouette Score across points.
 * Evaluates how similar an object is to its own cluster compared to other clusters.
 * Range: [-1, +1]. Higher is better.
 *
 * @param {Array<Array<number>>} points
 * @param {Array<number>} assignments
 * @param {number} maxSample - Max sample size to keep computation fast on large N
 */
export function calculateSilhouetteScore(points, assignments, maxSample = 1000) {
  const n = points.length
  if (n < 4) return 0.0

  // Count cluster sizes
  const clusterCounts = new Map()
  for (const c of assignments) {
    clusterCounts.set(c, (clusterCounts.get(c) || 0) + 1)
  }
  const k = clusterCounts.size
  if (k <= 1 || k >= n) return 0.0

  // Group point indices by cluster
  const clusterIndices = new Map()
  for (let i = 0; i < n; i++) {
    const c = assignments[i]
    if (!clusterIndices.has(c)) clusterIndices.set(c, [])
    clusterIndices.get(c).push(i)
  }

  // If points exceed maxSample, sample evenly across clusters
  let sampleIndices = []
  if (n > maxSample) {
    const perCluster = Math.max(10, Math.floor(maxSample / k))
    for (const [, idxs] of clusterIndices.entries()) {
      sampleIndices.push(...idxs.slice(0, perCluster))
    }
  } else {
    sampleIndices = Array.from({ length: n }, (_, i) => i)
  }

  let totalScore = 0
  let validCount = 0

  for (const i of sampleIndices) {
    const ownCluster = assignments[i]
    const ownPoints = clusterIndices.get(ownCluster)

    if (ownPoints.length <= 1) continue // Single-point cluster

    // 1. Mean intra-cluster distance a(i)
    let aSum = 0
    for (const j of ownPoints) {
      if (i !== j) {
        aSum += euclidean(points[i], points[j])
      }
    }
    const a = aSum / (ownPoints.length - 1)

    // 2. Mean nearest-cluster distance b(i)
    let minB = Infinity
    for (const [otherCluster, otherPoints] of clusterIndices.entries()) {
      if (otherCluster === ownCluster) continue
      let bSum = 0
      for (const j of otherPoints) {
        bSum += euclidean(points[i], points[j])
      }
      const bMean = bSum / otherPoints.length
      if (bMean < minB) minB = bMean
    }

    const b = minB
    const denom = Math.max(a, b)
    if (denom > 0) {
      const s = (b - a) / denom
      totalScore += s
      validCount++
    }
  }

  return validCount > 0 ? Number((totalScore / validCount).toFixed(4)) : 0.0
}

/**
 * Computes standard binary classification evaluation metrics.
 *
 * @param {Array<number>} yTrue - Actual binary targets (0 or 1)
 * @param {Array<number>} yPred - Predicted classes (0 or 1)
 * @param {Array<number>} [yProbs] - Predicted probabilities for class 1
 */
export function calculateClassificationMetrics(yTrue = [], yPred = [], yProbs = []) {
  if (yTrue.length === 0 || yTrue.length !== yPred.length) {
    throw new Error('Mismatched or empty prediction arrays')
  }

  let tp = 0
  let fp = 0
  let tn = 0
  let fn = 0

  for (let i = 0; i < yTrue.length; i++) {
    const actual = yTrue[i]
    const pred = yPred[i]

    if (actual === 1 && pred === 1) tp++
    else if (actual === 0 && pred === 1) fp++
    else if (actual === 0 && pred === 0) tn++
    else if (actual === 1 && pred === 0) fn++
  }

  const total = tp + fp + tn + fn
  const accuracy = total > 0 ? (tp + tn) / total : 0
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0

  // Baseline comparison: Majority class predictor
  const actualPositive = tp + fn
  const actualNegative = tn + fp
  const majorityClassCount = Math.max(actualPositive, actualNegative)
  const baselineAccuracy = total > 0 ? majorityClassCount / total : 0

  // Calculate ROC-AUC if probabilities are available
  let rocArea = null
  if (yProbs && yProbs.length === yTrue.length && actualPositive > 0 && actualNegative > 0) {
    rocArea = calculateRocAuc(yTrue, yProbs)
  }

  return {
    accuracy: Number(accuracy.toFixed(4)),
    precision: Number(precision.toFixed(4)),
    recall: Number(recall.toFixed(4)),
    f1Score: Number(f1.toFixed(4)),
    rocAuc: rocArea !== null ? Number(rocArea.toFixed(4)) : null,
    confusionMatrix: {
      truePositive: tp,
      falsePositive: fp,
      trueNegative: tn,
      falseNegative: fn,
    },
    sampleCounts: {
      totalSamples: total,
      actualPositive,
      actualNegative,
      predictedPositive: tp + fp,
      predictedNegative: tn + fn,
    },
    baselineComparison: {
      majorityClassLabel: actualPositive >= actualNegative ? 1 : 0,
      baselineAccuracy: Number(baselineAccuracy.toFixed(4)),
      modelAccuracyDelta: Number((accuracy - baselineAccuracy).toFixed(4)),
    },
  }
}

/**
 * Computes Area Under the ROC Curve (ROC-AUC) using trapezoidal integration.
 */
export function calculateRocAuc(yTrue, yProbs) {
  // Pair and sort by probability descending
  const paired = yTrue.map((actual, idx) => ({ actual, prob: yProbs[idx] }))
  paired.sort((a, b) => b.prob - a.prob)

  let totalPositive = 0
  let totalNegative = 0
  for (const p of paired) {
    if (p.actual === 1) totalPositive++
    else totalNegative++
  }

  if (totalPositive === 0 || totalNegative === 0) return 0.5

  let accumulatedArea = 0
  let currentTp = 0
  let currentFp = 0
  let prevFp = 0
  let prevTp = 0

  for (let i = 0; i < paired.length; i++) {
    if (paired[i].actual === 1) {
      currentTp++
    } else {
      currentFp++
    }

    // When next item has a different probability or we're at the end
    if (i === paired.length - 1 || paired[i].prob !== paired[i + 1].prob) {
      const tpr = currentTp / totalPositive
      const fpr = currentFp / totalNegative
      const prevTpr = prevTp / totalPositive
      const prevFpr = prevFp / totalNegative

      // Trapezoid area: (FPR - prevFPR) * (TPR + prevTPR) / 2
      accumulatedArea += (fpr - prevFpr) * (tpr + prevTpr) / 2

      prevFp = currentFp
      prevTp = currentTp
    }
  }

  return Math.min(1.0, Math.max(0.0, accumulatedArea))
}
