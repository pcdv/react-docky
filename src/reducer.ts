/*
           o1
+----------+----------+
|    x1    |    x2    |
|          |          |
|a1  d1  i1|a2  d2  i2|
|          |          |
|    y1    |    y2    |
+----------+----------+
           o2

x = h OR v

x[U, V) ^ i1(W) = x[x[U, W), V)
x[U, V) ^ a1(W) = x[x[W, U), V)

x[U, V) ^ a2(W) = x[U, x[W, V))
x[U, V) ^ i2(W) = x[U, x[V, W))

h(U, V) ^ o1(W) = v(W, h(U, V))
h(U, V) ^ o2(W) = v(h(U, V), W)

h(U, V) ^ x1(W) = h(v(W, U), V)
h(U, V) ^ y1(W) = h(v(U, W), V) 

h(U, V) ^ x2(W) = h(U, v(W, V))
h(U, V) ^ y2(W) = h(U, v(V, W))

*/
import { IBox, ITabs, IView } from './types'
import { genId } from './util'

export type BoxTransformType =
  | 'i1'
  | 'i2'
  | 'a1'
  | 'a2'
  | 'x1'
  | 'x2'
  | 'y1'
  | 'y2'
  | 'o1'
  | 'o2'
  | 'd1'
  | 'd2'

export type BoxAction = {
  actionType: 'box'
  boxId: string
  type: BoxTransformType
  view: IView | ITabs
}

export type KillViewAction = {
  actionType: 'kill'
  viewType: 'view' | 'tabs'
  viewId: string
  simplify?: boolean
}

type ResizeAction = {
  actionType: 'resize'
  boxId: string
  size: number
}

export type ActivateAction = {
  actionType: 'tabs'
  type: 'activate'
  tabsId: string
  active: number
}

export type DockAction = KillViewAction | BoxAction | ResizeAction | ActivateAction

type BoxTransform = (box: IBox, view: IView | ITabs) => IBox

const id = () => genId('box')

// undefined size is to default to 50% and avoid having a size that is bigger than the pane
const und = undefined

function rotate(box: IBox): IBox {
  return {
    ...box,
    size: und,
    orientation: box.orientation === 'horizontal' ? 'vertical' : 'horizontal',
  }
}

function addView(tabs: ITabs, view: IView | ITabs) {
  if (!tabs || !tabs.tabs) {
    console.log('Invalid action', tabs);
    return tabs
  }
  if (view.type === 'tabs')
    return {
      ...tabs,
      tabs: [...tabs.tabs, ...view.tabs],
      active: tabs.tabs.length + (tabs.active || 0),
    }
  return { ...tabs, tabs: [...tabs.tabs, view], active: tabs.tabs.length }
}

export function wrap(view: IView | ITabs): ITabs {
  if (view.type === 'tabs') return view
  return {
    type: 'tabs',
    id: genId('tabs'),
    tabs: [view],
  }
}

const BOX_TRANSFORMS: Record<BoxTransformType, BoxTransform> = {
  i1: (b, v) => ({ ...b, size: und, one: { ...b, id: id(), two: wrap(v) } }),
  a1: (b, v) => ({ ...b, size: und, one: { ...b, id: id(), one: wrap(v), two: b.one } }),
  a2: (b, v) => ({ ...b, size: und, two: { ...b, id: id(), one: wrap(v) } }),
  i2: (b, v) => ({ ...b, size: und, two: { ...b, id: id(), two: wrap(v), one: b.two } }),
  y1: (b, v) => ({ ...b, one: rotate({ ...b, id: id(), two: wrap(v) }) }),
  y2: (b, v) => ({ ...b, two: rotate({ ...b, id: id(), one: b.two, two: wrap(v) }) }),
  x1: (b, v) => ({ ...b, one: rotate({ ...b, id: id(), one: wrap(v), two: b.one }) }),
  x2: (b, v) => ({ ...b, two: rotate({ ...b, id: id(), one: wrap(v) }) }),
  d1: (b, v) => ({ ...b, one: addView(b.one as ITabs, v) }),
  d2: (b, v) => ({ ...b, two: addView(b.two as ITabs, v) }),
  o1: (b, v) => rotate({ ...b, two: { ...b, id: id() }, one: wrap(v) }),
  o2: (b, v) => rotate({ ...b, one: { ...b, id: id() }, two: wrap(v) }),
}

const resize = (box: IBox, size: number) => ({ ...box, size })

/**
 * Remove dead views, recursively clear empty containers.
 */
export function simplify(s: IBox | ITabs | null | undefined): IBox | ITabs | null {
  if (!s) return null

  switch (s.type) {
    case 'box':
      const one = simplify(s.one)
      const two = simplify(s.two)
      return one && two ? { ...s, one: one, two: two } : one ? one : two ? two : null

    case 'tabs':
      if (s.dead) return null
      const tabs = s.tabs.filter(v => !v.dead)
      return tabs.length ? { ...s, tabs } : null
  }
}

export function reducer(s: IBox | ITabs | null | undefined, action: DockAction): IBox {
  console.log(action)

  if (action.actionType === 'box')
    s = reducer0(s, { actionType: 'kill', viewType: action.view.type, viewId: action.view.id })

  s = reducer0(s, action)

  if (action.actionType !== 'kill' || action.simplify) {
    s = simplify(s)
  }

  if (!s) return { type: 'box', id: 'box0', orientation: 'horizontal' }

  if (s?.type === 'box') return s

  return { type: 'box', orientation: 'horizontal', id: 'root', one: s }
}

function boxReducer(s: IBox, action: DockAction): IBox {
  if ((action.actionType === 'box' || action.actionType === 'resize') && s.id === action.boxId) {
    if (action.actionType === 'resize') return resize(s, action.size)
    else return BOX_TRANSFORMS[action.type](s, action.view)
  }

  return {
    ...s,
    one: reducer0(s.one, action),
    two: reducer0(s.two, action),
  }
}

function tabReducer(s: ITabs, action: DockAction): ITabs {
  if (action.actionType === 'kill') {
    if (action.viewType === 'tabs' && action.viewId === s.id) return { ...s, dead: true }
    const pos = s.tabs.findIndex(v => v.id === action.viewId)
    return pos === -1
      ? s
      : {
          ...s,
          tabs: [...s.tabs.slice(0, pos), { ...s.tabs[pos], dead: true }, ...s.tabs.slice(pos + 1)],
          active: s.active && s.active >= pos ? s.active - 1 : s.active,
        }
  }
  if (action.actionType === 'tabs' && action.tabsId === s.id) {
    return { ...s, active: action.active }
  }
  return s
}

function reducer0(
  s: IBox | ITabs | null | undefined,
  action: DockAction
): IBox | ITabs | null | undefined {
  if (!s) return null

  switch (s.type) {
    case 'box':
      return boxReducer(s, action)
    case 'tabs':
      return tabReducer(s, action)
  }

  return s
}
