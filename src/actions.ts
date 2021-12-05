import { ActivateAction, ITabs, IView, KillViewAction } from '.'

export function activate(tabs: ITabs, index: number): ActivateAction {
  return {
    actionType: 'tabs',
    type: 'activate',
    active: index,
    tabsId: tabs.id,
  }
}

export function closeAll(tabs: ITabs): KillViewAction {
  return {
    actionType: 'kill',
    viewId: tabs.id,
    simplify: true,
    viewType: 'tabs',
  }
}

export function closeView(view: IView): KillViewAction {
  return {
    actionType: 'kill',
    viewType: 'view',
    viewId: view.id,
    simplify: true,
  }
}
