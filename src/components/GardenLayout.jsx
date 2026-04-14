import { buildRows } from '../utils/gardenLayout.js'

const PALETTE = [
  { bg: '#ffcdd2', border: '#e53935', text: '#c62828' },
  { bg: '#ffe0b2', border: '#fb8c00', text: '#e65100' },
  { bg: '#c8e6c9', border: '#43a047', text: '#2e7d32' },
  { bg: '#bbdefb', border: '#1e88e5', text: '#0d47a1' },
  { bg: '#e1bee7', border: '#8e24aa', text: '#4a148c' },
  { bg: '#fff9c4', border: '#f9a825', text: '#f57f17' },
  { bg: '#b2dfdb', border: '#00897b', text: '#004d40' },
  { bg: '#f8bbd0', border: '#e91e63', text: '#880e4f' },
]

function getColor(plantName) {
  const hash = plantName.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return PALETTE[hash % PALETTE.length]
}

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

  const widthFt = widthIn / 12
  const lengthFt = lengthIn / 12
  const widthTicks = Array.from({ length: Math.floor(widthFt) + 1 }, (_, i) => i)
  const lengthTicks = Array.from({ length: Math.floor(lengthFt) + 1 }, (_, i) => i)

  return (
    <section>
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
        Garden Layout — {widthIn}″ × {lengthIn}″
      </h2>
      <div className="flex gap-2">
        {/* Length ruler */}
        <div
          className="flex flex-col justify-between items-end pr-1 text-xs text-gray-400"
          style={{ width: 32, paddingTop: 20 }}
        >
          {lengthTicks.map(t => <span key={t} className="leading-none">{t}ft</span>)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Width ruler */}
          <div className="flex justify-between mb-1 text-xs text-gray-400">
            {widthTicks.map(t => <span key={t}>{t}ft</span>)}
          </div>

          {/* Plot grid */}
          <div
            className="bg-green-100 border-2 border-green-600 rounded overflow-hidden"
            style={{ aspectRatio: `${widthIn} / ${lengthIn}` }}
          >
            {rows.map((row, i) => {
              const color = getColor(row.plant.name)
              const heightPct = (row.plant.rowSpacingIn / lengthIn) * 100
              return (
                <div
                  key={row.rowNumber}
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: color.bg,
                    borderLeft: `4px solid ${color.border}`,
                    borderBottom: i < rows.length - 1 ? `1px dashed ${color.border}` : undefined,
                  }}
                  className="flex items-center justify-between px-2 overflow-hidden"
                >
                  <span className="text-xs font-semibold truncate" style={{ color: color.text }}>
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
      </div>
    </section>
  )
}
