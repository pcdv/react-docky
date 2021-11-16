import { useReducer } from 'react'
import { sample2 as sample } from './samples'
import { IView, reducer, Dock } from 'react-docky'

function render(view: IView) {
  return <div style={{ background: view.id, color: 'white', opacity: 0.8 }} />
}

function App() {
  const [state, dispatch] = useReducer(reducer, sample)
  return <Dock state={state} render={render} dispatch={dispatch} />
}

export default App
