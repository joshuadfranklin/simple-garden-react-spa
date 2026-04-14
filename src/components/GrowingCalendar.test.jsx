import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import GrowingCalendar from './GrowingCalendar.jsx'

const tomato = {
  name: 'Tomato',
  daysToHarvest: '70–85 days',
  calendar: {
    sow:     [false, true,  true,  false, false, false, false, false, false, false, false, false],
    grow:    [false, false, true,  true,  false, false, false, false, false, false, false, false],
    harvest: [false, false, false, true,  true,  false, false, false, false, false, false, false],
  },
}

describe('GrowingCalendar', () => {
  test('shows empty state when no plants selected', () => {
    render(<GrowingCalendar selectedPlants={[]} />)
    expect(screen.getByText(/select plants/i)).toBeInTheDocument()
  })

  test('renders the plant name', () => {
    render(<GrowingCalendar selectedPlants={[tomato]} />)
    expect(screen.getByText('Tomato')).toBeInTheDocument()
  })

  test('renders Sow, Grow, Harvest phase labels', () => {
    render(<GrowingCalendar selectedPlants={[tomato]} />)
    expect(screen.getByText('Sow')).toBeInTheDocument()
    expect(screen.getByText('Grow')).toBeInTheDocument()
    // Harvest row shows daysToHarvest instead of the word "Harvest"
    expect(screen.getByText('70–85 days')).toBeInTheDocument()
  })

  test('legend contains Sow, Grow, Harvest text', () => {
    render(<GrowingCalendar selectedPlants={[tomato]} />)
    const legendItems = screen.getAllByText(/^(Sow|Grow|Harvest)$/)
    expect(legendItems.length).toBeGreaterThanOrEqual(3)
  })

  test('renders 12 month headers', () => {
    render(<GrowingCalendar selectedPlants={[tomato]} />)
    ;['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].forEach(m => {
      expect(screen.getByText(m)).toBeInTheDocument()
    })
  })

  test('renders two plants without overlap in names', () => {
    const pepper = { ...tomato, name: 'Pepper', daysToHarvest: '60–90 days' }
    render(<GrowingCalendar selectedPlants={[tomato, pepper]} />)
    expect(screen.getByText('Tomato')).toBeInTheDocument()
    expect(screen.getByText('Pepper')).toBeInTheDocument()
  })
})
