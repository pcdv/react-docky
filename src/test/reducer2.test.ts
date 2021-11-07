import { BoxAction, reducer, simplify, BoxTransformType } from '../reducer2'
import { repr, wrap } from '../util'
import { IBox, ITabs, IView, Orientation } from '../types'

let IDS: Record<string, number> = {}

function genView(type: string): IView {
  const count = IDS[type] || 0
  IDS[type] = count + 1
  return {
    type: 'view',
    viewType: type,
    id: type,
  }
}

function act(type: BoxTransformType, boxId: string = 'b0'): BoxAction {
  return { type, view: genView('W'), boxId }
}

const S0: IBox = {
  type: 'box',
  id: 'b0',
  one: wrap(genView('U')),
  two: wrap(genView('V')),
  orientation: 'horizontal',
}

describe('Transforms are working', () => {
  expect(repr(S0)).toBe('h(U, V)')

  it('a1 works', () => {
    expect(repr(reducer(S0, act('a1')))).toBe('h(h(W, U), V)')
  })
  it('i2 works', () => {
    expect(repr(reducer(S0, act('i2')))).toBe('h(U, h(V, W))')
  })
  it('i1 works', () => {
    expect(repr(reducer(S0, act('i1')))).toBe('h(h(U, W), V)')
  })
  it('a2 works', () => {
    expect(repr(reducer(S0, act('a2')))).toBe('h(U, h(W, V))')
  })
  it('o1 works', () => {
    expect(repr(reducer(S0, act('o1')))).toBe('v(W, h(U, V))')
  })
  it('o2 works', () => {
    expect(repr(reducer(S0, act('o2')))).toBe('v(h(U, V), W)')
  })
  it('x1 works', () => {
    expect(repr(reducer(S0, act('x1')))).toBe('h(v(W, U), V)')
  })
  it('x2 works', () => {
    expect(repr(reducer(S0, act('x2')))).toBe('h(U, v(W, V))')
  })
  it('y1 works', () => {
    expect(repr(reducer(S0, act('y1')))).toBe('h(v(U, W), V)')
  })
  it('y2 works', () => {
    expect(repr(reducer(S0, act('y2')))).toBe('h(U, v(V, W))')
  })
})

describe('Other transforms are working', () => {
  it('kill and simplify works', () => {
    const S1 = reducer(S0, { type: 'kill', viewId: 'U' })
    expect(repr(S1)).toBe('h($U, V)')
    const S2 = simplify(S1 as IBox)
    expect(repr(S2)).toBe('V')
  })
})

let cnt = 0

function tobox(view: string | IBox | ITabs): IBox | ITabs {
  if ((view as any).type) return view as any
  return { type: 'tabs', tabs: [genView(view as string)], id: view as string }
}

function box(
  orientation: Orientation,
  one: IBox | ITabs | string,
  two: IBox | ITabs | string
): IBox {
  return {
    type: 'box',
    id: 'bx' + cnt++,
    orientation: orientation,
    one: tobox(one),
    two: tobox(two),
  }
}

function h(first: IBox | ITabs | string, second: IBox | ITabs | string): IBox {
  return box('horizontal', first, second)
}
function v(first: IBox | ITabs | string, second: IBox | ITabs | string): IBox {
  return box('vertical', first, second)
}

describe('Buggy scenario?', () => {
  const S1 = v(h(v('green', 'orange'), 'red'), 'blue')
  const boxId = S1?.one?.id as string
  const view = (S1.two as ITabs).tabs[0]
  expect(view).toHaveProperty('id', 'blue')

  const S2 = reducer(S1, { type: 'kill', viewId: 'blue' })
  expect(repr(S2)).toBe('v(h(v(green, orange), red), $blue)')

  const S3 = reducer(S2, { type: 'o1', boxId, view })
  expect(repr(S3)).toBe('v(blue, h(v(green, orange), red))')
})
