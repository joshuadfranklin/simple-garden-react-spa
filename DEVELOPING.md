# Developing Garden Planner

## Prerequisites

- Node.js 18+ (tested on v25)

## How to add more plants

The `plants.json` file contains data extracted from published academic or government sources. Each entry looks like this:

```json
{
    "name": "Okra",
    "light": "direct",
    "rowSpacingIn": 36,
    "inRowSpacingIn": 18,
    "daysToHarvest": "55–65 days",
    "calendar": {
      "sow":     [false, false, true,  true,  false, false, false, false, false, false, false, false],
      "grow":    [false, false, false, true,  true,  true,  false, true,  true,  false, false, false],
      "harvest": [false, false, false, false, false, true,  true,  false, true,  true,  false, false]
    }
  }
  ```


## Setup

Install dependencies:

```bash
npm install
```

## Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The page hot-reloads on file changes.

## Building for Production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build locally:

```bash
npm run preview
```

## Running Tests

Run the full test suite once:

```bash
npm run test:run
```

Run tests in watch mode (re-runs on file changes):

```bash
npm test
```

Run a specific test file:

```bash
npm run test:run -- Sidebar
npm run test:run -- gardenLayout
npm run test:run -- urlState
```

## Project Structure

```
src/
  data/plants.json          plant database (committed, manually reviewed)
  utils/
    urlState.js             URL serialization/deserialization
    gardenLayout.js         round-robin row allocation algorithm
  components/
    Sidebar.jsx             plot dimensions, light filter, plant checklist, save button
    GardenLayout.jsx        scaled top-down garden grid
    GrowingCalendar.jsx     12-month sow/grow/harvest calendar
  App.jsx                   layout shell, state, URL sync
  main.jsx                  React entry point
  index.css                 Tailwind import
scripts/
  extract-plants.py         one-time PDF extraction tool (Python, uses .venv)
docs/
  superpowers/specs/        design documents
  superpowers/plans/        implementation plans
  *.pdf                     source PDFs for plant data
```
