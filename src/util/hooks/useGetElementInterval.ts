import {onScopeDispose, type Ref} from 'vue'

interface IUseGetElementInterval {
  // id优先级高
  id?: string,
  ref?: Ref<HTMLElement>,
  interval?: number,
  maxTryNumber?: number,
}

export const useGetElementInterval = (props: IUseGetElementInterval) => {
  const {
    id,
    ref,
    interval = 500,
    maxTryNumber = 30,
  } = props
  let element: HTMLElement
  let tryNumber = 0
  let timer = undefined

  const cancelFn = () => {
    clearInterval(timer)
    timer = undefined
  }

  if (!id && !ref) {
    return Promise.reject('id或ref需要提供')
  }

  onScopeDispose(cancelFn)

  return new Promise((resolve: (element: HTMLElement) => void, reject) => {
    timer = setInterval(() => {
      tryNumber++
      if (tryNumber > maxTryNumber) {
        cancelFn()
        reject(`获取id为${id}, ref为${ref}的元素超时`)
        return
      }

      element = id ? document.getElementById(id) : ref?.value
      if (!element) {
        return
      }

      cancelFn()
      resolve(element)
    }, interval)
  })
}