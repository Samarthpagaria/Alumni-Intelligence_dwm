import { describe, it, expect } from 'vitest'
import { formatOlapKey } from './AnalyticsOLAP.jsx'

describe('AnalyticsOLAP: Key Formatting and Type Safety Tests', () => {
  describe('Graduation Year / Date Dimension (Numeric & Date Values)', () => {
    it('TC-OLAP-01: Correctly formats integer year numbers without calling .replace()', () => {
      expect(formatOlapKey(2026, 'year')).toBe('2026')
      expect(formatOlapKey(2025, 'year')).toBe('2025')
      expect(formatOlapKey(2021, 'year')).toBe('2021')
      expect(typeof formatOlapKey(2026, 'year')).toBe('string')
    })

    it('TC-OLAP-02: Handles string year values', () => {
      expect(formatOlapKey('2026', 'year')).toBe('2026')
      expect(formatOlapKey('2024', 'year')).toBe('2024')
    })

    it('TC-OLAP-03: Extracts year from ISO date strings without timezone shifts', () => {
      expect(formatOlapKey('2025-06-15', 'year')).toBe('2025')
      expect(formatOlapKey('2025-01-01T00:00:00.000Z', 'year')).toBe('2025')
      expect(formatOlapKey('2024-12-31T23:59:59.999Z', 'year')).toBe('2024')
    })

    it('TC-OLAP-04: Formats JavaScript Date instances accurately', () => {
      const d1 = new Date(Date.UTC(2025, 5, 15))
      expect(formatOlapKey(d1, 'year')).toBe('2025')

      const d2 = new Date(Date.UTC(2023, 0, 1))
      expect(formatOlapKey(d2, 'year')).toBe('2023')
    })

    it('TC-OLAP-05: Handles invalid date objects gracefully as Unassigned', () => {
      const invalidDate = new Date('not-a-valid-date')
      expect(formatOlapKey(invalidDate, 'year')).toBe('Unassigned')
    })
  })

  describe('Null, Undefined, and Malformed Values', () => {
    it('TC-OLAP-06: Returns "Unassigned" for null, undefined, empty strings, and NaN', () => {
      expect(formatOlapKey(null, 'year')).toBe('Unassigned')
      expect(formatOlapKey(undefined, 'year')).toBe('Unassigned')
      expect(formatOlapKey('', 'year')).toBe('Unassigned')
      expect(formatOlapKey('   ', 'year')).toBe('Unassigned')
      expect(formatOlapKey(NaN, 'year')).toBe('Unassigned')
      expect(formatOlapKey('null', 'year')).toBe('Unassigned')
      expect(formatOlapKey('undefined', 'year')).toBe('Unassigned')
      expect(formatOlapKey(null, 'department')).toBe('Unassigned')
    })
  })

  describe('Department Dimension & Compact Chart Abbreviation', () => {
    it('TC-OLAP-07: Compact abbreviation works in charts and preserves full name in tables', () => {
      const dept = 'Computer Engineering'
      expect(formatOlapKey(dept, 'department', { compact: true })).toBe('Computer Eng')
      expect(formatOlapKey(dept, 'department', { compact: false })).toBe('Computer Engineering')

      const itDept = 'Information Technology'
      expect(formatOlapKey(itDept, 'department', { compact: true })).toBe('Info Technology')
      expect(formatOlapKey(itDept, 'department', { compact: false })).toBe('Information Technology')
    })
  })

  describe('Source Provenance Mapping', () => {
    it('TC-OLAP-08: Formats data source tags into clean human-readable titles', () => {
      expect(formatOlapKey('csv_import', 'source')).toBe('CSV Import')
      expect(formatOlapKey('indian_academic_benchmark', 'source')).toBe('Academic Benchmark')
      expect(formatOlapKey('synthetic_indian_academic_demo', 'source')).toBe('Academic Benchmark')
      expect(formatOlapKey('operational', 'source')).toBe('Operational')
    })
  })

  describe('Other Dimension Preservations', () => {
    it('TC-OLAP-09: Preserves string labels for tier, company, industry, degree', () => {
      expect(formatOlapKey('Super Dream', 'tier')).toBe('Super Dream')
      expect(formatOlapKey('Google', 'company')).toBe('Google')
      expect(formatOlapKey('Technology', 'industry')).toBe('Technology')
      expect(formatOlapKey('B.Tech', 'degree')).toBe('B.Tech')
    })
  })

  describe('BarChart Data Transformation Simulation', () => {
    it('TC-OLAP-10: Simulates BarChart transformation for numeric years without throwing TypeError', () => {
      const mockAggregatedData = [
        { key: 2026, avgLpa: 14.8, totalOffers: 120 },
        { key: 2025, avgLpa: 13.5, totalOffers: 110 },
        { key: 2024, avgLpa: 12.1, totalOffers: 95 },
        { key: null, avgLpa: 0, totalOffers: 0 },
      ]

      // This transformation must not throw TypeError: d.key.replace is not a function
      expect(() => {
        const chartData = mockAggregatedData.map((d) => ({
          label: formatOlapKey(d.key, 'year', { compact: true }),
          value: d.avgLpa || 0,
        }))

        expect(chartData).toEqual([
          { label: '2026', value: 14.8 },
          { label: '2025', value: 13.5 },
          { label: '2024', value: 12.1 },
          { label: 'Unassigned', value: 0 },
        ])
      }).not.toThrow()
    })
  })
})
