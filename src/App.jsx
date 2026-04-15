import { useState, useEffect } from 'react'
import plants from './data/plants.json'
import { serializeState, deserializeState } from './utils/urlState.js'
import Sidebar from './components/Sidebar.jsx'
import GardenLayout from './components/GardenLayout.jsx'
import GrowingCalendar from './components/GrowingCalendar.jsx'

export default function App() {
  const [state, setState] = useState(() =>
    deserializeState(window.location.search, plants)
  )

  const { widthIn, lengthIn, lightFilter, selectedPlants, title } = state

  useEffect(() => {
    const params = serializeState(state)
    history.replaceState(null, '', `?${params}`)
  }, [state])

  function update(patchOrFn) {
    if (typeof patchOrFn === 'function') {
      setState(patchOrFn)
    } else {
      setState(prev => ({ ...prev, ...patchOrFn }))
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        allPlants={plants}
        widthIn={widthIn}
        lengthIn={lengthIn}
        lightFilter={lightFilter}
        selectedPlants={selectedPlants}
        onUpdate={update}
      />
      <main className="flex-1 flex flex-col overflow-auto p-4 gap-6">
        <input
          aria-label="Garden title"
          value={title}
          onChange={e => update({ title: e.target.value })}
          className="text-2xl font-bold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-gray-400 focus:outline-none w-full"
        />
        <GardenLayout
          widthIn={widthIn}
          lengthIn={lengthIn}
          selectedPlants={selectedPlants}
        />
        <GrowingCalendar selectedPlants={selectedPlants} />
      </main>
    </div>
  )
}
