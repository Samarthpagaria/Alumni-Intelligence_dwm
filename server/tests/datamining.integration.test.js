import 'dotenv/config'
import { after, before, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import { startTestDatabase, stopTestDatabase } from './helpers/testDatabase.js'

process.env.NODE_ENV = 'test'

await startTestDatabase()

const { default: app } = await import('../src/app.js')
const { query } = await import('../src/config/database.js')

describe('Data Mining - REST API Integration Test Suite', () => {
  before(async () => {
    // Seed minimal DWH dimensions & bridges in the test database so queries return valid shapes
    await query(`
      INSERT INTO dwh.dim_skill (skill_sk, natural_skill_id, skill_name, category)
      VALUES 
        (1, 'SK-01', 'JavaScript', 'Programming'),
        (2, 'SK-02', 'React.js', 'Frontend'),
        (3, 'SK-03', 'Node.js', 'Backend'),
        (4, 'SK-04', 'Python', 'Data Science'),
        (5, 'SK-05', 'Machine Learning', 'Data Science')
      ON CONFLICT (skill_sk) DO NOTHING;

      INSERT INTO dwh.dim_alumni (alumni_sk, natural_alumni_id, graduation_year, department, degree, career_level, experience_years, record_source)
      VALUES 
        (1, 'ALU-01', 2022, 'Computer Science', 'B.Tech', 'Mid', 3.0, 'indian_academic_benchmark'),
        (2, 'ALU-02', 2023, 'Computer Science', 'B.Tech', 'Entry', 1.0, 'indian_academic_benchmark'),
        (3, 'ALU-03', 2021, 'Data Science', 'M.Tech', 'Senior', 5.0, 'indian_academic_benchmark'),
        (4, 'ALU-04', 2022, 'Data Science', 'B.Tech', 'Mid', 2.5, 'indian_academic_benchmark'),
        (5, 'ALU-05', 2023, 'Information Technology', 'MCA', 'Entry', 1.0, 'indian_academic_benchmark')
      ON CONFLICT (alumni_sk) DO NOTHING;

      INSERT INTO dwh.bridge_alumni_skill (alumni_sk, skill_sk, proficiency_level, years_used, record_source)
      VALUES 
        (1, 1, 'Expert', 3, 'indian_academic_benchmark'),
        (1, 2, 'Expert', 3, 'indian_academic_benchmark'),
        (1, 3, 'Intermediate', 2, 'indian_academic_benchmark'),
        (2, 1, 'Intermediate', 1, 'indian_academic_benchmark'),
        (2, 2, 'Intermediate', 1, 'indian_academic_benchmark'),
        (3, 4, 'Expert', 5, 'indian_academic_benchmark'),
        (3, 5, 'Expert', 4, 'indian_academic_benchmark'),
        (4, 4, 'Intermediate', 2, 'indian_academic_benchmark'),
        (4, 5, 'Intermediate', 2, 'indian_academic_benchmark'),
        (5, 1, 'Intermediate', 1, 'indian_academic_benchmark'),
        (5, 3, 'Intermediate', 1, 'indian_academic_benchmark')
      ON CONFLICT DO NOTHING;

      INSERT INTO dwh.fact_career_outcomes (
        outcome_id, natural_outcome_id, alumni_sk, employed_within_6_months,
        observation_period_months, experience_years_at_observation, industry, record_source, is_synthetic_educational_target
      )
      VALUES 
        (1, 'FCO-01', 1, 1, 6, 3.0, 'IT Services', 'indian_academic_benchmark', true),
        (2, 'FCO-02', 2, 0, 6, 1.0, 'IT Services', 'indian_academic_benchmark', true),
        (3, 'FCO-03', 3, 1, 6, 5.0, 'Analytics', 'indian_academic_benchmark', true),
        (4, 'FCO-04', 4, 1, 6, 2.5, 'Analytics', 'indian_academic_benchmark', true),
        (5, 'FCO-05', 5, 0, 6, 1.0, 'Product', 'indian_academic_benchmark', true)
      ON CONFLICT (outcome_id) DO NOTHING;

      INSERT INTO dwh.dim_job (job_sk, natural_job_id, job_title, industry, record_source)
      VALUES
        (1, 'JOB-01', 'Software Engineer', 'IT Services', 'indian_academic_benchmark'),
        (2, 'JOB-02', 'Frontend Developer', 'Product', 'indian_academic_benchmark'),
        (3, 'JOB-03', 'Data Scientist', 'Analytics', 'indian_academic_benchmark')
      ON CONFLICT (job_sk) DO NOTHING;

      INSERT INTO dwh.bridge_job_skill (job_sk, skill_sk, record_source)
      VALUES
        (1, 1, 'indian_academic_benchmark'),
        (1, 2, 'indian_academic_benchmark'),
        (2, 2, 'indian_academic_benchmark'),
        (2, 3, 'indian_academic_benchmark'),
        (3, 4, 'indian_academic_benchmark'),
        (3, 5, 'indian_academic_benchmark')
      ON CONFLICT DO NOTHING;
    `)
  })

  after(async () => {
    await stopTestDatabase()
  })

  it('GET /api/analytics/datamining/summary returns warehouse mining inventory', async () => {
    const res = await request(app)
      .get('/api/analytics/datamining/summary')
      .expect(200)

    assert.equal(res.body.recordSource, 'indian_academic_benchmark')
    assert.ok(res.body.counts)
    assert.ok(res.body.counts.alumniProfiles >= 5)
    assert.ok(res.body.educationalNotice)
  })

  it('GET /api/analytics/datamining/clustering returns real clusters and PCA coordinates', async () => {
    const res = await request(app)
      .get('/api/analytics/datamining/clustering?k=2')
      .expect(200)

    assert.equal(res.body.algorithm, 'kmeans')
    assert.equal(res.body.parameters.k, 2)
    assert.ok(Array.isArray(res.body.clusters))
    assert.equal(res.body.clusters.length, 2)

    // Verify all alumni are clustered
    const totalClustered = res.body.clusters.reduce((sum, c) => sum + c.size, 0)
    assert.ok(totalClustered >= 5)

    // Verify 2D projections
    assert.ok(Array.isArray(res.body.projections))
    assert.ok(res.body.projections.length >= 5)
    assert.ok(typeof res.body.projections[0].x === 'number')
    assert.ok(typeof res.body.projections[0].y === 'number')
  })

  it('GET /api/analytics/datamining/clustering/evaluation computes Inertia and Silhouette across candidate k', async () => {
    const res = await request(app)
      .get('/api/analytics/datamining/clustering/evaluation?minK=2&maxK=3')
      .expect(200)

    assert.equal(res.body.algorithm, 'kmeans_evaluation')
    assert.ok(Array.isArray(res.body.candidateKList))
    assert.equal(res.body.candidateKList.length, 2)
    assert.equal(res.body.candidateKList[0].k, 2)
    assert.equal(res.body.candidateKList[1].k, 3)
    assert.ok(typeof res.body.candidateKList[0].inertia === 'number')
  })

  it('GET /api/analytics/datamining/association-rules Mode A (alumni_skills) returns rules and diagnostics', async () => {
    const res = await request(app)
      .get('/api/analytics/datamining/association-rules?mode=alumni_skills&recordSource=ALL&minSupport=0.2&minConfidence=0.4&minLift=0.5')
      .expect(200)

    assert.equal(res.body.algorithm, 'apriori')
    assert.equal(res.body.mode, 'alumni_skills')
    assert.ok(res.body.transactionsUsed >= 5)
    assert.ok(res.body.frequentItemsetsCount > 0)
    assert.ok(Array.isArray(res.body.rules))
    assert.ok(res.body.diagnostics, 'Response should contain diagnostics object')
    assert.equal(res.body.diagnostics.transactionCount, res.body.transactionsUsed)
    assert.ok(typeof res.body.diagnostics.candidateRulesGenerated === 'number')
    assert.ok(typeof res.body.diagnostics.rejectedByConfidence === 'number')
    assert.ok(typeof res.body.diagnostics.rejectedByLift === 'number')
    assert.ok(res.body.diagnostics.itemsetsBySize)

    if (res.body.rules.length > 0) {
      const firstRule = res.body.rules[0]
      assert.ok(Array.isArray(firstRule.antecedent))
      assert.ok(Array.isArray(firstRule.consequent))
      assert.ok(typeof firstRule.support === 'number')
      assert.ok(typeof firstRule.confidence === 'number')
      assert.ok(typeof firstRule.lift === 'number')
      assert.ok(firstRule.support >= 0.2)
      assert.ok(firstRule.confidence >= 0.4)
      assert.ok(firstRule.lift >= 0.5)

      // Antecedent and consequent must not intersect
      const ant = new Set(firstRule.antecedent)
      for (const item of firstRule.consequent) {
        assert.equal(ant.has(item), false, 'Antecedent and consequent must be disjoint')
      }
    }
  })

  it('GET /api/analytics/datamining/association-rules Mode B (job_skills) returns diagnostics when threshold produces 0 rules', async () => {
    // With 3 jobs and high support 0.8, no 2-itemset qualifies -> candidateRulesGenerated: 0
    const res = await request(app)
      .get('/api/analytics/datamining/association-rules?mode=job_skills&recordSource=ALL&minSupport=0.8&minConfidence=0.5&minLift=1.1')
      .expect(200)

    assert.equal(res.body.algorithm, 'apriori')
    assert.equal(res.body.mode, 'job_skills')
    assert.equal(res.body.rulesCount, 0)
    assert.ok(res.body.diagnostics)
    assert.equal(res.body.diagnostics.candidateRulesGenerated, 0)
    assert.equal(res.body.diagnostics.qualifiedRulesCount, 0)
  })

  it('GET /api/analytics/datamining/classification/metadata returns target schema & synthetic disclosure', async () => {
    const res = await request(app)
      .get('/api/analytics/datamining/classification/metadata')
      .expect(200)

    assert.equal(res.body.target.column, 'employed_within_6_months')
    assert.equal(res.body.target.isSyntheticEducationalTarget, true)
    assert.ok(res.body.target.totalLabeledRecords >= 5)
  })

  it('POST /api/analytics/datamining/classification/train rejects invalid testRatio', async () => {
    const res = await request(app)
      .post('/api/analytics/datamining/classification/train')
      .send({ testRatio: 0.95 })
      .expect(400)

    assert.equal(res.body.success, false)
  })

  it('POST /api/analytics/datamining/classification/predict returns probability and predicted class', async () => {
    const res = await request(app)
      .post('/api/analytics/datamining/classification/predict')
      .send({
        skills: ['Python', 'Machine Learning'],
        experience_years: 3.0,
      })
      .expect(200)

    assert.equal(res.body.success, true)
    assert.ok(typeof res.body.data.prediction === 'number')
    assert.ok(typeof res.body.data.probability === 'number')
    assert.ok(res.body.data.modelContext.educationalNotice)
  })
})
