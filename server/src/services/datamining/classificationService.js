/**
 * Supervised Classification Service for Career Outcome Prediction.
 * Implements regularized Logistic Regression with gradient descent,
 * leakage-safe stratified evaluation, ROC-AUC, confusion matrix,
 * feature importance (weights), and interactive inference.
 */
import { getClassificationTrainingDataset } from './dataminingRepository.js'
import { stratifiedTrainTestSplit } from './featureEngineeringService.js'
import { calculateClassificationMetrics } from './evaluationService.js'
import logger from '../../utils/logger.js'

/**
 * Standard Sigmoid activation function.
 */
function sigmoid(z) {
  if (z >= 40) return 1.0
  if (z <= -40) return 0.0
  return 1.0 / (1.0 + Math.exp(-z))
}

/**
 * In-memory active model cache for inference endpoint.
 */
let activeModel = null

/**
 * Fits preprocessing transformations strictly on the training set to prevent leakage.
 */
function fitPreprocessor(trainRecords, topSkillsCount = 30) {
  // 1. Identify top skills present in training data only
  const skillFreq = new Map()
  for (const r of trainRecords) {
    for (const s of r.skills || []) {
      if (s.skill_name) {
        skillFreq.set(s.skill_name, (skillFreq.get(s.skill_name) || 0) + 1)
      }
    }
  }

  const selectedSkills = [...skillFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topSkillsCount)
    .map(([name]) => name)

  const skillIndexMap = new Map(selectedSkills.map((name, idx) => [name, idx]))

  // 2. Compute min-max scaling for experience from training data
  let minExp = Infinity
  let maxExp = -Infinity
  for (const r of trainRecords) {
    const exp = Number(r.experience_years_at_observation ?? r.experience_years_profile) || 0
    if (exp < minExp) minExp = exp
    if (exp > maxExp) maxExp = exp
  }
  if (minExp === maxExp) maxExp = minExp + 1

  // Feature vector definition: [...skills, norm_experience, skill_count_norm]
  const featureNames = [...selectedSkills, 'norm_experience', 'norm_skill_count']

  return {
    selectedSkills,
    skillIndexMap,
    minExp,
    maxExp,
    featureNames,
    transform(record) {
      const vec = new Array(featureNames.length).fill(0)
      const recordSkillNames = new Set((record.skills || []).map((s) => (typeof s === 'string' ? s : s.skill_name)))

      for (const [skillName, colIdx] of skillIndexMap.entries()) {
        if (recordSkillNames.has(skillName)) {
          vec[colIdx] = 1.0
        }
      }

      const rawExp = Number(record.experience_years_at_observation ?? record.experience_years ?? record.experience_years_profile) || 0
      const scaledExp = Math.max(0, Math.min(1, (rawExp - minExp) / (maxExp - minExp)))
      vec[selectedSkills.length] = Number(scaledExp.toFixed(4))

      const skillCount = recordSkillNames.size
      const scaledSkillCount = Math.max(0, Math.min(1, skillCount / Math.max(1, selectedSkills.length)))
      vec[selectedSkills.length + 1] = Number(scaledSkillCount.toFixed(4))

      return vec
    },
  }
}

/**
 * Fits Logistic Regression with L2 Regularization using Batch Gradient Descent.
 */
function fitLogisticRegression(X, y, { learningRate = 0.2, epochs = 350, l2Penalty = 0.002 } = {}) {
  const n = X.length
  const d = X[0].length

  let count0 = 0
  let count1 = 0
  for (let i = 0; i < n; i++) {
    if (y[i] === 1) count1++
    else count0++
  }
  const weight0 = count0 > 0 ? n / (2 * count0) : 1
  const weight1 = count1 > 0 ? n / (2 * count1) : 1

  const weights = new Array(d).fill(0)
  let bias = count1 > 0 && count0 > 0 ? Math.log(count1 / count0) : 0

  for (let epoch = 0; epoch < epochs; epoch++) {
    const gradWeights = new Array(d).fill(0)
    let gradBias = 0

    for (let i = 0; i < n; i++) {
      let z = bias
      for (let j = 0; j < d; j++) {
        z += weights[j] * X[i][j]
      }
      const pred = sigmoid(z)
      const sampleWeight = y[i] === 1 ? weight1 : weight0
      const error = (pred - y[i]) * sampleWeight

      for (let j = 0; j < d; j++) {
        gradWeights[j] += error * X[i][j]
      }
      gradBias += error
    }

    // Update with L2 regularization
    for (let j = 0; j < d; j++) {
      weights[j] -= learningRate * (gradWeights[j] / n + l2Penalty * weights[j])
    }
    bias -= learningRate * (gradBias / n)
  }

  return {
    weights,
    bias,
    predictProbability(xVector) {
      let z = bias
      for (let j = 0; j < d; j++) {
        z += weights[j] * xVector[j]
      }
      return sigmoid(z)
    },
  }
}

/**
 * Trains and evaluates the career outcome classification model.
 *
 * @param {Object} options
 * @param {string} options.recordSource
 * @param {number} options.testRatio
 * @param {number} options.randomSeed
 * @param {number} options.topSkillsCount
 */
