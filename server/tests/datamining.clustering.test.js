import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { fitKMeans } from '../src/services/datamining/clusteringService.js'
import { calculateInertia, calculateSilhouetteScore } from '../src/services/datamining/evaluationService.js'

describe('Data Mining - K-Means Clustering Unit Tests', () => {
  // Deterministic 2D dataset with 3 distinct clusters:
  // Cluster 0: around (1, 1)
  // Cluster 1: around (10, 10)
  // Cluster 2: around (20, 1)
  const syntheticPoints = [
    [1.0, 1.1],
    [1.2, 0.9],
    [0.9, 1.2],
    [1.1, 1.0],
    [10.0, 10.1],
    [10.2, 9.9],
    [9.8, 10.2],
    [10.1, 10.0],
    [20.0, 1.1],
    [20.2, 0.9],
    [19.9, 1.2],
    [20.1, 1.0],
  ]

  it('clusters well-separated synthetic points into 3 expected groups', () => {
    const res = fitKMeans(syntheticPoints, { k: 3, randomSeed: 42, maxIterations: 50 })
    assert.equal(res.converged, true)
    assert.equal(res.centroids.length, 3)
    assert.equal(res.assignments.length, syntheticPoints.length)

    // Points 0..3 should belong to the same cluster
    const clusterA = res.assignments[0]
    assert.equal(res.assignments[1], clusterA)
    assert.equal(res.assignments[2], clusterA)
    assert.equal(res.assignments[3], clusterA)

    // Points 4..7 should belong to a different cluster
    const clusterB = res.assignments[4]
    assert.notEqual(clusterB, clusterA)
    assert.equal(res.assignments[5], clusterB)
    assert.equal(res.assignments[6], clusterB)
    assert.equal(res.assignments[7], clusterB)

    // Points 8..11 should belong to the third cluster
    const clusterC = res.assignments[8]
    assert.notEqual(clusterC, clusterA)
    assert.notEqual(clusterC, clusterB)
    assert.equal(res.assignments[9], clusterC)
    assert.equal(res.assignments[10], clusterC)
    assert.equal(res.assignments[11], clusterC)
  })

  it('produces identical reproducible results with the same random seed', () => {
    const run1 = fitKMeans(syntheticPoints, { k: 3, randomSeed: 12345 })
    const run2 = fitKMeans(syntheticPoints, { k: 3, randomSeed: 12345 })

    assert.deepEqual(run1.assignments, run2.assignments)
    assert.equal(run1.inertia, run2.inertia)
    assert.equal(run1.iterations, run2.iterations)
  })

  it('rejects invalid k parameter values', () => {
    assert.throws(() => fitKMeans(syntheticPoints, { k: 0 }), /Invalid k/)
    assert.throws(() => fitKMeans(syntheticPoints, { k: -1 }), /Invalid k/)
    assert.throws(() => fitKMeans(syntheticPoints, { k: 50 }), /Invalid k/)
    assert.throws(() => fitKMeans([], { k: 2 }), /Cannot fit K-Means on empty dataset/)
  })

  it('calculates within-cluster sum of squares (Inertia) accurately', () => {
    const points = [
      [0, 0],
      [2, 0],
    ]
    const assignments = [0, 0]
    const centroids = [[1, 0]]
    // Distance from (0,0) to (1,0) is 1, d^2 = 1. Distance from (2,0) to (1,0) is 1, d^2 = 1. Inertia = 2.
    const inertia = calculateInertia(points, assignments, centroids)
    assert.equal(inertia, 2)
  })

  it('calculates Silhouette Score close to 1 for well-separated clusters', () => {
    const assignments = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2]
    const score = calculateSilhouetteScore(syntheticPoints, assignments)
    // Points within clusters are dist ~0.2, between clusters dist ~10-20, so silhouette should be very high (>0.8)
    assert.ok(score > 0.8, `Expected silhouette > 0.8, got ${score}`)
  })
})
