import { render, screen, fireEvent, act } from '@testing-library/react'
import { vi, describe, test, expect } from 'vitest'
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
    expect(screen.getByText(/22\.2 sq ft/)).toBeInTheDocument()
  })

  test('calls onUpdate with new widthIn on blur', () => {
    const { onUpdate } = renderSidebar()
    const input = screen.getByLabelText(/width/i)
    fireEvent.change(input, { target: { value: '60' } })
    expect(onUpdate).not.toHaveBeenCalled()
    fireEvent.blur(input)
    expect(onUpdate).toHaveBeenCalledWith({ widthIn: 60 })
  })

  test('calls onUpdate with new lengthIn on blur', () => {
    const { onUpdate } = renderSidebar()
    const input = screen.getByLabelText(/length/i)
    fireEvent.change(input, { target: { value: '120' } })
    expect(onUpdate).not.toHaveBeenCalled()
    fireEvent.blur(input)
    expect(onUpdate).toHaveBeenCalledWith({ lengthIn: 120 })
  })

  test('enforces minimum of 10 for both dimension inputs on blur', () => {
    const { onUpdate } = renderSidebar()
    const widthInput = screen.getByLabelText(/width/i)
    fireEvent.change(widthInput, { target: { value: '5' } })
    fireEvent.blur(widthInput)
    expect(onUpdate).toHaveBeenCalledWith({ widthIn: 10 })
    const lengthInput = screen.getByLabelText(/length/i)
    fireEvent.change(lengthInput, { target: { value: '0' } })
    fireEvent.blur(lengthInput)
    expect(onUpdate).toHaveBeenCalledWith({ lengthIn: 10 })
  })

  test('clicking a light filter button calls onUpdate with new lightFilter', () => {
    const { onUpdate } = renderSidebar({ lightFilter: 'direct' })
    fireEvent.click(screen.getByRole('button', { name: /partial/i }))
    expect(onUpdate).toHaveBeenCalledWith({ lightFilter: 'partial' })
  })

  test('light filter shows only matching plants', () => {
    renderSidebar({ lightFilter: 'direct' })
    expect(screen.getByText('Tomato')).toBeInTheDocument()
    expect(screen.getByText('Pepper')).toBeInTheDocument()
    expect(screen.queryByText('Lettuce')).not.toBeInTheDocument()
  })

  test('Add button appends plant to selectedPlants', () => {
    const { onUpdate } = renderSidebar({ selectedPlants: [] })
    fireEvent.click(screen.getByRole('button', { name: /add tomato/i }))
    expect(onUpdate).toHaveBeenCalledWith(expect.any(Function))
    const updater = onUpdate.mock.calls[0][0]
    expect(updater({ selectedPlants: [] })).toMatchObject({ selectedPlants: [allPlants[0]] })
  })

  test('Add button can add same plant multiple times', () => {
    const { onUpdate } = renderSidebar({ selectedPlants: [allPlants[0]] })
    fireEvent.click(screen.getByRole('button', { name: /add tomato/i }))
    expect(onUpdate).toHaveBeenCalledWith(expect.any(Function))
    const updater = onUpdate.mock.calls[0][0]
    expect(updater({ selectedPlants: [allPlants[0]] })).toMatchObject({ selectedPlants: [allPlants[0], allPlants[0]] })
  })

  test('Remove button removes one instance of the plant', () => {
    const { onUpdate } = renderSidebar({ selectedPlants: [allPlants[0], allPlants[0]] })
    fireEvent.click(screen.getByRole('button', { name: /remove tomato/i }))
    expect(onUpdate).toHaveBeenCalledWith(expect.any(Function))
    const updater = onUpdate.mock.calls[0][0]
    expect(updater({ selectedPlants: [allPlants[0], allPlants[0]] })).toMatchObject({ selectedPlants: [allPlants[0]] })
  })

  test('Remove button is disabled when count is 0', () => {
    renderSidebar({ selectedPlants: [] })
    expect(screen.getByRole('button', { name: /remove tomato/i })).toBeDisabled()
  })

  test('shows "N selected in other conditions" when plants from other filters are selected', () => {
    renderSidebar({ lightFilter: 'direct', selectedPlants: [allPlants[2]] })
    expect(screen.getByText(/1 selected in other conditions/)).toBeInTheDocument()
  })

  test('counts multiple instances in other-conditions indicator', () => {
    renderSidebar({ lightFilter: 'direct', selectedPlants: [allPlants[2], allPlants[2]] })
    expect(screen.getByText(/2 selected in other conditions/)).toBeInTheDocument()
  })

  test('Save button copies current URL and shows Copied! then reverts after 2 seconds', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    renderSidebar()
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /save link/i })) })
    expect(writeText).toHaveBeenCalledWith(window.location.href)
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument()
    await act(async () => { vi.advanceTimersByTime(2000) })
    expect(screen.getByRole('button', { name: /save link/i })).toBeInTheDocument()
    vi.useRealTimers()
  })
})
