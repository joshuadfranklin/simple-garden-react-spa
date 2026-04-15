const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const PHASES = ['sow', 'grow', 'harvest']

const PHASE_COLORS = {
  sow:     '#c8e6c9',
  grow:    '#a5d6a7',
  harvest: '#66bb6a',
}

const INACTIVE = '#e5e7eb'

export default function GrowingCalendar({ selectedPlants = [] }) {
  if (!selectedPlants.length) {
    return (
      <section className="border rounded p-4 text-sm text-gray-400">
        Select plants to see the growing calendar
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
        Growing Calendar
      </h2>

      {/* Month headers */}
      <div className="grid mb-1" style={{ gridTemplateColumns: '80px 1fr 90px' }}>
        <span />
        <div className="grid grid-cols-12 gap-px text-center text-xs text-gray-400">
          {MONTHS.map(m => <span key={m}>{m}</span>)}
        </div>
        <span />
      </div>

      {/* Plants — deduplicated since calendar is the same regardless of count */}
      {selectedPlants.filter((p, i, arr) => arr.findIndex(q => q.name === p.name) === i).map(plant => (
        <div key={plant.name} className="mb-4">
          {PHASES.map((phase, pi) => {
            const months = plant.calendar?.[phase]
            if (!months) return null
            return (
              <div
                key={phase}
                className="grid items-center mb-px"
                style={{ gridTemplateColumns: '80px 1fr 90px' }}
              >
                <span className="text-xs font-semibold text-gray-700 truncate">
                  {pi === 0 ? plant.name : ''}
                </span>
                <div className="grid grid-cols-12 gap-px">
                  {months.map((active, mi) => (
                    <div
                      key={MONTHS[mi]}
                      className="h-2.5 rounded-sm"
                      style={{ backgroundColor: active ? PHASE_COLORS[phase] : INACTIVE }}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400 pl-2 truncate">
                  {phase === 'harvest' ? plant.daysToHarvest : ''}
                </span>
              </div>
            )
          })}
        </div>
      ))}

      {/* Legend */}
      <div className="flex gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3 mt-1">
        {Object.entries(PHASE_COLORS).map(([phase, color]) => (
          <span key={phase} className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
            {phase.charAt(0).toUpperCase() + phase.slice(1)}
          </span>
        ))}
      </div>
    </section>
  )
}
