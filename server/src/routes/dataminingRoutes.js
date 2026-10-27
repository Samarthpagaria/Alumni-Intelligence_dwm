/**
 * Data Mining API Routes.
 * Mounts endpoints for Clustering, Apriori Association Rules, and Supervised Classification.
 */
import { Router } from 'express'
import * as controller from '../controllers/dataminingController.js'

const router = Router()

// 1. Overview & Data Mining Cockpit Summary
router.get('/summary', controller.getSummary)

// 2. K-Means Clustering
router.get('/clustering', controller.getClustering)
router.get('/clustering/evaluation', controller.getClusteringEvaluation)

// 3. Apriori Association Rule Mining
router.get('/association-rules', controller.getAssociationRules)

// 4. Supervised Classification for Career Outcome Prediction
router.get('/classification/metadata', controller.getClassificationInfo)
router.post('/classification/train', controller.trainClassification)
router.post('/classification/predict', controller.predictClassification)

export default router
