/**
 * Apriori Association Rule Mining Service.
 * Implements frequent itemset mining and association rule generation
 * with support, confidence, and lift metrics.
 */
import { getSkillTransactionBaskets } from './dataminingRepository.js'
import logger from '../../utils/logger.js'

/**
 * Standardizes an itemset into a canonical sorted string key.
 */
function toItemsetKey(items) {
  return [...items].sort().join('::')
}

/**
 * Parses an itemset key back into an array of items.
 */
function fromItemsetKey(key) {
  return key.split('::')
}

/**
 * Generates candidate k-itemsets C_k from frequent (k-1)-itemsets L_{k-1}.
 * Uses Apriori join and pruning steps.
 */
function generateCandidateItemsets(frequentKeys, k) {
  const frequentList = frequentKeys.map(fromItemsetKey)
  const candidateMap = new Set()

  for (let i = 0; i < frequentList.length; i++) {
    for (let j = i + 1; j < frequentList.length; j++) {
      const setA = frequentList[i]
      const setB = frequentList[j]

      // Join condition: first k - 2 elements must be identical
      let canJoin = true
      for (let m = 0; m < k - 2; m++) {
        if (setA[m] !== setB[m]) {
          canJoin = false
          break
        }
      }

      if (canJoin) {
        const union = Array.from(new Set([...setA, ...setB])).sort()
        if (union.length === k) {
          // Prune step: check if all (k-1) subsets are in frequentKeys
          let allSubsetsFrequent = true
          for (let dropIdx = 0; dropIdx < k; dropIdx++) {
            const subset = union.filter((_, idx) => idx !== dropIdx)
            if (!frequentKeys.includes(toItemsetKey(subset))) {
              allSubsetsFrequent = false
              break
            }
          }

          if (allSubsetsFrequent) {
            candidateMap.add(toItemsetKey(union))
          }
        }
      }
    }
  }

  return Array.from(candidateMap)
}

/**
 * Core Apriori Algorithm to find frequent itemsets.
 */
export function findFrequentItemsets(transactions = [], minSupportCount = 5, maxItemsetLength = 3) {
  const n = transactions.length
  if (n === 0) return new Map()

  // 1. Generate L_1: Frequent 1-itemsets
  const itemCounts = new Map()
  for (const t of transactions) {
    const uniqueItems = new Set(t)
    for (const item of uniqueItems) {
      itemCounts.set(item, (itemCounts.get(item) || 0) + 1)
    }
  }

  const frequentItemsets = new Map()
  let currentLevelKeys = []

  for (const [item, count] of itemCounts.entries()) {
    if (count >= minSupportCount) {
      const key = toItemsetKey([item])
      frequentItemsets.set(key, count)
      currentLevelKeys.push(key)
    }
  }

  // 2. Iteratively generate L_k for k = 2..maxItemsetLength
  let k = 2
  while (k <= maxItemsetLength && currentLevelKeys.length > 0) {
    const candidateKeys = generateCandidateItemsets(currentLevelKeys, k)
    if (candidateKeys.length === 0) break

    // Count support for candidates
    const candidateCounts = new Map()
    for (const candKey of candidateKeys) {
      candidateCounts.set(candKey, 0)
    }

    const candidateItemArrays = candidateKeys.map((key) => ({
      key,
      items: fromItemsetKey(key),
    }))

    for (const t of transactions) {
      const tSet = new Set(t)
      for (const { key, items } of candidateItemArrays) {
        let match = true
        for (const item of items) {
          if (!tSet.has(item)) {
            match = false
            break
          }
        }
        if (match) {
          candidateCounts.set(key, candidateCounts.get(key) + 1)
        }
      }
    }

    // Filter by minSupportCount
    const nextLevelKeys = []
    for (const [candKey, count] of candidateCounts.entries()) {
      if (count >= minSupportCount) {
        frequentItemsets.set(candKey, count)
        nextLevelKeys.push(candKey)
      }
    }

    currentLevelKeys = nextLevelKeys
    k++
  }

  return frequentItemsets
}

