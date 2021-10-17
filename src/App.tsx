import React, { useReducer } from 'react'
import './App.css'
import { Dockable } from './dockable/Dockable'
import { reducer } from './dockable/reducer'
import { sample } from './dockable/samples'
import { IView } from './dockable/ViewContainer'

function render(view: IView) {
  return (
    <div
      className="fill"
      style={{ background: view.id, color: 'white', opacity: 0.5 }}
    ></div>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, sample)
  return (
    <div className="App">
      <Dockable state={state} render={render} onChange={dispatch} />
    </div>
  )
}

export default App
