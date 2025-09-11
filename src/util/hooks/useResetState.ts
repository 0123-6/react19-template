import {reactive, type Ref, ref} from 'vue'

// 方便恢复ref定义的数据
export const useResetRef = <T>(factory: () => T): {
  state: Ref<T>,
  resetState: (newValue?: T) => void,
} => {
  const state = ref(factory()) as Ref<T>
  // 重置数据或修改数据
  const resetState = (newValue?: T) => {
    state.value = newValue ?? factory()
  }

  return {
    state,
    resetState,
  }
}

// 方便恢复reactive定义的数据
export const useResetReactive = <T extends Record<string, any>>(factory: () => T): {
  state: T,
  resetState: (newValue?: Partial<T>) => void,
} => {
  const state = reactive(factory()) as T
  // 重置数据或修改数据
  const resetState = (newValue?: Partial<T>) => {
    Object.assign(state, newValue ?? factory())
  }

  return {
    state,
    resetState,
  }
}