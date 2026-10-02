import { reducer, wrap } from './reducer.js'
import { IBox, ITabs, IView } from './types.js'

/** All the views of a layout, in active tabs or not */
export function collectViews(item: IBox | ITabs | null | undefined, views: IView[] = []): IView[] {
  if (item?.type === 'box') {
    collectViews(item.one, views)
    collectViews(item.two, views)
  } else if (item?.type === 'tabs') {
    views.push(...item.tabs.filter(v => !v.dead))
  }
  return views
}

/**
 * Returns a layout with a new view, which must have an id of its own.
 *
 * With `to`, the id of a tab group or of one of its views, the view is added as the active tab
 * of that group. Otherwise, or if there is no such group, the view fills an empty side of the
 * root box, or is put after the last view, which it shares the place of.
 */
export function addView(layout: IBox, view: IView, to?: string): IBox {
  if (to !== undefined) {
    const added = addTab(layout, view, to)
    if (added !== layout) return added
  }
  if (!layout.one) return { ...layout, one: wrap(view) }
  if (!layout.two) return { ...layout, two: wrap(view) }
  return reducer(layout, { actionType: 'box', boxId: layout.id, type: 'i2', view })
}

function addTab<T extends IBox | ITabs | null | undefined>(item: T, view: IView, to: string): T {
  if (item?.type === 'box') {
    const one = addTab(item.one, view, to)
    const two = addTab(item.two, view, to)
    return one === item.one && two === item.two ? item : { ...item, one, two }
  }
  if (item?.type === 'tabs' && (item.id === to || item.tabs.some(v => v.id === to)))
    return { ...item, tabs: [...item.tabs, view], active: item.tabs.length }
  return item
}