/**
 * Generates association rules from frequent itemsets with minConfidence and minLift.
 * Accepts optional diagnostics object to collect candidate and rejection counts.
 */
export function generateRulesFromItemsets(frequentItemsets, totalTransactions, minConfidence = 0.5, minLift = 1.0, diagnostics = null) {
  const rules = []
  const n = totalTransactions
  if (n === 0) return rules

  let candidateRulesGenerated = 0
  let rejectedByConfidence = 0
  let rejectedByLift = 0

  for (const [itemsetKey, itemsetCount] of frequentItemsets.entries()) {
    const items = fromItemsetKey(itemsetKey)
    if (items.length < 2) continue

    const itemsetSupport = itemsetCount / n

    // Generate non-empty proper subsets as antecedents
    const subsets = []
    const totalCombinations = 1 << items.length
    for (let mask = 1; mask < totalCombinations - 1; mask++) {
      const antecedent = []
      const consequent = []
      for (let i = 0; i < items.length; i++) {
        if (mask & (1 << i)) {
          antecedent.push(items[i])
        } else {
          consequent.push(items[i])
        }
      }
      subsets.push({ antecedent, consequent })
    }

    for (const { antecedent, consequent } of subsets) {
      candidateRulesGenerated++
      const antecedentKey = toItemsetKey(antecedent)
      const consequentKey = toItemsetKey(consequent)

      const antecedentCount = frequentItemsets.get(antecedentKey)
      const consequentCount = frequentItemsets.get(consequentKey)

      if (!antecedentCount || !consequentCount) {
        rejectedByConfidence++
        continue
      }

      const antecedentSupport = antecedentCount / n
      const consequentSupport = consequentCount / n

      // Confidence = P(Consequent | Antecedent) = Support(Itemset) / Support(Antecedent)
      const confidence = itemsetSupport / antecedentSupport

      // Lift = Confidence / Support(Consequent)
      const lift = consequentSupport > 0 ? confidence / consequentSupport : 0

      if (confidence < minConfidence) {
        rejectedByConfidence++
      } else if (lift < minLift) {
        rejectedByLift++
      } else {
        rules.push({
          antecedent: antecedent.sort(),
          consequent: consequent.sort(),
          support: Number(itemsetSupport.toFixed(4)),
          confidence: Number(confidence.toFixed(4)),
          lift: Number(lift.toFixed(4)),
          supportCount: itemsetCount,
          antecedentSupport: Number(antecedentSupport.toFixed(4)),
          consequentSupport: Number(consequentSupport.toFixed(4)),
        })
      }
    }
  }

  if (diagnostics && typeof diagnostics === 'object') {
    diagnostics.candidateRulesGenerated = candidateRulesGenerated
    diagnostics.rejectedByConfidence = rejectedByConfidence
    diagnostics.rejectedByLift = rejectedByLift
    diagnostics.qualifiedRulesCount = rules.length
  }

  // Sort rules descending by lift, then confidence, then support
  rules.sort((a, b) => b.lift - a.lift || b.confidence - a.confidence || b.support - a.support)

  return rules
}

/**
 * Runs the complete Apriori association rule mining workflow.
 *
 * @param {Object} options
 * @param {string} options.mode - 'alumni_skills' | 'job_skills' | 'career_outcomes'
 * @param {number} options.minSupport - e.g. 0.05 (5%)
 * @param {number} options.minConfidence - e.g. 0.60 (60%)
 * @param {number} options.minLift - e.g. 1.10
 * @param {number} options.maxItemsetLength - e.g. 3
 * @param {number} options.limit - Max rules to return
 * @param {string} options.recordSource - Filter source
 */
