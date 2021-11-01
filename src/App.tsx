import { useReducer } from 'react'
import './App.css'
import { Box } from './dockable/Box'
import { reducer } from './dockable/reducer2'
import { sample2 as sample } from './dockable/samples'
import { IView } from './dockable/types'

function render(view: IView) {
  return (
    <div key={view.id}
      className="fill"
      style={{ background: view.id, color: 'white', opacity: 0.5 }}
    ></div>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, sample)
  return (
    <div className="App">
      <Box box={state} render={render} onChange={dispatch} />
    </div>
  )
}

export default App
