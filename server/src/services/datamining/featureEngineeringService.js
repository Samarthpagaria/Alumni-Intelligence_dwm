/**
 * Feature Engineering & Matrix Preprocessing Service.
 * Provides deterministic transformations, one-hot encoding, feature scaling,
 * and Principal Component Analysis (PCA) for 2D cluster visualization.
 */

/**
 * Builds a binary skill indicator matrix and scaled numerical features from alumni profiles.
 *
 * @param {Array<Object>} alumniList - List of alumni with skills arrays
 * @param {Object} options
 * @param {number} options.topSkillsCount - Number of most frequent skills to use as features (default 40)
 * @param {boolean} options.includeExperience - Whether to scale and include experience_years
 */
export function buildAlumniFeatureMatrix(alumniList = [], { topSkillsCount = 40, includeExperience = true } = {}) {
  if (alumniList.length === 0) {
    return {
      featureNames: [],
      matrix: [],
      alumniMetadata: [],
      topSkills: [],
      scalerParams: {},
    }
  }

  // 1. Identify top most frequent skills across the dataset
  const skillFrequency = new Map()
  for (const alum of alumniList) {
    const skills = alum.skills || []
    for (const s of skills) {
      const name = s.skill_name
      if (name) {
        skillFrequency.set(name, (skillFrequency.get(name) || 0) + 1)
      }
    }
  }

  const sortedSkills = [...skillFrequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topSkillsCount)
    .map(([name]) => name)

  const skillIndexMap = new Map(sortedSkills.map((name, idx) => [name, idx]))

  // 2. Compute min-max scaling parameters for experience_years if included
  let minExp = Infinity
  let maxExp = -Infinity
  if (includeExperience) {
    for (const alum of alumniList) {
      const exp = Number(alum.experience_years) || 0
      if (exp < minExp) minExp = exp
      if (exp > maxExp) maxExp = exp
    }
    if (minExp === maxExp) maxExp = minExp + 1 // Prevent division by zero
  }

  const featureNames = [...sortedSkills]
  if (includeExperience) {
    featureNames.push('norm_experience_years')
  }

  // 3. Assemble numeric feature vectors
  const matrix = []
  const alumniMetadata = []

  for (const alum of alumniList) {
    const vector = new Array(featureNames.length).fill(0)
    const alumSkillNames = new Set((alum.skills || []).map((s) => s.skill_name))

    for (const [skillName, colIdx] of skillIndexMap.entries()) {
      if (alumSkillNames.has(skillName)) {
        vector[colIdx] = 1.0
      }
    }

    if (includeExperience) {
      const exp = Number(alum.experience_years) || 0
      const scaledExp = (exp - minExp) / (maxExp - minExp)
      vector[vector.length - 1] = Number(scaledExp.toFixed(4))
    }

    matrix.push(vector)
    alumniMetadata.push({
      alumni_sk: alum.alumni_sk,
      natural_alumni_id: alum.natural_alumni_id,
      department: alum.department,
      degree: alum.degree,
      career_level: alum.career_level,
      experience_years: Number(alum.experience_years) || 0,
      skills: [...alumSkillNames],
    })
  }

  return {
    featureNames,
    matrix,
    alumniMetadata,
    topSkills: sortedSkills,
    scalerParams: includeExperience ? { minExp, maxExp } : {},
  }
}

/**
 * Computes Principal Component Analysis (PCA) to project a multi-dimensional matrix
 * onto 2 principal dimensions (PC1, PC2) for scatter plot visualization.
 * Uses mean centering and power iteration to extract the first 2 eigenvectors.
 *
 * @param {Array<Array<number>>} matrix - N x D feature matrix
 * @param {number} maxIterations - Max iterations for power iteration
 */
export function computePCA2D(matrix = [], maxIterations = 50) {
  const n = matrix.length
  if (n < 2) return matrix.map(() => ({ x: 0, y: 0 }))
  const d = matrix[0].length

  // 1. Mean-center the feature matrix
  const means = new Array(d).fill(0)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < d; j++) {
      means[j] += matrix[i][j]
    }
  }
  for (let j = 0; j < d; j++) {
    means[j] /= n
  }

  const centered = matrix.map((row) => row.map((val, j) => val - means[j]))

  // 2. Power iteration to extract dominant eigenvector (PC1)
  function extractPrincipalComponent(data) {
    let v = new Array(d).fill(0).map((_, idx) => (idx % 2 === 0 ? 0.5 : -0.5))
    // Normalize
    let norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1
    v = v.map((x) => x / norm)

    for (let iter = 0; iter < maxIterations; iter++) {
      // Multiply by covariance matrix: C * v = (1/N) * X^T * (X * v)
      const Xv = new Array(n).fill(0)
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < d; j++) {
          Xv[i] += data[i][j] * v[j]
        }
      }

      const XtXv = new Array(d).fill(0)
      for (let j = 0; j < d; j++) {
        for (let i = 0; i < n; i++) {
          XtXv[j] += data[i][j] * Xv[i]
        }
      }

      const nextNorm = Math.sqrt(XtXv.reduce((s, x) => s + x * x, 0))
      if (nextNorm === 0) break
      v = XtXv.map((x) => x / nextNorm)
    }
    return v
  }

  const pc1 = extractPrincipalComponent(centered)

  // 3. Deflate data by removing projection onto PC1 to find PC2
  const deflated = centered.map((row) => {
    const dot = row.reduce((s, x, j) => s + x * pc1[j], 0)
    return row.map((x, j) => x - dot * pc1[j])
  })

  const pc2 = extractPrincipalComponent(deflated)

  // 4. Project original data onto (PC1, PC2)
  return centered.map((row) => {
    const x = row.reduce((s, val, j) => s + val * pc1[j], 0)
    const y = row.reduce((s, val, j) => s + val * pc2[j], 0)
    return {
      x: Number(x.toFixed(3)),
      y: Number(y.toFixed(3)),
    }
  })
}

/**
 * Builds training and test sets with stratified sampling for classification.
 *
 * @param {Array<Object>} records - Labeled records
 * @param {Object} options
 * @param {number} options.testRatio - Fraction to hold out for testing (default 0.20)
 * @param {number} options.randomSeed - Seed for reproducible pseudo-random shuffle
 */
export function stratifiedTrainTestSplit(records = [], { testRatio = 0.20, randomSeed = 2026 } = {}) {
  const class0 = []
  const class1 = []

  for (const r of records) {
    if (r.target === 1) class1.push(r)
    else class0.push(r)
  }

  // Linear congruential generator for deterministic pseudo-random shuffling
  function shuffle(array, seed) {
    let s = seed
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280
      const rnd = s / 233280
      const j = Math.floor(rnd * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  const shuffled0 = shuffle(class0, randomSeed)
  const shuffled1 = shuffle(class1, randomSeed + 1)

  const split0 = Math.floor(shuffled0.length * (1 - testRatio))
  const split1 = Math.floor(shuffled1.length * (1 - testRatio))

  const trainRecords = [...shuffled0.slice(0, split0), ...shuffled1.slice(0, split1)]
  const testRecords = [...shuffled0.slice(split0), ...shuffled1.slice(split1)]

  return {
    trainRecords: shuffle(trainRecords, randomSeed + 2),
    testRecords: shuffle(testRecords, randomSeed + 3),
    classDistribution: {
      total: records.length,
      class0: class0.length,
      class1: class1.length,
      trainClass0: split0,
      trainClass1: split1,
      testClass0: shuffled0.length - split0,
      testClass1: shuffled1.length - split1,
    },
  }
}
