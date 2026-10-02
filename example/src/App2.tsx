import { useState } from 'react'
import { BoxTransformType, Dock, IBox, ITabs, IView, reducer, repr } from 'react-docky'
import { sample2 as sample } from './samples'

/** A view with some state, which it loses when it is moved to another parent, unless kept mounted */
function CounterView({ view }: { view: IView }) {
  const [count, setCount] = useState(0)
  return (
    <div style={{ background: view.id, color: 'white', opacity: 0.8, padding: '5px' }}>
      <button onClick={() => setCount(count + 1)}>Increment</button> {count}
    </div>
  )
}

const render = (view: IView) => <CounterView view={view} />

function collectBoxIds(s: IBox | ITabs | null | undefined, arr: string[] = []) {
  if (s?.type === 'box') {
    arr.push(s.id)
    collectBoxIds(s.one, arr)
    collectBoxIds(s.two, arr)
  }
  return arr
}

function randomBoxId(s: IBox) {
  const ids = collectBoxIds(s)
  return ids[Math.floor(Math.random() * ids.length)]
}

function randomView(): IView {
  const id = '#' + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, '0')
  return { id, type: 'view', viewType: 'random' }
}

function randomAction(): BoxTransformType {
  const transforms = 'iaxyodddddddddddddddddd'
  return (transforms[Math.floor(Math.random() * transforms.length)] +
    Math.floor(1 + Math.random() * 2)) as BoxTransformType
}

/**
 * The application keeps the layout, here with its history so that the last change can be undone.
 * The layout can also be changed from outside of the Dock, with the same reducer.
 */
export default function App() {
  const [states, setStates] = useState<IBox[]>([sample])
  const [keepViewsMounted, setKeepViewsMounted] = useState(false)
  const layout = states[0]

  const onChange = (s: IBox) => setStates(previous => [s, ...previous])

  const undo = () => setStates(previous => (previous.length > 1 ? previous.slice(1) : previous))

  const addRandomView = () =>
    onChange(
      reducer(layout, {
        actionType: 'box',
        boxId: randomBoxId(layout),
        type: randomAction(),
        view: randomView(),
      })
    )

  return (
    <>
      <div id="actions">
        <button onClick={addRandomView}>Add random view</button>
        <button onClick={undo}>Undo</button>
        <label>
          <input
            type="checkbox"
            checked={keepViewsMounted}
            onChange={e => setKeepViewsMounted(e.target.checked)}
          />
          Keep views mounted
        </label>
        &nbsp; States: {states.length}
        &nbsp; {repr(layout)}
      </div>
      <div id="desktop">
        <Dock state={layout} render={render} onChange={onChange} keepViewsMounted={keepViewsMounted} />
      </div>
    </>
  )
}
