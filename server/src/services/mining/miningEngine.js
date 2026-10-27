/**
 * Data Mining Engine Interface & Façade.
 * Bridges legacy imports to the Phase 5 Data Mining module.
 */
import { runAlumniClustering } from '../datamining/clusteringService.js'
import { runAprioriAssociationMining } from '../datamining/associationRulesService.js'
import {
  trainCareerOutcomeClassifier,
  predictCareerOutcome,
} from '../datamining/classificationService.js'

export const MINING_ALGORITHMS = {
  APRIORI: 'APRIORI',
  KMEANS: 'KMEANS',
  CLASSIFICATION: 'CLASSIFICATION',
}

export class MiningEngine {
  /**
   * Run Apriori Association Rule Mining on transaction baskets.
   */
  async runApriori(options = {}) {
    return runAprioriAssociationMining(options)
  }

  /**
   * Run K-Means Clustering on alumni profiles.
   */
  async runKMeans(options = {}) {
    return runAlumniClustering(options)
  }

  /**
   * Train and predict career outcome.
   */
  async predictPlacement(candidateProfile = {}) {
    return predictCareerOutcome(candidateProfile)
  }

  async trainModel(options = {}) {
    return trainCareerOutcomeClassifier(options)
  }
}

export const defaultMiningEngine = new MiningEngine()
export default defaultMiningEngine
