import { useCallback, useRef, useState } from 'react'
import { sample2 as sample } from './samples'
import { Dock, repr, IView, IBox, ITabs, BoxTransformType, reducer } from 'react-docky'
import './App.css'

function render(view: IView) {
  return (
    <div style={{ background: view.id, color: 'white', opacity: 0.8 }}>{view.dead && 'DEAD'}</div>
  )
}

function collectBoxIds(s?: IBox | ITabs, arr: string[] = []) {
  if (s) {
    if (s.type === 'box') {
      arr.push(s.id)
      collectBoxIds(s.one, arr)
      collectBoxIds(s.two, arr)
    }
  }
  return arr
}

function randomBoxId(s: IBox) {
  const ids = collectBoxIds(s)
  return ids[Math.floor(Math.random() * ids.length)]
}

function randomView(): IView {
  const id = '#' + (((1 << 24) * Math.random()) | 0).toString(16)
  return { id, type: 'view', viewType: 'random' }
}

function randomAction(): BoxTransformType {
  const transforms = 'iaxyodddddddddddddddddd'
  return (transforms[Math.floor(Math.random() * transforms.length)] +
    Math.floor(1 + Math.random() * 2)) as BoxTransformType
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

  const addRandomView = useCallback(() => {
    const s = reducer(states[0], { actionType: 'box', boxId: randomBoxId(states[0]), type: randomAction(), view: randomView() })
    onChange(s)
  }, [states])

  const box = states[0] || sample

  return (
    <div>
      <div id="actions">
        <button onClick={addRandomView}>Add random view</button>
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
