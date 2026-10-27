import { useState } from 'react'

export default function AnalyticsDataDictionary() {
  const [activeSchemaTab, setActiveSchemaTab] = useState('fact_placement')

  const tables = [
    {
      name: 'fact_placement',
      type: 'FACT TABLE',
      grain: 'One record per student job offer or placement outcome.',
      primaryKey: 'placement_id (SERIAL)',
      foreignKeys: ['student_sk -> dwh.dim_student', 'company_sk -> dwh.dim_company', 'offer_date_sk -> dwh.dim_date'],
      measures: [
        { name: 'annual_package_lpa', type: 'NUMERIC(8,2)', desc: 'Total CTC package in Lakhs Per Annum' },
        { name: 'base_salary_inr', type: 'NUMERIC(12,2)', desc: 'Fixed base compensation' },
        { name: 'bonus_inr', type: 'NUMERIC(12,2)', desc: 'Variable joining or performance bonus' },
        { name: 'readiness_score', type: 'INT', desc: 'Score (0-100) from AI career roadmap evaluation' },
        { name: 'offers_count', type: 'INT', desc: 'Number of discrete offers extended' },
      ],
      description: 'The core transactional fact capturing campus and off-campus recruitment outcomes.',
    },
    {
      name: 'fact_job_application',
      type: 'FACT TABLE',
      grain: 'One record per job application submitted by a student.',
      primaryKey: 'application_id (SERIAL)',
      foreignKeys: ['student_sk -> dwh.dim_student', 'company_sk -> dwh.dim_company', 'applied_date_sk -> dwh.dim_date'],
      measures: [
        { name: 'ats_match_score', type: 'INT', desc: 'Resume ATS score (0-100) against posting' },
        { name: 'days_to_decision', type: 'INT', desc: 'Days elapsed between application and review' },
        { name: 'is_shortlisted', type: 'INT', desc: 'Binary indicator (0 or 1)' },
        { name: 'is_selected', type: 'INT', desc: 'Binary indicator (0 or 1)' },
      ],
      description: 'Tracks hiring funnel efficiency, drop-off rates, and ATS resume compatibility.',
    },
    {
      name: 'dim_student',
      type: 'DIMENSION',
      grain: 'One record per enrolled or graduating student scholar.',
      primaryKey: 'student_sk (SERIAL)',
      foreignKeys: ['source_user_id -> public.users.id'],
      measures: [
        { name: 'cgpa', type: 'NUMERIC(4,2)', desc: 'Cumulative Grade Point Average (0.00 - 10.00)' },
        { name: 'department', type: 'VARCHAR(100)', desc: 'Academic division (e.g. Computer Engineering)' },
        { name: 'admission_year', type: 'INT', desc: 'Entrance year' },
        { name: 'graduation_year', type: 'INT', desc: 'Expected or actual cohort completion year' },
        { name: 'placement_status', type: 'VARCHAR(30)', desc: 'Status: Placed, Not Placed, Higher Studies' },
      ],
      description: 'Represents the student candidate population and academic demographics.',
    },
    {
      name: 'dim_alumni',
      type: 'DIMENSION (SCD-2)',
      grain: 'One record per verified alumnus career milestone.',
      primaryKey: 'alumni_sk (SERIAL)',
      foreignKeys: ['source_user_id -> public.users.id'],
      measures: [
        { name: 'current_company', type: 'VARCHAR(150)', desc: 'Current employing organization' },
        { name: 'current_role', type: 'VARCHAR(150)', desc: 'Current title / position' },
        { name: 'industry', type: 'VARCHAR(100)', desc: 'Industry sector' },
        { name: 'experience_years', type: 'NUMERIC(4,1)', desc: 'Total professional post-grad experience' },
        { name: 'is_mentor', type: 'BOOLEAN', desc: 'Flag indicating availability for student mentorship' },
      ],
      description: 'Tracks graduate career progression, employer transitions, and mentorship activity.',
    },
    {
      name: 'dim_company',
      type: 'DIMENSION',
      grain: 'One record per recruiting enterprise employer.',
      primaryKey: 'company_sk (SERIAL)',
      foreignKeys: [],
      measures: [
        { name: 'company_name', type: 'VARCHAR(150)', desc: 'Standardized corporate name' },
        { name: 'industry', type: 'VARCHAR(100)', desc: 'Primary operating domain' },
        { name: 'company_tier', type: 'VARCHAR(50)', desc: 'Super Dream, Dream, or Mass / Core' },
        { name: 'headquarters_location', type: 'VARCHAR(150)', desc: 'Global corporate HQ' },
      ],
      description: 'Standardizes employer profiles and corporate tier benchmarks.',
    },
    {
      name: 'dim_skill',
      type: 'DIMENSION',
      grain: 'One record per distinct technical competency.',
      primaryKey: 'skill_sk (SERIAL)',
      foreignKeys: [],
      measures: [
        { name: 'skill_name', type: 'VARCHAR(100)', desc: 'Standardized competency name (e.g. Python, Docker)' },
        { name: 'category', type: 'VARCHAR(50)', desc: 'Domain: Languages, Frameworks, Cloud, Databases' },
      ],
      description: 'Reference taxonomy for skill demand tracking and Apriori association mining.',
    },
    {
      name: 'dim_date',
      type: 'DIMENSION (CALENDAR)',
      grain: 'One record per calendar day spanning 2018-2030.',
      primaryKey: 'date_sk (INTEGER, YYYYMMDD)',
      foreignKeys: [],
      measures: [
        { name: 'full_date', type: 'DATE', desc: 'Calendar date' },
        { name: 'year', type: 'INT', desc: 'Calendar year' },
        { name: 'quarter', type: 'INT', desc: 'Quarter (1-4)' },
        { name: 'month', type: 'INT', desc: 'Month index (1-12)' },
        { name: 'academic_year', type: 'VARCHAR(20)', desc: 'Academic session string (e.g. 2024-2025)' },
        { name: 'academic_semester', type: 'VARCHAR(20)', desc: 'Odd/Fall or Even/Spring term' },
      ],
      description: 'Temporal dimension supporting roll-ups across days, months, semesters, and cohort years.',
    },
    {
      name: 'bridge_student_skill',
      type: 'BRIDGE (M:N)',
      grain: 'One record per student-to-skill competency mapping.',
      primaryKey: 'Composite (student_sk, skill_sk)',
      foreignKeys: ['student_sk -> dwh.dim_student', 'skill_sk -> dwh.dim_skill'],
      measures: [
        { name: 'proficiency_level', type: 'VARCHAR(30)', desc: 'Beginner, intermediate, advanced, or expert' },
      ],
      description: 'De-normalizes many-to-many relationship between student scholars and technical skills.',
    },
    {
      name: 'fact_salary_benchmark',
      type: 'FACT TABLE',
      grain: 'One record per corporate salary compensation benchmark observation.',
      primaryKey: 'salary_id (SERIAL)',
      foreignKeys: ['company_sk -> dwh.dim_company', 'alumni_sk -> dwh.dim_alumni', 'effective_date_sk -> dwh.dim_date'],
      measures: [
        { name: 'total_annual_comp_inr', type: 'NUMERIC(12,2)', desc: 'Total annual CTC compensation in INR' },
        { name: 'experience_years', type: 'NUMERIC(4,1)', desc: 'Years of post-grad experience' },
        { name: 'salary_band_tier', type: 'VARCHAR(30)', desc: 'Tier bracket (e.g. > 20 LPA, 12-20 LPA)' },
      ],
      description: 'Tracks market compensation ranges by employer, seniority, and industry sector.',
    },
  ]

  const activeTable = tables.find((t) => t.name === activeSchemaTab) || tables[0]

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* TITLE */}
      <div className="border-b border-neutral-800 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-white font-sans">
          Warehouse Data Dictionary & Metric Governance
        </h1>
        <p className="text-xs text-neutral-400 font-mono mt-0.5">
          Formal specification of dimensional models, fact grains, surrogate keys, and mathematical formulas.
        </p>
      </div>

      {/* METRIC FORMULAS STRIP */}
      <div className="rounded-sm border border-neutral-800 bg-[#121214] p-5 space-y-3 font-mono text-xs">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2">
          Mathematical Metrics & Analytical Formulas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-neutral-300">
          <div className="rounded bg-neutral-900 border border-neutral-800 p-3 space-y-1">
            <span className="text-[10px] text-sky-400 font-bold block">1. PLACEMENT RATE (%)</span>
            <div className="text-xs text-white">Placed Students &divide; Total Eligible &times; 100</div>
            <p className="text-[10px] text-neutral-500 mt-1">Excludes scholars opting out for higher studies.</p>
          </div>

          <div className="rounded bg-neutral-900 border border-neutral-800 p-3 space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold block">2. APRIORI LIFT FACTOR</span>
            <div className="text-xs text-white">Confidence(X &rArr; Y) &divide; Support(Y)</div>
            <p className="text-[10px] text-neutral-500 mt-1">Values &gt; 1.0 indicate positive statistical association.</p>
          </div>

          <div className="rounded bg-neutral-900 border border-neutral-800 p-3 space-y-1">
            <span className="text-[10px] text-purple-400 font-bold block">3. WEIGHTED AVG CTC (LPA)</span>
            <div className="text-xs text-white">&sum; (Package &times; Offers) &divide; &sum; Offers</div>
            <p className="text-[10px] text-neutral-500 mt-1">Normalized across multi-tier placement distributions.</p>
          </div>
        </div>
      </div>

      {/* SCHEMA EXPLORER TABS */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-2 font-mono text-xs">
          {tables.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setActiveSchemaTab(t.name)}
              className={`rounded px-3 py-1.5 transition-colors cursor-pointer ${
                activeSchemaTab === t.name
                  ? 'bg-white text-black font-bold'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              dwh.{t.name}
            </button>
          ))}
        </div>

        {/* ACTIVE TABLE CARD */}
        <div className="rounded-sm border border-neutral-800 bg-[#121214] p-5 font-mono text-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">dwh.{activeTable.name}</span>
                <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-neutral-300 font-bold">
                  {activeTable.type}
                </span>
              </div>
              <p className="text-neutral-400 mt-0.5">{activeTable.description}</p>
            </div>
            <div className="text-right text-[11px] text-neutral-500">
              Grain: <span className="text-neutral-300">{activeTable.grain}</span>
            </div>
          </div>

          {/* KEYS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-900/60 border border-neutral-800 p-3 rounded">
            <div>
              <span className="text-neutral-500 text-[10px] block uppercase font-bold">Primary Key (Surrogate):</span>
              <span className="text-emerald-400 font-bold">{activeTable.primaryKey}</span>
            </div>
            <div>
              <span className="text-neutral-500 text-[10px] block uppercase font-bold">Foreign Key References:</span>
              <span className="text-neutral-300">
                {activeTable.foreignKeys.length > 0 ? activeTable.foreignKeys.join(', ') : 'None (Independent Reference Dimension)'}
              </span>
            </div>
          </div>

          {/* MEASURES & COLUMNS */}
          <div className="space-y-2">
            <span className="text-neutral-400 font-bold block text-xs uppercase tracking-wider">
              Attributes, Measures & Data Types:
            </span>
            <div className="overflow-x-auto border border-neutral-800 rounded bg-[#09090b]">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-neutral-900 text-neutral-400 border-b border-neutral-800">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Field Name</th>
                    <th className="px-3 py-2 font-semibold">Data Type</th>
                    <th className="px-3 py-2 font-semibold">Semantic Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                  {activeTable.measures.map((m) => (
                    <tr key={m.name} className="hover:bg-neutral-800/30">
                      <td className="px-3 py-1.5 font-bold text-white">{m.name}</td>
                      <td className="px-3 py-1.5 text-sky-400">{m.type}</td>
                      <td className="px-3 py-1.5 text-neutral-400">{m.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
