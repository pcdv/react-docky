import { Dock, FrameProps, IView, TabProps, useDragTab, useDragTabs } from 'react-docky'
import { sample2 as sample } from './samples'

function render(view: IView) {
  return <div style={{ background: view.id, opacity: 0.8 }} />
}

/** Click to activate the view, drag to move it */
const Tab = ({ active, onActivate, onClose, view }: TabProps) => (
  <div className={active ? 'tab active' : 'tab'} onClick={onActivate} ref={useDragTab<HTMLDivElement>(view)}>
    {view.label || view.id}
    <span
      className="close"
      onClick={e => {
        e.stopPropagation()
        onClose()
      }}
    >
      ×
    </span>
  </div>
)

/** Tabs on top: drag the bar next to the tabs to move all of them */
const TabbedView = (p: FrameProps) => {
  const [{ isTabsDragging }, drag] = useDragTabs<HTMLDivElement>(p.tabs, p.onDrop)

  return (
    <div className={isTabsDragging ? 'views-container dragging' : 'views-container'}>
      <div className="tabs" ref={drag}>
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
}

export default function App() {
  return <Dock initialState={sample} render={render} renderFrame={TabbedView} />
}
