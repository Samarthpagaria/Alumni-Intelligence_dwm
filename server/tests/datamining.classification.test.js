import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  calculateClassificationMetrics,
  calculateRocAuc,
} from '../src/services/datamining/evaluationService.js'
import { stratifiedTrainTestSplit } from '../src/services/datamining/featureEngineeringService.js'

describe('Data Mining - Supervised Classification Unit Tests', () => {
  it('computes exact hand-calculated classification metrics', () => {
    // 5 samples:
    // yTrue: [1, 1, 0, 0, 1]  (3 positive, 2 negative)
    // yPred: [1, 0, 0, 1, 1]  (TP=2, FN=1, TN=1, FP=1)
    const yTrue = [1, 1, 0, 0, 1]
    const yPred = [1, 0, 0, 1, 1]
    const yProbs = [0.9, 0.4, 0.2, 0.7, 0.8]

    const metrics = calculateClassificationMetrics(yTrue, yPred, yProbs)

    assert.equal(metrics.confusionMatrix.truePositive, 2)
    assert.equal(metrics.confusionMatrix.falseNegative, 1)
    assert.equal(metrics.confusionMatrix.trueNegative, 1)
    assert.equal(metrics.confusionMatrix.falsePositive, 1)

    // Accuracy = 3 / 5 = 0.6
    assert.equal(metrics.accuracy, 0.6)
    // Precision = 2 / (2 + 1) = 0.6667
    assert.equal(metrics.precision, 0.6667)
    // Recall = 2 / (2 + 1) = 0.6667
    assert.equal(metrics.recall, 0.6667)
    // F1 = 0.6667
    assert.equal(metrics.f1Score, 0.6667)
    // Baseline majority class (Positive: 3/5 = 0.6)
    assert.equal(metrics.baselineComparison.baselineAccuracy, 0.6)
  })

  it('calculates ROC-AUC accurately for perfect and inverted distributions', () => {
    // Perfect ranking
    const perfectTrue = [1, 1, 0, 0]
    const perfectProbs = [0.95, 0.80, 0.30, 0.10]
    const perfectAuc = calculateRocAuc(perfectTrue, perfectProbs)
    assert.equal(perfectAuc, 1.0)

    // Inverted ranking
    const invertedTrue = [1, 1, 0, 0]
    const invertedProbs = [0.10, 0.20, 0.80, 0.90]
    const invertedAuc = calculateRocAuc(invertedTrue, invertedProbs)
    assert.equal(invertedAuc, 0.0)
  })

  it('performs stratified train/test split preserving class distribution', () => {
    // 100 samples with 70% positive (70 class 1, 30 class 0)
    const mockRecords = []
    for (let i = 0; i < 70; i++) mockRecords.push({ id: `pos-${i}`, target: 1 })
    for (let i = 0; i < 30; i++) mockRecords.push({ id: `neg-${i}`, target: 0 })

    const { trainRecords, testRecords, classDistribution } = stratifiedTrainTestSplit(mockRecords, {
      testRatio: 0.20,
      randomSeed: 2026,
    })

    assert.equal(trainRecords.length, 80)
    assert.equal(testRecords.length, 20)

    // In testRecords (20 items), expected 70% of 20 = 14 class 1, 30% of 20 = 6 class 0
    const testClass1 = testRecords.filter((r) => r.target === 1).length
    const testClass0 = testRecords.filter((r) => r.target === 0).length
    assert.equal(testClass1, 14)
    assert.equal(testClass0, 6)

    // Check class distribution metadata
    assert.equal(classDistribution.total, 100)
    assert.equal(classDistribution.trainClass1, 56)
    assert.equal(classDistribution.trainClass0, 24)
  })

  it('handles edge case of single-class arrays gracefully without throwing', () => {
    const singleClassTrue = [1, 1, 1]
    const singleClassPred = [1, 1, 1]
    const metrics = calculateClassificationMetrics(singleClassTrue, singleClassPred)
    assert.equal(metrics.accuracy, 1.0)
    assert.equal(metrics.precision, 1.0)
    assert.equal(metrics.recall, 1.0)
    assert.equal(metrics.f1Score, 1.0)
  })
})
