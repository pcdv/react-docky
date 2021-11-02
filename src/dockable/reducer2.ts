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

type BoxTransform = (box: IBox, view: IView) => IBox | ITabs | null

const BOX_TRANSFORMS: Record<BoxTransformType, BoxTransform> = {
  i1: (b, v) => ({ ...b, first: { ...b, id: genId('box'), second: wrap(v) } }),
  a1: (b, v) => ({ ...b, first: { ...b, id: genId('box'), first: wrap(v), second: b.first } }),
  a2: (b, v) => ({ ...b, second: { ...b, id: genId('box'), first: wrap(v) } }),
  i2: (b, v) => ({ ...b, second: { ...b, id: genId('box'), second: wrap(v), first: b.second } }),
  o1: (b, v) => ({ ...b, second: { ...b, id: genId('box') }, first: wrap(v), orientation: rot(b) }),
  o2: (b, v) => ({ ...b, first: { ...b, id: genId('box') }, second: wrap(v), orientation: rot(b) }),
  x1: (b, v) => ({ ...b, first: { ...b, id: genId('box'), orientation: rot(b), first: wrap(v), second: b.first } }),
  x2: (b, v) => ({ ...b, second: { ...b, id: genId('box'), orientation: rot(b), first: wrap(v) } }),
  y1: (b, v) => ({ ...b, first: { ...b, id: genId('box'), orientation: rot(b), second: wrap(v) } }),
  y2: (b, v) => ({ ...b, second: { ...b, id: genId('box'), orientation: rot(b), first: b.second, second: wrap(v) } }),
}

function rot(box: IBox): Orientation {
  return box.orientation === 'horizontal' ? 'vertical' : 'horizontal'
}

/**
 * Remove dead views, recursively clear empty containers.
 */
export function simplify(s: IBox | ITabs | null | undefined): IBox | ITabs | null {
  if (!s) return null

  switch (s.type) {
    case 'box':
      const first = simplify(s.first)
      const second = simplify(s.second)
      return first && second ? { ...s, first, second } : first ? first : second ? second : null

    case 'tabs':
      const tabs = s.tabs.filter(v => !v.dead)
      return tabs.length ? { ...s, tabs } : null
  }
}

export function reducer(s: IBox | ITabs | null | undefined, action: BoxAction | ViewAction): IBox {
  s = reducer0(s, action)

  if (action.type !== 'kill' || action.simplify) {
    s = simplify(s)
  }

  if (!s) return { type: 'box', id: 'box0', orientation: 'horizontal' }

  if (s?.type === 'box') return s

  return { type: 'box', orientation: 'horizontal', id: 'root', first: s }
}

function reducer0(s: IBox | ITabs | null | undefined, action: BoxAction | ViewAction): IBox | ITabs | null | undefined {
  if (!s) return s

  if (action.type === 'kill') {
    if (s.type === 'tabs') {
      const pos = s.tabs.findIndex(v => v.id === action.viewId)
      if (pos === -1) return s
      else
        return {
          ...s,
          tabs: [...s.tabs.slice(0, pos), { ...s.tabs[pos], dead: true }, ...s.tabs.slice(pos + 1)],
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
      if (action.boxId === s.id) return BOX_TRANSFORMS[action.type](s, action.view)
      return {
        ...s,
        first: reducer0(s.first, action),
        second: reducer0(s.second, action),
      }
    }
  }
  return s
}
