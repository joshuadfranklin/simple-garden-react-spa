/**
 * Build the ordered list of rows for the garden grid using round-robin allocation.
 * One row per plant per pass; repeats until no row from any plant fits.
 *
 * @param {Array<{name: string, rowSpacingIn: number, inRowSpacingIn: number}>} selectedPlants
 * @param {number} widthIn - plot width in inches
 * @param {number} lengthIn - plot length in inches
 * @returns {{ rows: Array<{plant: object, rowNumber: number, plantCount: number}>, unusedIn: number, overflowPlants: Array }}
 */
export function buildRows(selectedPlants, widthIn, lengthIn) {
  if (!selectedPlants.length) {
    return { rows: [], unusedIn: lengthIn, overflowPlants: [] }
  }

  const rows = []
  let usedLengthIn = 0
  let anyFit = true

  while (anyFit) {
    anyFit = false
    for (const plant of selectedPlants) {
      if (usedLengthIn + plant.rowSpacingIn <= lengthIn) {
        const plantCount = Math.max(1, Math.floor(widthIn / plant.inRowSpacingIn))
        rows.push({ plant, rowNumber: rows.length + 1, plantCount })
        usedLengthIn += plant.rowSpacingIn
        anyFit = true
      }
    }
  }

  const plantsWithRows = new Set(rows.map(r => r.plant.name))
  const overflowPlants = selectedPlants.filter(p => !plantsWithRows.has(p.name))

  return {
    rows,
    unusedIn: lengthIn - usedLengthIn,
    overflowPlants,
  }
}
