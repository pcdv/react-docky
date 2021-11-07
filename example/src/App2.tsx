import { useRef, useState } from 'react'
import { sample2 as sample } from './samples'
import './App.css'
import {Box, BoxAction, reducer, repr, ViewAction, IView, IBox} from 'react-docky'

function render(view: IView) {
  return (
    <div style={{ background: view.id, color: 'white', opacity: 0.8 }}>{view.dead && 'DEAD'}</div>
  )
}

/**
 * This version of the app store state history in an array so we can undo the last change.
 */
function App() {
  const [states, setStates] = useState<IBox[]>(() => [sample])

  // avoid accessing old state in onChange (also tried with useCallback but looks like some old versions of the callback are in the wild, keeping reference to an old state)
  // https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback
  // NB: the problem does not happen with useReducer(), not sure why...
  const stateRef = useRef<IBox[]>(states)
  stateRef.current = states

  const onChange = (action: BoxAction | ViewAction) => {
    const oldState = stateRef.current[0] || sample
    const newState = reducer(oldState, action)
    setStates([newState].concat(stateRef.current))
  }

  const box = states[0] || sample

  return (
    <div>
      <div id="actions">
        <button onClick={() => setStates(states.slice(1))}>Undo</button>
        &nbsp; States: {states.length}
        &nbsp; {repr(box)}
      </div>
      <div id="desktop">
        <Box key={box.id} box={box} render={render} onChange={onChange} />
      </div>
    </div>
  )
}

export default App
