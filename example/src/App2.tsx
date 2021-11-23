import { useCallback, useRef, useState } from 'react'
import { sample2 as sample } from './samples'
import { Dock, repr, IView, IBox } from 'react-docky'
import './App.css'

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

  // gotta use a ref, otherwise looks like onChange captures some old array and
  // causes jumps in time
  const ref = useRef(states)

  const onChange = useCallback(
    (s: IBox) => {
      const newStates = [s].concat(ref.current)
      setStates(newStates)
      ref.current = newStates
    },
    [states]
  )

  const undo = useCallback(() => {
    const newStates = states.slice(1)
    setStates(newStates)
    ref.current = newStates
  }, [states])

  const box = states[0] || sample

  return (
    <div>
      <div id="actions">
        <button onClick={undo}>Undo</button>
        &nbsp; States: {states.length}
        &nbsp; {repr(box)}
      </div>
      <div id="desktop">
        <Dock key={box.id} state={box} render={render} onChange={onChange} />
      </div>
    </div>
  )
}

export default App
