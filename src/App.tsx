import React from 'react'
import './App.css'
import { Box, Dockable, View } from './dockable/Dockable'

const state: Box = {
  type: 'box',
  orientation: 'vertical',
  first: {
    type: 'box',
    orientation: 'horizontal',
    first: {
      type: 'tabs',
      tabs: [{ type: 'view', id: 'red', label: 'Red', viewType: 'colored' }],
    },
    second: {
      type: 'box',
      orientation: 'vertical',
      first: {
        type: 'tabs',
        tabs: [
          { type: 'view', id: 'green', label: 'Green', viewType: 'colored' },
        ],
      },
      second: {
        type: 'tabs',
        tabs: [
          { type: 'view', id: 'orange', label: 'Orange', viewType: 'colored' },
        ],
      },
    },
  },
  second: {
    type: 'tabs',
    tabs: [{ type: 'view', id: 'blue', label: 'Blue', viewType: 'colored' }],
  },
}

function render(view: View) {
  return (
    <div className="fill" style={{ background: view.id, color: 'white' }}>
      {view.label}
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <Dockable state={state} render={render} />
    </div>
  )
}

export default App
