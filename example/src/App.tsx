import { Dock, IView } from 'react-docky'
import { sample2 as sample } from './samples'

function render(view: IView) {
  return <div style={{ background: view.id, opacity: 0.8 }} />
}

/** The simplest use: the Dock keeps the layout */
export default function App() {
  return <Dock initialState={sample} render={render} />
}
