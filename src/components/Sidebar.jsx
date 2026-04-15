import { useState } from 'react'

const LIGHT_OPTIONS = ['direct', 'partial', 'low']

export default function Sidebar({ allPlants, widthIn, lengthIn, lightFilter, selectedPlants, onUpdate }) {
  const [copied, setCopied] = useState(false)

  const sqFt = ((widthIn * lengthIn) / 144).toFixed(1)
  const visiblePlants = allPlants.filter(p => p.light === lightFilter)
  const otherSelectedCount = selectedPlants.filter(p => p.light !== lightFilter).length

  function togglePlant(plant) {
    const isSelected = selectedPlants.some(p => p.name === plant.name)
    onUpdate({
      selectedPlants: isSelected
        ? selectedPlants.filter(p => p.name !== plant.name)
        : [...selectedPlants, plant],
    })
  }

  async function handleSave() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard write failed silently
    }
  }

  return (
    <aside className="w-52 min-w-52 border-r border-gray-200 bg-gray-50 flex flex-col gap-4 p-3 overflow-y-auto">
      <section>
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          Plot Dimensions
        </h2>
        <div className="flex gap-2 items-end mb-1">
          <label className="flex-1">
            <span className="text-xs text-gray-500 block mb-1">Width</span>
            <input
              aria-label="Width"
              type="number"
              value={widthIn}
              min={10}
              onChange={e => onUpdate({ widthIn: Math.max(10, parseInt(e.target.value) || 10) })}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </label>
          <span className="text-gray-400 mb-2 text-sm">×</span>
          <label className="flex-1">
            <span className="text-xs text-gray-500 block mb-1">Length</span>
            <input
              aria-label="Length"
              type="number"
              value={lengthIn}
              min={10}
              onChange={e => onUpdate({ lengthIn: Math.max(10, parseInt(e.target.value) || 10) })}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </label>
        </div>
        <p className="text-xs text-gray-400 text-right">{sqFt} sq ft</p>
      </section>

      <section>
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          Light Condition
        </h2>
        <div className="flex gap-1 flex-wrap">
          {LIGHT_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => onUpdate({ lightFilter: opt })}
              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                lightFilter === opt
                  ? 'bg-yellow-400 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </section>

      <section className="flex-1 min-h-0 overflow-y-auto">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          Plants <span className="font-normal capitalize">({lightFilter})</span>
        </h2>
        <div className="flex flex-col gap-2">
          {visiblePlants.map(plant => (
            <label key={plant.name} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                aria-label={plant.name}
                checked={selectedPlants.some(p => p.name === plant.name)}
                onChange={() => togglePlant(plant)}
              />
              {plant.name}
            </label>
          ))}
          {visiblePlants.length === 0 && (
            <p className="text-xs text-gray-400 italic">No plants for this condition</p>
          )}
        </div>
        {otherSelectedCount > 0 && (
          <p className="text-xs text-gray-400 mt-3">
            {otherSelectedCount} selected in other conditions
          </p>
        )}
      </section>

      <button
        onClick={handleSave}
        className="w-full py-1.5 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700"
      >
        {copied ? 'Copied!' : 'Save'}
      </button>
    </aside>
  )
}
