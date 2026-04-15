/**
 * Build the ordered list of rows for the garden grid.
 * One row per entry in selectedPlants (duplicates produce multiple rows).
 * Rows are allocated in order until the plot length is exhausted.
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
  const overflowPlants = []
  let usedLengthIn = 0

  for (const plant of selectedPlants) {
    if (usedLengthIn + plant.rowSpacingIn <= lengthIn) {
      const plantCount = Math.max(1, Math.floor(widthIn / plant.inRowSpacingIn))
      rows.push({ plant, rowNumber: rows.length + 1, plantCount })
      usedLengthIn += plant.rowSpacingIn
    } else {
      overflowPlants.push(plant)
    }
  }

  return {
    rows,
    unusedIn: lengthIn - usedLengthIn,
    overflowPlants,
  }
}
