import { describe, test, expect } from 'vitest'
import { serializeState, deserializeState, DEFAULTS } from './urlState.js'

const allPlants = [
  { name: 'Tomato', light: 'direct', rowSpacingIn: 36, inRowSpacingIn: 24, daysToHarvest: '70–85 days', calendar: { sow: Array(12).fill(false), grow: Array(12).fill(false), harvest: Array(12).fill(false) } },
  { name: 'Pepper', light: 'direct', rowSpacingIn: 18, inRowSpacingIn: 18, daysToHarvest: '70–90 days', calendar: { sow: Array(12).fill(false), grow: Array(12).fill(false), harvest: Array(12).fill(false) } },
  { name: 'Lettuce', light: 'partial', rowSpacingIn: 12, inRowSpacingIn: 8, daysToHarvest: '45–60 days', calendar: { sow: Array(12).fill(false), grow: Array(12).fill(false), harvest: Array(12).fill(false) } },
]

describe('serializeState', () => {
  test('serializes all fields', () => {
    const params = serializeState({
      widthIn: 40, lengthIn: 80, lightFilter: 'direct',
      selectedPlants: [allPlants[0], allPlants[1]],
    })
    expect(params.get('w')).toBe('40')
    expect(params.get('l')).toBe('80')
    expect(params.get('light')).toBe('direct')
    expect(params.get('plants')).toBe('Tomato,Pepper')
  })

  test('omits plants param when none selected', () => {
    const params = serializeState({ widthIn: 40, lengthIn: 80, lightFilter: 'partial', selectedPlants: [] })
    expect(params.has('plants')).toBe(false)
  })
})

describe('deserializeState', () => {
  test('recovers full state from serialized string', () => {
    const params = serializeState({ widthIn: 40, lengthIn: 80, lightFilter: 'direct', selectedPlants: [allPlants[0]] })
    const state = deserializeState(params.toString(), allPlants)
    expect(state.widthIn).toBe(40)
    expect(state.lengthIn).toBe(80)
    expect(state.lightFilter).toBe('direct')
    expect(state.selectedPlants).toHaveLength(1)
    expect(state.selectedPlants[0].name).toBe('Tomato')
  })

  test('falls back to defaults when params are missing', () => {
    const state = deserializeState('', allPlants)
    expect(state.widthIn).toBe(DEFAULTS.widthIn)
    expect(state.lengthIn).toBe(DEFAULTS.lengthIn)
    expect(state.lightFilter).toBe(DEFAULTS.lightFilter)
    expect(state.selectedPlants).toEqual([])
  })

  test('falls back to defaults for invalid light value', () => {
    const state = deserializeState('light=bogus', allPlants)
    expect(state.lightFilter).toBe(DEFAULTS.lightFilter)
  })

  test('falls back to defaults for non-numeric dimensions', () => {
    const state = deserializeState('w=abc&l=xyz', allPlants)
    expect(state.widthIn).toBe(DEFAULTS.widthIn)
    expect(state.lengthIn).toBe(DEFAULTS.lengthIn)
  })

  test('filters out unknown plant names silently', () => {
    const state = deserializeState('plants=Tomato,UnknownPlant', allPlants)
    expect(state.selectedPlants).toHaveLength(1)
    expect(state.selectedPlants[0].name).toBe('Tomato')
  })

  test('handles plants from different light conditions', () => {
    const state = deserializeState('plants=Tomato,Lettuce', allPlants)
    expect(state.selectedPlants).toHaveLength(2)
  })

  test('returns empty selectedPlants when plants param is absent', () => {
    const state = deserializeState('w=40&l=80&light=direct', allPlants)
    expect(state.selectedPlants).toEqual([])
  })
})
