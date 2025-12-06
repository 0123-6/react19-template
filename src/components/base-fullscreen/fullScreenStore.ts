import type {IUseSyncExternalStoreProps} from '@/util/hooks/IUseSyncExternalStoreProps.ts'
import {errorMessage} from '@/util/message.ts'

const fullscreenerrorEvent = () => {
  errorMessage('切换全屏操作失败!')
}

type IProps = IUseSyncExternalStoreProps<boolean> & {
  switchFullScreen: () => void,
}

export const fullScreenStore: IProps = {
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
  set: () => undefined,
  switchFullScreen: () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  },
}
