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
import { IBox, ITabs, IView, Orientation } from './types'
import { genId, wrapView } from './util'

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

type BoxTransform = (box: IBox, view: IView) => IBox | ITabs | null

const BOX_TRANSFORMS: Record<BoxTransformType, BoxTransform> = {
  i1: (box, view) => ({
    ...box,
    first: { ...box, id: genId('box'), second: wrapView(view) },
  }),
  a2: (box, view) => ({
    ...box,
    second: { ...box, id: genId('box'), first: wrapView(view) },
  }),
  a1: (box, view) => ({
    ...box,
    first: {
      ...box,
      id: genId('box'),
      first: wrapView(view),
      second: box.first,
    },
  }),
  i2: (box, view) => ({
    ...box,
    second: {
      ...box,
      id: genId('box'),
      second: wrapView(view),
      first: box.second,
    },
  }),
  o1: (box, view) => ({
    ...box,
    orientation: rotated(box),
    first: wrapView(view),
    second: { ...box, id: genId('box') },
  }),
  o2: (box, view) => ({
    ...box,
    orientation: rotated(box),
    second: wrapView(view),
    first: { ...box, id: genId('box') },
  }),
  x1: (box, view) => ({
    ...box,
    first: {
      ...box,
      id: genId('box'),
      orientation: rotated(box),
      first: wrapView(view),
      second: box.first,
    },
  }),
  x2: (box, view) => ({
    ...box,
    second: {
      ...box,
      id: genId('box'),
      orientation: rotated(box),
      first: wrapView(view),
    },
  }),
  y1: (box, view) => ({
    ...box,
    first: {
      ...box,
      id: genId('box'),
      orientation: rotated(box),
      second: wrapView(view),
    },
  }),
  y2: (box, view) => ({
    ...box,
    second: {
      ...box,
      id: genId('box'),
      orientation: rotated(box),
      first: box.second,
      second: wrapView(view),
    },
  }),
}

function rotated(box: IBox): Orientation {
  return box.orientation === 'horizontal' ? 'vertical' : 'horizontal'
}

/**
 * Remove dead views, recursively clear empty containers.
 */
export function simplify(
  s: IBox | ITabs | null | undefined
): IBox | ITabs | null {
  if (!s) return null

  switch (s.type) {
    case 'box':
      const first = simplify(s.first)
      const second = simplify(s.second)
      return first && second
        ? { ...s, first, second }
        : first
        ? first
        : second
        ? second
        : null

    case 'tabs':
      const tabs = s.tabs.filter(v => !v.dead)
      return tabs.length ? { ...s, tabs } : null
  }
}

export function reducer(
  s: IBox | ITabs | null | undefined,
  action: BoxAction | ViewAction
): IBox {
  console.log(action);
  s = reducer0(s, action)

  if (action.type !== 'kill' || action.simplify) {
    s = simplify(s)
  }

  if (!s) return { type: 'box', id: 'box0', orientation: 'horizontal' }

  if (s?.type === 'box') return s

  return { type: 'box', orientation: 'horizontal', id: 'box000', first: s }
}

function reducer0(
  s: IBox | ITabs | null | undefined,
  action: BoxAction | ViewAction
): IBox | ITabs | null | undefined {
  if (!s) return s

  

  if (action.type === 'kill') {
    if (s.type === 'tabs') {
      const pos = s.tabs.findIndex(v => v.id === action.viewId)
      if (pos === -1) return s
      else
        return {
          ...s,
          tabs: [
            ...s.tabs.slice(0, pos),
            { ...s.tabs[pos], dead: true },
            ...s.tabs.slice(pos + 1),
          ],
        }
    } else if (s.type === 'box') {
      return {
        ...s,
        first: reducer0(s.first, action),
        second: reducer0(s.second, action),
      }
    }
  } else {
    if (s.type === 'box') {
      if (action.boxId === s.id)
        return BOX_TRANSFORMS[action.type](s, action.view)
      return {
        ...s,
        first: reducer0(s.first, action),
        second: reducer0(s.second, action),
      }
    }
  }
  return s
}
