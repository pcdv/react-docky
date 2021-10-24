import { IBox } from './Box'
import { ITabs, IView } from './ViewContainer'
import { cloneDeep } from 'lodash'

type State = IBox

export type Direction = 'left' | 'right' | 'top' | 'bottom'

export type Action =
  | {
      type: 'move-to-tab'
      viewId: string
      containerId: string
    }
  | {
      type: 'move'
      direction: Direction
      viewId: string
      containerId: string
    }

export function reducer(state: State, action: Action): State {
  const s = cloneDeep(state)
  switch (action.type) {
    case 'move-to-tab': {
      const view = removeView(s, action)
      const tabs = findContainer(s, action.containerId) as ITabs
      if (tabs && view) tabs.tabs.push(view)
      return s
    }

    case 'move': {
      console.log(
        'drop ' +
          action.viewId +
          ' on ' +
          action.direction +
          ' of ' +
          action.containerId
      )
      const res = findView(s, action.viewId)
      if (res) {
        const [view, tabs, index, path] = res
        tabs.tabs.splice(index, 1)
        let parent = path[path.length - 1]
        //if (parent.type === 'tabs') parent = path[path.length - 2]
        //insert(parent, )
      }
      return s
    }
  }
}

function isContainerEmpty(container: IBox | ITabs): boolean {
  switch (container.type) {
    case 'tabs':
      return !container.tabs.length
    case 'box':
      return !container.first && !container.second
  }
}
/**
 * Removes specified view from its container, cleaning up empty containers along the way.
 * Returns the removed view.
 */
function removeView(s: State, action: Action, stack: IBox[] = []) {
  const res = findView(s, action.viewId)
  if (res) {
    const [view, tabs, index, path] = res
    tabs.tabs.splice(index, 1)

    for (let i = path.length - 1; i >= 0; i--) {
      const container = path[i]
      if (isContainerEmpty(container)) {
        const parent = path[i - 1] as IBox
        if (parent.first?.id === container.id) {
          parent.first = undefined
        } else if (parent.second?.id === container.id) {
          parent.second = undefined
        }
      }
    }
    return view
  }
}

type ViewPath = [IView, ITabs, number, (IBox | ITabs)[]]

export function findView(state: IBox, id: string): ViewPath | undefined {
  return _findView(state, id, [state])
}

function _findView(
  state: IBox | ITabs,
  id: string,
  path: (IBox | ITabs)[]
): ViewPath | undefined {
  if (state.type === 'tabs') {
    const index = state.tabs.findIndex(v => v.id === id)
    if (index !== -1) return [state.tabs[index], state, index, path]
    return undefined
  }

  let res: ViewPath | undefined
  if (state.first) {
    res = _findView(state.first, id, [...path, state.first])
    if (res) return res
  }

  if (state.second) {
    res = _findView(state.second, id, [...path, state.second])
    if (res) return res
  }
}

export function findContainer(
  state: IBox | ITabs,
  id: string
): ITabs | IBox | undefined {
  if (state.id === id) return state

  switch (state.type) {
    case 'box':
      if (state.first) {
        const res = findContainer(state.first, id)
        if (res) return res
      }
      if (state.second) {
        const res = findContainer(state.second, id)
        if (res) return res
      }
      return undefined
  }
}
