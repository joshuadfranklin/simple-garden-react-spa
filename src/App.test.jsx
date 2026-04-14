import { render, screen } from '@testing-library/react'
import App from './App.jsx'

// plants.json is imported in App — mock it so tests don't need the real file
vi.mock('./data/plants.json', () => ({
  default: [
    { name: 'Tomato', light: 'direct', rowSpacingIn: 36, inRowSpacingIn: 24, daysToHarvest: '70–85 days',
      calendar: { sow: Array(12).fill(false), grow: Array(12).fill(false), harvest: Array(12).fill(false) } },
  ],
}))

test('renders without crashing', () => {
  render(<App />)
  expect(document.body).toBeTruthy()
})

test('reads widthIn from URL on mount', () => {
  window.history.replaceState(null, '', '?w=60&l=120&light=direct')
  render(<App />)
  expect(screen.getByDisplayValue('60')).toBeInTheDocument()
})
