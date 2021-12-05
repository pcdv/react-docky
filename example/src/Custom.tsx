import { sample2 as sample } from './samples'
import { IView, Dock } from 'react-docky'
import { dragTab, FrameProps, TabProps } from '../../lib/esm/skin'

function render(view: IView) {
  return <div style={{ background: view.id, color: 'white', opacity: 0.8 }} />
}

const Tab = ({ active, onActivate, onClose, view }: TabProps) => (
  <div
    onClick={onActivate}
    style={{ fontWeight: active ? 'bold' : 'normal', padding: '1px 3px', display: 'inline-block' }}
    ref={dragTab(view)}
  >
    {view.label || view.id}
    <span onClick={onClose}> x</span>
  </div>
)

const TabbedView = (p: FrameProps) => (
  <div ref={p.dragTabsRef} className="views-container">
    <div>
      {p.tabs.tabs.map((v, i) => (
        <Tab
          view={v}
          key={v.id}
          active={i === p.active}
          onActivate={() => p.onActivate(i)}
          onClose={() => p.onCloseTab(i)}
        />
      ))}
    </div>
    {p.viewWrapper}
  </div>
)

function App() {
  return <Dock initialState={sample} render={render} renderFrame={TabbedView} />
}

export default App
