import { describe, expect, it } from 'vitest'
import { addView, collectViews } from './layout.js'
import { IBox, ITabs } from './types.js'
import { repr } from './util.js'
import { tabs, view } from './test-utils.js'

const empty: IBox = { type: 'box', id: 'R', orientation: 'horizontal' }

const layout: IBox = {
  type: 'box',
  id: 'R',
  orientation: 'horizontal',
  one: tabs('T1', ['a', 'b'], 1),
  two: { type: 'box', id: 'B', orientation: 'vertical', one: tabs('T2', ['c']), two: tabs('T3', ['d']) },
}

describe('addView', () => {
  it('fills the empty sides of the root box', () => {
    const one = addView(empty, view('a'))
    expect(repr(one)).toBe('h(a, null)')
    expect(repr(addView(one, view('b')))).toBe('h(a, b)')
  })

  it('puts the view after the last one', () => {
    expect(repr(addView(layout, view('x')))).toBe('h(a-b, h(v(c, d), x))')
  })

  it('adds the view as the active tab of a group', () => {
    const added = addView(layout, view('x'), 'T2')
    expect(repr(added)).toBe('h(a-b, v(c-x, d))')
    const group = (added.two as IBox).one as ITabs
    expect(group.active).toBe(1)
  })

  it('adds the view to the group of another view', () => {
    expect(repr(addView(layout, view('x'), 'b'))).toBe('h(a-b-x, v(c, d))')
  })

  it('puts the view after the last one when there is no such group', () => {
    expect(repr(addView(layout, view('x'), 'unknown'))).toBe('h(a-b, h(v(c, d), x))')
  })

  it('does not modify the layout', () => {
    const before = JSON.stringify(layout)
    addView(layout, view('x'))
    addView(layout, view('x'), 'T2')
    expect(JSON.stringify(layout)).toBe(before)
  })
})

describe('collectViews', () => {
  it('returns all the views, active or not', () => {
    expect(collectViews(layout).map(v => v.id)).toEqual(['a', 'b', 'c', 'd'])
  })
})
