import {onScopeDispose, type Ref} from 'vue'
import React, {useEffect} from 'react'

interface IUseGetElementInterval {
  // id优先级高
  id?: string,
  /** React ref 对象（current 指向 HTMLElement） */
  ref?: React.RefObject<HTMLElement>
  interval?: number,
  maxTryNumber?: number,
}

export const useGetElementInterval = (props: IUseGetElementInterval)
  : Promise<HTMLElement> => {
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

  // React 19 中可以直接在 Hook 里使用
  useEffect(cancelFn, [])

  if (!id && !ref) {
    return Promise.reject(new Error('id或ref需要提供'))
  }

  return new Promise((resolve: (element: HTMLElement) => void, reject) => {
    timer = setInterval(() => {
      tryNumber++
      if (tryNumber > maxTryNumber) {
        cancelFn()
        reject(new Error(`获取id为${id}, ref为${ref}的元素超时`))
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