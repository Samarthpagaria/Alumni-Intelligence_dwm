import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  findFrequentItemsets,
  generateRulesFromItemsets,
} from '../src/services/datamining/associationRulesService.js'

describe('Data Mining - Apriori Association Rule Mining Unit Tests', () => {
  // Hand-calculated transaction fixture (N=5)
  const transactions = [
    ['React', 'Node.js', 'PostgreSQL'], // T1
    ['React', 'Node.js'],               // T2
    ['React', 'PostgreSQL'],            // T3
    ['Node.js', 'PostgreSQL'],          // T4
    ['React', 'Node.js', 'PostgreSQL'], // T5
  ]

  it('correctly discovers frequent itemsets meeting minimum support count', () => {
    // minSupportCount = 3 (60% support)
    const frequent = findFrequentItemsets(transactions, 3, 3)

    // Individual items: React (4), Node.js (4), PostgreSQL (4)
    assert.equal(frequent.get('React'), 4)
    assert.equal(frequent.get('Node.js'), 4)
    assert.equal(frequent.get('PostgreSQL'), 4)

    // 2-itemsets: {Node.js, React} (3), {PostgreSQL, React} (3), {Node.js, PostgreSQL} (3)
    assert.equal(frequent.get('Node.js::React'), 3)
    assert.equal(frequent.get('PostgreSQL::React'), 3)
    assert.equal(frequent.get('Node.js::PostgreSQL'), 3)

    // 3-itemset {Node.js, PostgreSQL, React} has count 2, so it should NOT be in frequent (since minSupportCount=3)
    assert.equal(frequent.has('Node.js::PostgreSQL::React'), false)
  })

  it('generates exact hand-calculated support, confidence, and lift for rules', () => {
    // With minSupportCount=2, all itemsets up to 3 items are frequent
    const frequent = findFrequentItemsets(transactions, 2, 3)
    const rules = generateRulesFromItemsets(frequent, transactions.length, 0.5, 0.5)

    assert.ok(rules.length > 0)

    // Find rule: antecedent ['React'] => consequent ['Node.js']
    const ruleReactToNode = rules.find(
      (r) => r.antecedent.length === 1 && r.antecedent[0] === 'React' &&
             r.consequent.length === 1 && r.consequent[0] === 'Node.js'
    )

    assert.ok(ruleReactToNode, 'Rule React => Node.js should exist')
    // Support = 3/5 = 0.6
    assert.equal(ruleReactToNode.support, 0.6)
    // Confidence = 3 / 4 = 0.75
    assert.equal(ruleReactToNode.confidence, 0.75)
    // Lift = 0.75 / (4/5) = 0.75 / 0.8 = 0.9375
    assert.equal(ruleReactToNode.lift, 0.9375)
    assert.equal(ruleReactToNode.supportCount, 3)
  })

  it('enforces that antecedent and consequent do not overlap', () => {
    const frequent = findFrequentItemsets(transactions, 2, 3)
    const rules = generateRulesFromItemsets(frequent, transactions.length, 0.1, 0.1)

    for (const rule of rules) {
      const antSet = new Set(rule.antecedent)
      for (const item of rule.consequent) {
        assert.equal(antSet.has(item), false, `Antecedent and consequent must be disjoint: ${item}`)
      }
    }
  })

  it('handles empty transaction set gracefully without errors', () => {
    const frequent = findFrequentItemsets([], 2, 3)
    assert.equal(frequent.size, 0)

    const rules = generateRulesFromItemsets(frequent, 0, 0.5, 1.0)
    assert.equal(rules.length, 0)
  })

  it('filters rules that do not meet minConfidence or minLift', () => {
    const frequent = findFrequentItemsets(transactions, 2, 3)
    // Request unrealistically high thresholds
    const strictRules = generateRulesFromItemsets(frequent, transactions.length, 0.99, 2.0)
    assert.equal(strictRules.length, 0)
  })

  it('tracks diagnostics for candidate rules, confidence rejections, and lift rejections', () => {
    const frequent = findFrequentItemsets(transactions, 2, 3)
    const diagnostics = {
      candidateRulesGenerated: 0,
      rejectedByConfidence: 0,
      rejectedByLift: 0,
      qualifiedRulesCount: 0,
    }

    // High confidence cutoff, low lift cutoff -> rejectedByConfidence should be non-zero
    const rules = generateRulesFromItemsets(frequent, transactions.length, 0.95, 0.1, diagnostics)
    assert.ok(diagnostics.candidateRulesGenerated > 0, 'Candidate rules should be generated')
    assert.ok(diagnostics.rejectedByConfidence > 0, 'Some rules should be rejected by confidence')
    assert.equal(rules.length, diagnostics.qualifiedRulesCount)

    // Low confidence cutoff, high lift cutoff -> rejectedByLift should be non-zero
    const diagLift = {
      candidateRulesGenerated: 0,
      rejectedByConfidence: 0,
      rejectedByLift: 0,
      qualifiedRulesCount: 0,
    }
    generateRulesFromItemsets(frequent, transactions.length, 0.1, 5.0, diagLift)
    assert.ok(diagLift.rejectedByLift > 0, 'Some rules should be rejected by lift')
  })

  it('handles scenario where only 1-itemsets are frequent (zero 2-itemsets) safely', () => {
    // Only single items pass threshold, e.g. minSupportCount = 5
    const frequent = findFrequentItemsets(transactions, 5, 3)
    // In our fixture, no item has support count 5 (React=4, Node=4, Postgres=4)
    // Let's create an explicit Map with only 1-itemsets
    const only1Itemsets = new Map([
      ['SkillA', 10],
      ['SkillB', 8],
      ['SkillC', 6],
    ])
    const diagnostics = {
      candidateRulesGenerated: 0,
      rejectedByConfidence: 0,
      rejectedByLift: 0,
      qualifiedRulesCount: 0,
    }
    const rules = generateRulesFromItemsets(only1Itemsets, 10, 0.5, 1.1, diagnostics)
    assert.equal(rules.length, 0, 'Zero rules possible without 2+ itemsets')
    assert.equal(diagnostics.candidateRulesGenerated, 0)
    assert.equal(diagnostics.qualifiedRulesCount, 0)
  })
})
