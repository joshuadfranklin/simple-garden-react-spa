import { describe, test, expect } from 'vitest'
import { buildRows } from './gardenLayout.js'

const tomato = { name: 'Tomato', rowSpacingIn: 18, inRowSpacingIn: 24 }
const pepper = { name: 'Pepper', rowSpacingIn: 12, inRowSpacingIn: 18 }
const pumpkin = { name: 'Pumpkin', rowSpacingIn: 60, inRowSpacingIn: 48 }

describe('buildRows', () => {
  test('returns empty rows for empty plant list', () => {
    const result = buildRows([], 40, 80)
    expect(result.rows).toHaveLength(0)
    expect(result.unusedIn).toBe(80)
    expect(result.overflowPlants).toHaveLength(0)
  })

  test('single plant produces one row', () => {
    const result = buildRows([tomato], 40, 80)
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].plant.name).toBe('Tomato')
    expect(result.unusedIn).toBe(62)
    expect(result.overflowPlants).toHaveLength(0)
  })

  test('duplicate entries produce multiple rows', () => {
    // [tomato, tomato] → 2 rows, 36" used, 44" unused
    const result = buildRows([tomato, tomato], 40, 80)
    expect(result.rows).toHaveLength(2)
    expect(result.rows.every(r => r.plant.name === 'Tomato')).toBe(true)
    expect(result.unusedIn).toBe(44)
  })

  test('rows follow selectedPlants order', () => {
    const result = buildRows([tomato, pepper], 40, 80)
    expect(result.rows[0].plant.name).toBe('Tomato')
    expect(result.rows[1].plant.name).toBe('Pepper')
    expect(result.unusedIn).toBe(50)
  })

  test('plant with spacing larger than remaining plot goes to overflowPlants', () => {
    const result = buildRows([pumpkin], 40, 40)
    expect(result.rows).toHaveLength(0)
    expect(result.overflowPlants).toHaveLength(1)
    expect(result.overflowPlants[0].name).toBe('Pumpkin')
  })

  test('plant that fits is not in overflowPlants', () => {
    const result = buildRows([tomato, pepper], 40, 80)
    expect(result.overflowPlants).toHaveLength(0)
  })

  test('plantCount is at least 1 when inRowSpacingIn > widthIn', () => {
    const widePlant = { name: 'WidePlant', rowSpacingIn: 12, inRowSpacingIn: 100 }
    const result = buildRows([widePlant], 40, 40)
    expect(result.rows[0].plantCount).toBe(1)
  })

  test('row numbers are sequential starting at 1', () => {
    const result = buildRows([tomato, pepper], 40, 80)
    expect(result.rows[0].rowNumber).toBe(1)
    expect(result.rows[1].rowNumber).toBe(2)
  })
})
