import { ReactElement } from "react"

/**
 * Provided by the user, renders a view, identified by its viewType and id.
 */
export type ViewRenderer = (view: IView) => ReactElement

export type Orientation = 'vertical' | 'horizontal'

export interface IBox {
  type: 'box'
  id: string
  orientation: Orientation
  one?: IBox | ITabs | null
  two?: IBox | ITabs | null
}

export interface ITabs {
  id: string
  type: 'tabs'
  tabs: IView[]
}

export interface IView {
  id: string
  type: 'view'
  viewType: string
  label?: string
  dead?: boolean
}

export type State = IBox

export type Direction = 'left' | 'right' | 'top' | 'bottom' | 'over'
