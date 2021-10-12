import React from 'react'
import './App.css'
import { Dockable } from './dockable/Dockable'
import { IBox } from './dockable/Box'
import { IView } from './dockable/ViewContainer'

const state: IBox = {
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

function render(view: IView) {
  return (
    <div
      className="fill"
      style={{ background: view.id, color: 'white', opacity: 0.5 }}
    ></div>
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
