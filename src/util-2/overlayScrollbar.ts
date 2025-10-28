import {OverlayScrollbars} from 'overlayscrollbars'
import {projectConfig} from '../../project.config.ts'

if (!(projectConfig.isUseCdn && import.meta.env.PROD)) {
  import('overlayscrollbars/overlayscrollbars.css')
}

export interface IOverlayScrollbar {
  element: HTMLElement
  autoHide?: boolean
  autoHideDelay?: number
}

export default function overlayScrollbar(props: IOverlayScrollbar) {
  const {
    element,
    autoHide = true,
    autoHideDelay = 0,
  } = props

  // 如果是body元素，
  if (element instanceof HTMLBodyElement) {
    document.documentElement.setAttribute('data-overlayscrollbars-initialize', '')
  }
  element.setAttribute('data-overlayscrollbars-initialize', '')

  return OverlayScrollbars(element, {
    scrollbars: {
      autoHide: autoHide ? 'leave' : 'never',
      autoHideDelay: autoHideDelay,
    },
  })
}