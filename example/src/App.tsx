import { sample2 as sample } from './samples'
import { IView, Dock } from 'react-docky'

function render(view: IView) {
  return <div style={{ background: view.id, color: 'white', opacity: 0.8 }} />
}

function App() {
  return <Dock initialState={sample} render={render} />
}

export default App
