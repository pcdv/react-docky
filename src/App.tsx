import { useReducer } from 'react'
import { Box } from './dockable/Box'
import { reducer } from './dockable/reducer2'
import { sample2 as sample } from './dockable/samples'
import { IView } from './dockable/types'

function render(view: IView) {
  return <div style={{ background: view.id, color: 'white', opacity: 0.8 }} />
}

function App() {
  const [state, dispatch] = useReducer(reducer, sample)
  return <Box box={state} render={render} onChange={dispatch} />
}

export default App
