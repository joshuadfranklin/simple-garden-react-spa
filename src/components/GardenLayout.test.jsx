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

  test('renders a row for each allocated row', () => {
    // 80" / 18" = 4 rows of tomato
    render(<GardenLayout widthIn={40} lengthIn={80} selectedPlants={[tomato]} />)
    expect(screen.getAllByText(/tomato/i)).toHaveLength(4)
  })

  test('shows overflow plant in doesnt-fit section', () => {
    render(<GardenLayout widthIn={40} lengthIn={40} selectedPlants={[tomato, pumpkin]} />)
    expect(screen.getByText(/doesn't fit/i)).toBeInTheDocument()
    expect(screen.getByText(/pumpkin/i)).toBeInTheDocument()
  })

  test('shows unused inches label when space remains', () => {
    // 80" - (4 * 18") = 8" unused
    render(<GardenLayout widthIn={40} lengthIn={80} selectedPlants={[tomato]} />)
    expect(screen.getByText(/8.*unused/i)).toBeInTheDocument()
  })

  test('container has correct aspect-ratio style', () => {
    const { container } = render(<GardenLayout widthIn={40} lengthIn={80} selectedPlants={[tomato]} />)
    const grid = container.querySelector('[style*="aspect-ratio"]')
    expect(grid).not.toBeNull()
    expect(grid.style.aspectRatio).toBe('40 / 80')
  })
})
