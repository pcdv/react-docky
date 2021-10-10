import SplitPane from 'react-split-pane'
import './Dockable.css'
import './react-splitpane.css'

export interface Box {
  type: 'box'
  orientation: 'vertical' | 'horizontal'
  first: Box | Tabs
  second?: Box | Tabs | null
}

interface Tabs {
  type: 'tabs'
  tabs: View[]
}

export interface View {
  type: 'view'
  viewType: string
  id: string
  label: string
}

interface Props {
  state: Box
  render: ViewRenderer
}

type ViewRenderer = (view: View) => React.ReactNode

function renderAny(
  item: Box | Tabs | View,
  render: ViewRenderer
): React.ReactNode {
  switch (item.type) {
    case 'box':
      return renderBox(item, render)
    case 'tabs':
      return renderTabs(item, render)
    case 'view':
      return render(item)
  }
}

function renderTabs(tabs: Tabs, render: ViewRenderer): React.ReactNode {
  if (tabs.tabs.length === 0) return null

  return <div className="tabs">{render(tabs.tabs[0])}</div>
}

function renderBox(box: Box, render: ViewRenderer): React.ReactElement {
  if (box.first && box.second)
    return (
      <SplitPane split={box.orientation === 'vertical' ? 'horizontal' : 'vertical'} className={`box`} defaultSize='50%'>
        {renderAny(box.first, render)}
        {renderAny(box.second, render)}
      </SplitPane>
    )
  return (
    <div className={`box ${box.orientation}`}>
      {!!box.first && renderAny(box.first, render)}
      {!!box.second && renderAny(box.second, render)}
    </div>
  )
}

export const Dockable = ({ state, render }: Props) => {
  return renderBox(state, render)
}
