import {  ViewContainer } from './ViewContainer'
import { Box } from './Box'
import { IBox, ITabs, IView, ViewRenderer } from './types'
import { BoxAction, ViewAction } from './reducer2'

export function renderAny(
  item: IBox | ITabs | IView,
  render: ViewRenderer,
  onChange: (action: BoxAction|ViewAction) => void,
  parent: IBox
): React.ReactNode {
  switch (item.type) {
    case 'box':
      return <Box box={item} render={render} onChange={onChange} />
    case 'tabs':
      return <ViewContainer key={item.id} tabs={item} render={render} onChange={onChange} parent={parent}/>
    case 'view':
      return render(item)
  }
}
