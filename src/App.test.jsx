import { render, screen } from '@testing-library/react'
import App from './App.jsx'

test('renders heading', () => {
  render(<App />)
  expect(screen.getByText('Garden Planner')).toBeInTheDocument()
})
