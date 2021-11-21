/*
          o1
+---------+----------+
|    x1   |    x2    |
|         |          |
|a1     i1|a2      i2|
|         |          |
|    y1   |    y2    |
+---------+----------+
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
import { genId, wrap } from './util'

export type BoxTransformType = 'i1' | 'i2' | 'a1' | 'a2' | 'x1' | 'x2' | 'y1' | 'y2' | 'o1' | 'o2'

export type BoxAction = {
  type: BoxTransformType
  boxId: string
  view: IView
}

export type ViewTransformType = 'kill'

export type ViewAction = {
  type: ViewTransformType
  viewId: string
  simplify?: boolean
}

export type ResizeAction = {
  type: 'r'
  boxId: string
  size: number
}

export type DockAction = ViewAction | BoxAction | ResizeAction

type BoxTransform = (box: IBox, view: IView) => IBox

const id = () => genId('box')

function rotate(box: IBox): IBox {
  return { ...box, orientation: box.orientation === 'horizontal' ? 'vertical' : 'horizontal' }
}

const BOX_TRANSFORMS: Record<BoxTransformType, BoxTransform> = {
  i1: (b, v) => ({ ...b, one: { ...b, id: id(), two: wrap(v) } }),
  a1: (b, v) => ({ ...b, one: { ...b, id: id(), one: wrap(v), two: b.one } }),
  a2: (b, v) => ({ ...b, two: { ...b, id: id(), one: wrap(v) } }),
  i2: (b, v) => ({ ...b, two: { ...b, id: id(), two: wrap(v), one: b.two } }),
  x1: (b, v) => ({ ...b, one: rotate({ ...b, id: id(), one: wrap(v), two: b.one }) }),
  y1: (b, v) => ({ ...b, one: rotate({ ...b, id: id(), two: wrap(v) }) }),
  x2: (b, v) => ({ ...b, two: rotate({ ...b, id: id(), one: wrap(v) }) }),
  y2: (b, v) => ({ ...b, two: rotate({ ...b, id: id(), one: b.two, two: wrap(v) }) }),
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
      const tabs = s.tabs.filter(v => !v.dead)
      return tabs.length ? { ...s, tabs } : null
  }
}

export function reducer(s: IBox | ITabs | null | undefined, action: DockAction): IBox {
  if (action.type !== 'kill' && action.type !== 'r')
    s = reducer0(s, { type: 'kill', viewId: action.view.id })

  s = reducer0(s, action)

  if (action.type !== 'kill' || action.simplify) {
    s = simplify(s)
  }

  if (!s) return { type: 'box', id: 'box0', orientation: 'horizontal' }

  if (s?.type === 'box') return s

  return { type: 'box', orientation: 'horizontal', id: 'root', one: s }
}

function boxReducer(s: IBox, action: DockAction): IBox {
  if (action.type != 'kill' && s.id === action.boxId) {
    if (action.type === 'r') return resize(s, action.size)
    else return BOX_TRANSFORMS[action.type](s, action.view)
  }

  return {
    ...s,
    one: reducer0(s.one, action),
    two: reducer0(s.two, action),
  }
}

function tabReducer(s: ITabs, action: DockAction): ITabs {
  if (action.type === 'kill') {
    const pos = s.tabs.findIndex(v => v.id === action.viewId)
    return pos === -1
      ? s
      : {
          ...s,
          tabs: [...s.tabs.slice(0, pos), { ...s.tabs[pos], dead: true }, ...s.tabs.slice(pos + 1)],
        }
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
