import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import GardenLayout from './GardenLayout.jsx'

const tomato = { name: 'Tomato', light: 'direct', rowSpacingIn: 18, inRowSpacingIn: 24, daysToHarvest: '70–85 days', calendar: { sow: Array(12).fill(false), grow: Array(12).fill(false), harvest: Array(12).fill(false) } }
const pumpkin = { name: 'Pumpkin', light: 'direct', rowSpacingIn: 96, inRowSpacingIn: 48, daysToHarvest: '90 days', calendar: { sow: Array(12).fill(false), grow: Array(12).fill(false), harvest: Array(12).fill(false) } }

describe('GardenLayout', () => {
  test('shows empty state when no plants selected', () => {
    render(<GardenLayout widthIn={40} lengthIn={80} selectedPlants={[]} />)
    expect(screen.getByText(/select plants/i)).toBeInTheDocument()
  })

  test('shows too-small message when no rows fit', () => {
    render(<GardenLayout widthIn={40} lengthIn={10} selectedPlants={[pumpkin]} />)
    expect(screen.getByText(/too small/i)).toBeInTheDocument()
  })

  test('renders one row per selectedPlants entry', () => {
    render(<GardenLayout widthIn={40} lengthIn={80} selectedPlants={[tomato, tomato]} />)
    expect(screen.getAllByText(/tomato/i)).toHaveLength(2)
  })

  test('shows overflow plant in doesnt-fit section', () => {
    render(<GardenLayout widthIn={40} lengthIn={40} selectedPlants={[tomato, pumpkin]} />)
    expect(screen.getByText(/doesn't fit/i)).toBeInTheDocument()
    expect(screen.getByText(/pumpkin/i)).toBeInTheDocument()
  })

  test('shows unused inches label when space remains', () => {
    // 80" - (2 * 18") = 44" unused
    render(<GardenLayout widthIn={40} lengthIn={80} selectedPlants={[tomato, tomato]} />)
    expect(screen.getByText(/44.*unused/i)).toBeInTheDocument()
  })

  test('each row has fixed height class', () => {
    const { container } = render(<GardenLayout widthIn={40} lengthIn={80} selectedPlants={[tomato, tomato]} />)
    const rows = container.querySelectorAll('.h-6')
    expect(rows.length).toBe(2)
  })
})
