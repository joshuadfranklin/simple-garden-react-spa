import { render, screen, fireEvent, act } from '@testing-library/react'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import Sidebar from './Sidebar.jsx'

const allPlants = [
  { name: 'Tomato', light: 'direct', rowSpacingIn: 36, inRowSpacingIn: 24, daysToHarvest: '70–85 days', calendar: { sow: Array(12).fill(false), grow: Array(12).fill(false), harvest: Array(12).fill(false) } },
  { name: 'Pepper', light: 'direct', rowSpacingIn: 18, inRowSpacingIn: 18, daysToHarvest: '70–90 days', calendar: { sow: Array(12).fill(false), grow: Array(12).fill(false), harvest: Array(12).fill(false) } },
  { name: 'Lettuce', light: 'partial', rowSpacingIn: 12, inRowSpacingIn: 8, daysToHarvest: '45–60 days', calendar: { sow: Array(12).fill(false), grow: Array(12).fill(false), harvest: Array(12).fill(false) } },
]

function renderSidebar(overrides = {}) {
  const props = {
    allPlants,
    widthIn: 40,
    lengthIn: 80,
    lightFilter: 'direct',
    selectedPlants: [],
    onUpdate: vi.fn(),
    ...overrides,
  }
  return { ...render(<Sidebar {...props} />), onUpdate: props.onUpdate }
}

describe('Sidebar', () => {
  test('shows sq ft calculated from dimensions', () => {
    renderSidebar({ widthIn: 40, lengthIn: 80 })
    // 40 * 80 / 144 = 22.2
    expect(screen.getByText(/22\.2 sq ft/)).toBeInTheDocument()
  })

  test('calls onUpdate with new widthIn when input changes', () => {
    const { onUpdate } = renderSidebar()
    fireEvent.change(screen.getByLabelText(/width/i), { target: { value: '60' } })
    expect(onUpdate).toHaveBeenCalledWith({ widthIn: 60 })
  })

  test('light filter shows only matching plants', () => {
    renderSidebar({ lightFilter: 'direct' })
    expect(screen.getByLabelText('Tomato')).toBeInTheDocument()
    expect(screen.getByLabelText('Pepper')).toBeInTheDocument()
    expect(screen.queryByLabelText('Lettuce')).not.toBeInTheDocument()
  })

  test('clicking a plant checkbox calls onUpdate with updated selectedPlants', () => {
    const { onUpdate } = renderSidebar({ lightFilter: 'direct', selectedPlants: [] })
    fireEvent.click(screen.getByLabelText('Tomato'))
    expect(onUpdate).toHaveBeenCalledWith({ selectedPlants: [allPlants[0]] })
  })

  test('unchecking a selected plant removes it from selectedPlants', () => {
    const { onUpdate } = renderSidebar({ lightFilter: 'direct', selectedPlants: [allPlants[0]] })
    fireEvent.click(screen.getByLabelText('Tomato'))
    expect(onUpdate).toHaveBeenCalledWith({ selectedPlants: [] })
  })

  test('shows "N selected in other conditions" when plants from other filters are selected', () => {
    renderSidebar({ lightFilter: 'direct', selectedPlants: [allPlants[2]] }) // Lettuce is partial
    expect(screen.getByText(/1 selected in other conditions/)).toBeInTheDocument()
  })

  test('does not show other-conditions indicator when all selected match current filter', () => {
    renderSidebar({ lightFilter: 'direct', selectedPlants: [allPlants[0]] })
    expect(screen.queryByText(/selected in other conditions/)).not.toBeInTheDocument()
  })

  test('Save button shows Copied! then reverts after 2 seconds', async () => {
    vi.useFakeTimers()
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })
    renderSidebar()
    fireEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument()
    await act(async () => { vi.advanceTimersByTime(2000) })
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    vi.useRealTimers()
  })
})
