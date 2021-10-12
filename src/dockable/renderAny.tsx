import { ITabs, IView, ViewContainer, ViewRenderer } from './ViewContainer'
import { IBox, Box } from './Box'

export function renderAny(
  item: IBox | ITabs | IView,
  render: ViewRenderer
): React.ReactNode {
  switch (item.type) {
    case 'box':
      return <Box state={item} render={render} />
    case 'tabs':
      return <ViewContainer tabs={item} render={render} />
    case 'view':
      return render(item)
  }
}
