import {useState, type Dispatch, type SetStateAction } from 'react'

// 带reset功能的useState
export const useResetState = <T>(factory: () => T)
  : [T, Dispatch<SetStateAction<T>>, () => void] => {
  const [state, setState] = useState<T>(factory)
  const resetState = () => {
    setState(factory())
  }
  return [state, setState, resetState]
}