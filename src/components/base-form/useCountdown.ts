import {useResetState} from '@/util/hooks/useResetState.ts'
import {useEffect, useRef} from 'react'

interface IUseCountdownReturn {
  readonly isRunning: boolean,
  readonly countdown: number,
  begin: () => void,
}

export const useCountdown = (sum: number = 60)
  : IUseCountdownReturn => {
  if (sum <= 0) {
    throw new Error('useCountdown的参数需为正整数,请检查参数')
  }
  const [countdown, setCountdown, resetCountdown] = useResetState((): number => Math.floor(sum))
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined)

  const cancel = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = undefined
    }
    resetCountdown()
  }

  useEffect(
    () => cancel,
    [],
  )

  const begin = () => {
    if (timerRef.current) {
      return
    }

    timerRef.current = setInterval(() => {
      setCountdown(prevState => {
        const newValue = prevState - 1
        if (newValue === 0) {
          cancel()
        }
        return newValue
      })
    }, 1000)
  }

  return {
    get isRunning() {
      return !!timerRef.current
    },
    countdown,
    begin,
  }
}




















