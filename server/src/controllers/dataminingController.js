/**
 * Data Mining Controller.
 * Handles HTTP requests for K-Means Clustering, Apriori Association Rules,
 * and Supervised Classification.
 */
import {
  validateRecordSource,
  validateClusteringParams,
  validateEvaluationParams,
  validateAprioriParams,
  validateTrainParams,
  validatePredictParams,
} from '../utils/dataminingValidation.js'
import { getDataMiningSummary } from '../services/datamining/dataminingRepository.js'
import { runAlumniClustering, evaluateCandidateKClusters } from '../services/datamining/clusteringService.js'
import { runAprioriAssociationMining } from '../services/datamining/associationRulesService.js'
import {
  trainCareerOutcomeClassifier,
  predictCareerOutcome,
  getClassificationMetadata,
} from '../services/datamining/classificationService.js'
import { sendSuccess } from '../utils/response.js'

/**
 * GET /api/analytics/datamining/summary
 */
export async function getSummary(req, res, next) {
  try {
    const recordSource = validateRecordSource(req.query.recordSource)
    const data = await getDataMiningSummary({ recordSource })
    return res.json(data)
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/analytics/datamining/clustering
 */
export async function getClustering(req, res, next) {
  try {
    const params = validateClusteringParams(req.query)
    const result = await runAlumniClustering(params)
    return res.json(result)
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/analytics/datamining/clustering/evaluation
 */
export async function getClusteringEvaluation(req, res, next) {
  try {
    const params = validateEvaluationParams(req.query)
    const result = await evaluateCandidateKClusters(params)
    return res.json(result)
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/analytics/datamining/association-rules
 */
export async function getAssociationRules(req, res, next) {
  try {
    const params = validateAprioriParams(req.query)
    const result = await runAprioriAssociationMining(params)
    return res.json(result)
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/analytics/datamining/classification/metadata
 */
export async function getClassificationInfo(req, res, next) {
  try {
    const recordSource = validateRecordSource(req.query.recordSource)
    const result = await getClassificationMetadata({ recordSource })
    return res.json(result)
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/analytics/datamining/classification/train
 */
export async function trainClassification(req, res, next) {
  try {
    const params = validateTrainParams(req.body)
    const result = await trainCareerOutcomeClassifier(params)
    return sendSuccess(res, result, { message: 'Model trained and evaluated successfully' })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/analytics/datamining/classification/predict
 */
export async function predictClassification(req, res, next) {
  try {
    const params = validatePredictParams(req.body)
    const result = await predictCareerOutcome(params)
    return sendSuccess(res, result)
  } catch (err) {
    next(err)
  }
}
