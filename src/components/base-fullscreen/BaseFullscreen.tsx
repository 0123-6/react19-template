import {useSyncExternalStore} from 'react'
import {fullScreenStore} from '@/components/base-fullscreen/fullScreenStore.ts'
import FullScreenIcon from '@/components/base-fullscreen/icon/FullScreenIcon.tsx'
import NotFullScreenIcon from '@/components/base-fullscreen/icon/NotFullScreenIcon.tsx'

export default function BaseFullscreen() {
  const isFullScreen = useSyncExternalStore(fullScreenStore.subscribe, fullScreenStore.getSnapshot)

  return (
    <button
      className={'w-[32px] h-[32px] rounded-full hover:bg-disabled flex justify-center items-center'}
      onClick={fullScreenStore.switchFullScreen}
    >
      {isFullScreen ? <NotFullScreenIcon/> : <FullScreenIcon/>}
    </button>
  )
}
