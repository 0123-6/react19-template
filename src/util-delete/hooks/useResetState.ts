import {reactive, type Ref, ref} from 'vue'

// 方便恢复ref定义的数据
export const useResetRef = <T>(factory: () => T)
  : [Ref<T>, () => void] => {
  const state = ref(factory()) as Ref<T>
  // 重置数据
  const resetState = () => {
    state.value = factory()
  }

  return [state, resetState]
}

// 方便恢复reactive定义的数据
export const useResetReactive = <T extends Record<string, any>>(factory: () => T)
  : [T, () => void] => {
  const state = reactive(factory()) as T
  // 重置数据
  const resetState = () => {
    Object.assign(state, factory())
  }

  return [state, resetState]
}