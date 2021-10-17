import { findContainer, findView, reducer } from './reducer'
import { sample } from './samples'

describe('views can be moved from a container to another (case 1)', () => {
  expect((findView(sample, 'blue') || [])[1]).toMatchObject({ id: 'tabs4' })

  const after = reducer(sample, {
    type: 'move-to-tab',
    containerId: 'tabs1',
    viewId: 'blue',
  })

  it('moves the view to the expected container', () => {
    expect((findView(after, 'blue') || [])[1]).toMatchObject({ id: 'tabs1' })
  })

  it('deletes the previous container when empty', () => {
    expect(findContainer(after, 'tabs4')).toBeUndefined()
  })
})

describe('views can be moved from a container to another (case 2)', () => {
  let s = sample

  s = reducer(s, {
    type: 'move-to-tab',
    containerId: 'tabs1',
    viewId: 'blue',
  })

  s = reducer(s, {
    type: 'move-to-tab',
    containerId: 'tabs2',
    viewId: 'red',
  })

  s = reducer(s, {
    type: 'move-to-tab',
    containerId: 'tabs2',
    viewId: 'blue',
  })


  it('blue ends up in tabs2', () => {
    expect((findView(s, 'blue') || [])[1]).toMatchObject({ id: 'tabs2' })
  })

  it('red ends up in tabs2', () => {
    expect((findView(s, 'red') || [])[1]).toMatchObject({ id: 'tabs2' })
  })
})