export async function trainCareerOutcomeClassifier({
  recordSource = 'indian_academic_benchmark',
  testRatio = 0.20,
  randomSeed = 2026,
  topSkillsCount = 30,
} = {}) {
  const startTime = Date.now()

  // 1. Fetch labeled dataset
  const records = await getClassificationTrainingDataset({ recordSource, limit: 3000 })
  if (records.length < 4) {
    throw new Error(`Insufficient labeled career outcome records (found ${records.length}, minimum 4 required)`)
  }

  // 2. Leakage-safe Stratified Split
  const { trainRecords, testRecords, classDistribution } = stratifiedTrainTestSplit(records, {
    testRatio,
    randomSeed,
  })

  // 3. Fit Preprocessor ONLY on training set
  const preprocessor = fitPreprocessor(trainRecords, topSkillsCount)

  // 4. Transform training and test vectors
  const XTrain = trainRecords.map((r) => preprocessor.transform(r))
  const yTrain = trainRecords.map((r) => Number(r.target))

  const XTest = testRecords.map((r) => preprocessor.transform(r))
  const yTest = testRecords.map((r) => Number(r.target))

  // 5. Fit Logistic Regression
  const model = fitLogisticRegression(XTrain, yTrain, {
    learningRate: 0.15,
    epochs: 250,
    l2Penalty: 0.005,
  })

  // 6. Test set evaluation (Held-out validation)
  const testProbs = XTest.map((vec) => Number(model.predictProbability(vec).toFixed(4)))
  const testPreds = testProbs.map((prob) => (prob >= 0.5 ? 1 : 0))

  const metrics = calculateClassificationMetrics(yTest, testPreds, testProbs)

  // 7. Feature weights / Coefficients (Feature Importance)
  const featureWeights = preprocessor.featureNames.map((name, idx) => ({
    feature: name,
    weight: Number(model.weights[idx].toFixed(4)),
    absWeight: Math.abs(model.weights[idx]),
    impact: model.weights[idx] > 0 ? 'Positive' : 'Negative',
  }))
  featureWeights.sort((a, b) => b.absWeight - a.absWeight)

  // 8. Save active model in memory for live inference
  activeModel = {
    model,
    preprocessor,
    metrics,
    featureWeights,
    recordSource,
    trainedAt: new Date().toISOString(),
  }

  const executionTimeMs = Date.now() - startTime

  return {
    algorithm: 'logistic_regression',
    target: {
      name: 'employed_within_6_months',
      positiveMeaning: 'Employed / Placed within 6 months post-graduation',
      negativeMeaning: 'Not placed within 6 months',
      isSyntheticEducationalTarget: true,
      disclosure: 'This target is generated from curriculum benchmark formulas. Results illustrate supervised learning evaluation and are not commercial employment guarantees.',
    },
    dataset: {
      recordSource,
      totalRecords: records.length,
      trainCount: trainRecords.length,
      testCount: testRecords.length,
      testRatio,
      randomSeed,
      featuresUsed: preprocessor.featureNames.length,
    },
    classDistribution,
    evaluation: metrics,
    featureImportance: featureWeights.slice(0, 15),
    metadata: {
      executionTimeMs,
      trainedAt: activeModel.trainedAt,
    },
  }
}

/**
 * Predicts career outcome probability for a candidate profile.
 *
 * @param {Object} input
 * @param {Array<string>} input.skills - Array of skill names
 * @param {number} input.experience_years - Experience in years
 */
export async function predictCareerOutcome(input = {}) {
  // Ensure model is trained; if not, train default model
  if (!activeModel) {
    logger.info('Active classification model not found, fitting default baseline model...')
    await trainCareerOutcomeClassifier()
  }

  const { model, preprocessor, recordSource, trainedAt } = activeModel

  const candidateSkills = Array.isArray(input.skills) ? input.skills : []
  const experienceYears = Number(input.experience_years) || 0

  const vector = preprocessor.transform({
    skills: candidateSkills,
    experience_years: experienceYears,
  })

  const probability = Number(model.predictProbability(vector).toFixed(4))
  const prediction = probability >= 0.5 ? 1 : 0

  // Identify matching active skills
  const matchedSkills = candidateSkills.filter((s) => preprocessor.skillIndexMap.has(s))

  return {
    prediction,
    predictedClass: prediction === 1 ? 'Placed within 6 Months' : 'Extended Search / Further Preparation Needed',
    probability,
    probabilityPercentage: Number((probability * 100).toFixed(1)),
    confidenceLevel: probability >= 0.75 || probability <= 0.25 ? 'High' : 'Moderate',
    inputFeatures: {
      skillsProvided: candidateSkills.length,
      matchedModelFeatures: matchedSkills.length,
      matchedSkills,
      experienceYears,
    },
    modelContext: {
      algorithm: 'logistic_regression',
      recordSource,
      modelTrainedAt: trainedAt,
      educationalNotice: 'Academic synthetic benchmark output. Not a real-world placement warranty.',
    },
  }
}

/**
 * Returns metadata regarding the classification task and current model status.
 */
export async function getClassificationMetadata({ recordSource = 'indian_academic_benchmark' } = {}) {
  const records = await getClassificationTrainingDataset({ recordSource, limit: 3000 })
  let count0 = 0
  let count1 = 0
  for (const r of records) {
    if (r.target === 1) count1++
    else count0++
  }

  return {
    target: {
      column: 'employed_within_6_months',
      table: 'dwh.fact_career_outcomes',
      positiveLabel: 'Employed within 6 months (1)',
      negativeLabel: 'Not employed within 6 months (0)',
      isSyntheticEducationalTarget: true,
      totalLabeledRecords: records.length,
      class0Count: count0,
      class1Count: count1,
      class1Proportion: records.length > 0 ? Number(((count1 / records.length) * 100).toFixed(1)) : 0,
    },
    hasTrainedModel: activeModel !== null,
    activeModelMetrics: activeModel ? activeModel.metrics : null,
    educationalDisclaimer: 'Supervised classification in this project teaches data mining metrics (Precision, Recall, ROC-AUC) using Indian academic tech benchmarks. Predictions must never be used for actual recruitment screening.',
  }
}
