import {baseFetch, type IBaseFetch, type IBaseFetchReturn, type IResponseData} from '@/util/api'
import {type RefObject, useEffect, useRef} from 'react'
import {useResetState} from '@/util/hooks/useResetState.ts'

export interface IUseBaseFetch {
  // 在beforeFetch中需要重置的状态的重置函数
  beforeFetchResetFn?: () => void,
  // 因为这是要多次执行的,所以不能传递一个一次性值,而是一个函数,获取当时的期待值
  fetchOptionFn: () => IBaseFetch,
  // 对response.data的自定义处理函数
  transformResponseDataFn?: (responseData: any, responseDataAll: IResponseData) => void,
  // 立即加入微任务队列
  microTask?: boolean,
  // 统一处理
  finalCallback?: (fetchObject: IBaseFetchReturn) => void,
}

export interface IUseBaseFetchReturn {
  readonly isFetching: boolean,
  doFetch: () => Promise<boolean>,
}

// 通用fetch封装
export const useBaseFetch = (props: IUseBaseFetch)
  : IUseBaseFetchReturn => {
  const {
    beforeFetchResetFn,
    fetchOptionFn,
    transformResponseDataFn,
    microTask = false,
    finalCallback,
  } = props

  // 前置hook函数
  const abortControllerRef: RefObject<AbortController> = useRef(new AbortController())
  const [isFetching, setIsFetching, resetIsFetching] = useResetState(() => false)
  const doFetch = async (): Promise<boolean> => {
    abortControllerRef.current.abort()
    abortControllerRef.current = new AbortController()
    setIsFetching(true)
    beforeFetchResetFn?.()
    const fetchObject = await baseFetch({
      signal: abortControllerRef.current.signal,
      ...fetchOptionFn(),
    })
    if (!fetchObject.isOk) {
      if (fetchObject.reason !== 'AbortError') {
        resetIsFetching()
      }
      finalCallback?.(fetchObject)
      return false
    }
    transformResponseDataFn?.(fetchObject.responseData?.data, fetchObject.responseData)
    resetIsFetching()
    finalCallback?.(fetchObject)
    return true
  }
  useEffect(() => {
    if (microTask) {
      queueMicrotask(doFetch)
    }
  }, [])

  return {
    isFetching,
    doFetch,
  }
}