import { ITabs, IView, ViewContainer, ViewRenderer } from './ViewContainer'
import { IBox, Box } from './Box'
import { Action } from './reducer'

export function renderAny(
  item: IBox | ITabs | IView,
  render: ViewRenderer,
  onChange: (action: Action) => void
): React.ReactNode {
  switch (item.type) {
    case 'box':
      return <Box state={item} render={render} onChange={onChange} />
    case 'tabs':
      return <ViewContainer key={item.id} tabs={item} render={render} onChange={onChange} />
    case 'view':
      return render(item)
  }
}
