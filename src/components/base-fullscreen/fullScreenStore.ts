import type {IUseSyncExternalStoreProps} from '@/util/hooks/IUseSyncExternalStoreProps.ts'
import {errorMessage} from '@/util/message.ts'

const fullscreenerrorEvent = () => {
  errorMessage('切换全屏操作失败!')
}

export const fullScreenStore: IUseSyncExternalStoreProps = {
  subscribe: sub => {
    document.addEventListener('fullscreenchange', sub)
    document.addEventListener('fullscreenerror', fullscreenerrorEvent)

    return () => {
      document.removeEventListener('fullscreenchange', sub)
      document.removeEventListener('fullscreenerror', fullscreenerrorEvent)
    }
  },
  getSnapshot: () => {
    return !!document.fullscreenElement
  },
  switchFullScreen: () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  },
}
