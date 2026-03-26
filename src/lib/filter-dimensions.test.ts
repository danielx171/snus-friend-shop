import { describe, it, expect } from 'vitest'
import { parseFilterSegments } from './filter-dimensions'

describe('parseFilterSegments', () => {
  it('parses single flavor segment', () => {
    const result = parseFilterSegments(['mint'])
    expect(result).toEqual({
      filters: { flavor: 'mint' },
      canonical: 'mint',
    })
  })

  it('parses single strength segment', () => {
    const result = parseFilterSegments(['strong'])
    expect(result).toEqual({
      filters: { strength: 'strong' },
      canonical: 'strong',
    })
  })

  it('parses multi-segment filters', () => {
    const result = parseFilterSegments(['mint', 'strong'])
    expect(result).toEqual({
      filters: { flavor: 'mint', strength: 'strong' },
      canonical: 'strong/mint',  // strength before flavor in canonical order
    })
  })

  it('returns null for unknown segment', () => {
    expect(parseFilterSegments(['unknown'])).toBeNull()
  })

  it('returns null for duplicate dimension', () => {
    expect(parseFilterSegments(['mint', 'berry'])).toBeNull()
  })

  it('returns null for empty segments', () => {
    expect(parseFilterSegments([])).toBeNull()
  })

  it('handles urlToDb mapping', () => {
    const result = parseFilterSegments(['extra-strong'])
    expect(result).toEqual({
      filters: { strength: 'extraStrong' },
      canonical: 'extra-strong',
    })
  })

  it('produces canonical ordering regardless of input order', () => {
    const result = parseFilterSegments(['slim', 'strong', 'mint'])
    expect(result?.canonical).toBe('strong/mint/slim')
  })
})
