export const DEFAULTS = {
  widthIn: 40,
  lengthIn: 80,
  lightFilter: 'direct',
  selectedPlants: [],
}

const VALID_LIGHT = ['direct', 'partial', 'low']

/**
 * @param {{ widthIn: number, lengthIn: number, lightFilter: string, selectedPlants: Array }} state
 * @returns {URLSearchParams}
 */
export function serializeState({ widthIn, lengthIn, lightFilter, selectedPlants }) {
  const params = new URLSearchParams()
  params.set('w', String(widthIn))
  params.set('l', String(lengthIn))
  params.set('light', lightFilter)
  if (selectedPlants.length > 0) {
    params.set('plants', selectedPlants.map(p => p.name).join(','))
  }
  return params
}

/**
 * @param {string} search - URL search string (with or without leading ?)
 * @param {Array} allPlants - full plant list from plants.json
 * @returns {{ widthIn: number, lengthIn: number, lightFilter: string, selectedPlants: Array }}
 */
export function deserializeState(search, allPlants) {
  const params = new URLSearchParams(search)

  const wRaw = parseInt(params.get('w'), 10)
  const lRaw = parseInt(params.get('l'), 10)
  const lightRaw = params.get('light')
  const plantsRaw = params.get('plants')

  const widthIn = Number.isFinite(wRaw) && wRaw >= 10 ? wRaw : DEFAULTS.widthIn
  const lengthIn = Number.isFinite(lRaw) && lRaw >= 10 ? lRaw : DEFAULTS.lengthIn
  const lightFilter = VALID_LIGHT.includes(lightRaw) ? lightRaw : DEFAULTS.lightFilter

  let selectedPlants = []
  if (plantsRaw) {
    selectedPlants = plantsRaw
      .split(',')
      .map(name => allPlants.find(p => p.name === name.trim()))
      .filter(Boolean)
  }

  return { widthIn, lengthIn, lightFilter, selectedPlants }
}
