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

  test('single plant fills multiple rows until plot is full', () => {
    // 80" plot, 18" spacing → 4 rows (72"), 8" unused
    const result = buildRows([tomato], 40, 80)
    expect(result.rows).toHaveLength(4)
    expect(result.rows.every(r => r.plant.name === 'Tomato')).toBe(true)
    expect(result.unusedIn).toBe(8)
    expect(result.overflowPlants).toHaveLength(0)
  })

  test('round-robin distributes rows across plants', () => {
    // 60" plot, tomato 18" + pepper 12"
    // Pass1: T(used=18), P(used=30) | Pass2: T(used=48), P(used=60) | Pass3: T(78>60 skip), P(72>60 skip) → stop
    const result = buildRows([tomato, pepper], 40, 60)
    const names = result.rows.map(r => r.plant.name)
    expect(names[0]).toBe('Tomato')
    expect(names[1]).toBe('Pepper')
    expect(names[2]).toBe('Tomato')
    expect(names[3]).toBe('Pepper')
    expect(result.unusedIn).toBe(0)
  })

  test('plant with spacing larger than plot goes to overflowPlants', () => {
    // pumpkin needs 60", plot is 40"
    const result = buildRows([pumpkin], 40, 40)
    expect(result.rows).toHaveLength(0)
    expect(result.overflowPlants).toHaveLength(1)
    expect(result.overflowPlants[0].name).toBe('Pumpkin')
  })

  test('plant that fits is not in overflowPlants even if it gets fewer rows', () => {
    const result = buildRows([tomato, pepper], 40, 80)
    expect(result.overflowPlants).toHaveLength(0)
  })

  test('plantCount is at least 1 when inRowSpacingIn > widthIn', () => {
    const widePlant = { name: 'WidePlant', rowSpacingIn: 12, inRowSpacingIn: 100 }
    const result = buildRows([widePlant], 40, 40)
    expect(result.rows[0].plantCount).toBe(1)
  })

  test('row numbers are sequential starting at 1', () => {
    const result = buildRows([tomato], 40, 40)
    expect(result.rows[0].rowNumber).toBe(1)
    expect(result.rows[1].rowNumber).toBe(2)
  })
})
