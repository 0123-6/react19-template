import {type DependencyList, useEffect, useRef} from 'react'

export const useAsyncEffect = (
  effect: () => void | (() => void) | Promise<void>,
  deps?: DependencyList,
  options?: {
    immediate?: boolean,
  },
) => {
  const immediate = options?.immediate ?? true
  const isMountedRef = useRef(false)
  useEffect(() => {
    // 第一次进入
    if (isMountedRef.current === false) {
      isMountedRef.current = true
      if (!immediate) {
        return
      }
    }

    const result = effect()
    if (typeof result === 'function') {
      return result
    }
  }, deps)
}