export async function runAprioriAssociationMining({
  mode = 'alumni_skills',
  minSupport = 0.05,
  minConfidence = 0.5,
  minLift = 1.1,
  maxItemsetLength = 3,
  limit = 50,
  recordSource = 'indian_academic_benchmark',
} = {}) {
  const startTime = Date.now()

  // 1. Fetch transaction baskets
  const basketRows = await getSkillTransactionBaskets({ mode, recordSource, limit: 5000 })
  const transactions = basketRows.map((r) => r.items)
  const totalTransactions = transactions.length

  if (totalTransactions === 0) {
    return {
      algorithm: 'apriori',
      mode,
      parameters: { minSupport, minConfidence, minLift, maxItemsetLength },
      transactionsUsed: 0,
      frequentItemsetsCount: 0,
      rules: [],
      diagnostics: {
        transactionCount: 0,
        frequentItemsetsCount: 0,
        itemsetsBySize: {},
        candidateRulesGenerated: 0,
        rejectedByConfidence: 0,
        rejectedByLift: 0,
        qualifiedRulesCount: 0,
        rejectionReason: 'No transactions found matching the specified source and criteria.',
      },
      metadata: {
        recordSource,
        generatedAt: new Date().toISOString(),
        executionTimeMs: Date.now() - startTime,
        message: 'No transactions found matching criteria.',
      },
    }
  }

  // 2. Minimum support count
  const minSupportCount = Math.max(2, Math.ceil(totalTransactions * minSupport))

  // 3. Find frequent itemsets
  const frequentItemsets = findFrequentItemsets(transactions, minSupportCount, maxItemsetLength)

  // Calculate itemset counts grouped by itemset length
  const itemsetsBySize = {}
  for (const [key] of frequentItemsets.entries()) {
    const size = fromItemsetKey(key).length
    itemsetsBySize[size] = (itemsetsBySize[size] || 0) + 1
  }

  // 4. Generate association rules with diagnostic tracking
  const ruleDiagnostics = {
    candidateRulesGenerated: 0,
    rejectedByConfidence: 0,
    rejectedByLift: 0,
    qualifiedRulesCount: 0,
  }
  const allRules = generateRulesFromItemsets(frequentItemsets, totalTransactions, minConfidence, minLift, ruleDiagnostics)

  // Deduplicate redundant rules if any and slice to limit
  const returnedRules = allRules.slice(0, limit)
  const executionTimeMs = Date.now() - startTime

  logger.info('Apriori association mining diagnostics', {
    mode,
    recordSource,
    transactionsUsed: totalTransactions,
    frequentItemsetsCount: frequentItemsets.size,
    itemsetsBySize,
    candidateRulesGenerated: ruleDiagnostics.candidateRulesGenerated,
    rejectedByConfidence: ruleDiagnostics.rejectedByConfidence,
    rejectedByLift: ruleDiagnostics.rejectedByLift,
    qualifiedRulesCount: allRules.length,
    executionTimeMs,
  })

  return {
    algorithm: 'apriori',
    mode,
    parameters: {
      minSupport,
      minConfidence,
      minLift,
      maxItemsetLength,
      minSupportCount,
    },
    transactionsUsed: totalTransactions,
    frequentItemsetsCount: frequentItemsets.size,
    rulesCount: allRules.length,
    rules: returnedRules,
    diagnostics: {
      transactionCount: totalTransactions,
      frequentItemsetsCount: frequentItemsets.size,
      itemsetsBySize,
      candidateRulesGenerated: ruleDiagnostics.candidateRulesGenerated,
      rejectedByConfidence: ruleDiagnostics.rejectedByConfidence,
      rejectedByLift: ruleDiagnostics.rejectedByLift,
      qualifiedRulesCount: allRules.length,
      note: allRules.length === 0 && (!itemsetsBySize[2] || itemsetsBySize[2] === 0)
        ? `All ${frequentItemsets.size} frequent itemsets are 1-itemsets (single items). Association rules (A ⇒ B) require pairs or triples (size ≥ 2). Lower Min Support to discover co-occurring skill pairs.`
        : null,
    },
    metadata: {
      recordSource,
      generatedAt: new Date().toISOString(),
      executionTimeMs,
      definitions: {
        support: 'Proportion of transactions containing both antecedent and consequent.',
        confidence: 'Conditional probability of consequent given the antecedent.',
        lift: 'Ratio of observed rule support to expected support under independence (>1 indicates positive correlation).',
      },
    },
  }
}
