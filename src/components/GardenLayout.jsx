import { buildRows } from '../utils/gardenLayout.js'

const ROW_COLORS = [
  { bg: '#bbdefb', border: '#1e88e5', text: '#0d47a1' },
  { bg: '#c8e6c9', border: '#43a047', text: '#2e7d32' },
]

export default function GardenLayout({ widthIn, lengthIn, selectedPlants = [] }) {
  if (!selectedPlants.length) {
    return (
      <section className="border rounded p-4 text-sm text-gray-400">
        Select plants to see your garden layout
      </section>
    )
  }

  const { rows, unusedIn, overflowPlants } = buildRows(selectedPlants, widthIn, lengthIn)

  if (!rows.length) {
    return (
      <section className="border rounded p-4 text-sm text-gray-400">
        Plot too small for selected plants
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
        Garden Layout — {widthIn}″ × {lengthIn}″
      </h2>
      <div className="max-w-[640px]">
        {/* Plot grid */}
        <div
          className="bg-green-100 border-2 border-green-600 rounded overflow-hidden"
        >
          {rows.map((row, i) => {
            const color = ROW_COLORS[i % 2]
            return (
              <div
                key={row.rowNumber}
                style={{
                  backgroundColor: color.bg,
                  borderLeft: `4px solid ${color.border}`,
                  borderBottom: i < rows.length - 1 ? `1px dashed ${color.border}` : undefined,
                }}
                className="flex items-center justify-between px-2 overflow-hidden h-6"
              >
                <span
                  className="text-xs font-semibold truncate"
                  style={{ color: color.text }}
                  title={`Spacing in Row: ${row.plant.inRowSpacingIn}″\nBetween Rows: ${row.plant.rowSpacingIn}″\nDays to Harvest: ${row.plant.daysToHarvest}`}
                >
                  {row.plant.name}
                </span>
                <span className="text-xs text-gray-500 ml-1 shrink-0">
                  {row.plant.rowSpacingIn}″ · {row.plantCount}p
                </span>
              </div>
            )
          })}
        </div>

        {unusedIn > 0 && (
          <p className="text-xs text-gray-400 mt-1">{unusedIn}″ unused</p>
        )}

        {overflowPlants.length > 0 && (
          <div className="mt-2 text-xs text-gray-400 border border-dashed border-gray-300 rounded p-2">
            <span className="font-medium">Doesn't fit: </span>
            {overflowPlants.map(p => p.name).join(', ')}
          </div>
        )}
      </div>
    </section>
  )
}
