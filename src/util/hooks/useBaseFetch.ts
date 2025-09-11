import {baseFetch, type IBaseFetch, type IResponseData} from '@/util/api'
import {useResetRef} from '@/util/hooks/useResetState'
import {isFalse} from '@/util/validator.ts'

export interface IUseBaseFetch {
  // 在beforeFetch中需要重置的状态的重置函数
  beforeFetchResetFn?: () => void,
  // 因为这是要多次执行的,所以不能传递一个一次性值,而是一个函数,获取当时的期待值
  fetchOptionFn: () => IBaseFetch,
  // 对response.data的自定义处理函数
  transformResponseDataFn?: (responseData: any, responseDataAll: IResponseData) => void,
  // 立即加入微任务队列
  microTask?: boolean,
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
  } = props

  // 前置hook函数
  let abortController: AbortController = new AbortController()
  const {
    state: isFetching,
    resetState: resetIsFetching,
  } = useResetRef(() => false)
  const doFetch = async (): Promise<boolean> => {
    const permission = fetchOptionFn().permission ?? true
    if (isFalse(permission)) {
      return false
    }

    abortController.abort()
    abortController = new AbortController()

    isFetching.value = true
    if (beforeFetchResetFn) {
      beforeFetchResetFn()
    }
    const fetchObject = await baseFetch({
      signal: abortController.signal,
      ...fetchOptionFn(),
    })
    if (!fetchObject.isOk) {
      if (fetchObject.reason !== 'AbortError') {
        resetIsFetching()
      }
      return false
    }
    if (transformResponseDataFn) {
      transformResponseDataFn(fetchObject.responseData?.data, fetchObject.responseData)
    }
    resetIsFetching()
    return true
  }
  if (microTask) {
    queueMicrotask(doFetch)
  }

  return {
    get isFetching() {
      return isFetching.value
    },
    doFetch,
  }
}