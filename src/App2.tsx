import { useState } from 'react'
import { sample2 as sample } from './samples'
import { IBox, IView } from './dockable/types'
import './App.css'
import { repr } from './dockable/util'
import { Box } from './dockable/Box'
import { reducer } from './dockable/reducer2'

function render(view: IView) {
  return (
    <div style={{ background: view.id, color: 'white', opacity: 0.8 }}>{view.dead && 'DEAD'}</div>
  )
}

function App() {
  const [state, setState] = useState<IBox[]>(() => [sample])
  // const [lastAction, setLastAction] = useState<any>(null)
  const box = state[0] || sample
  console.log(box)

  return (
    <div>
      <div id="actions">
        <button onClick={() => setState(state.slice(1))}>Undo</button>
        &nbsp; States: {state.length}
        &nbsp; {repr(box)}
        {/* &nbsp; Last action: {JSON.stringify(lastAction)} */}
      </div>
      <div id="desktop">
        <Box
          key={box.id}
          box={box}
          render={render}
          onChange={action => {
            setState(old => [reducer(box, action)].concat(old))
          }}
        />
      </div>
    </div>
  )
}

export default App
