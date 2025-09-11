// 保存原生 pushState 和 replaceState 方法
const originalPushState = history.pushState
const originalReplaceState = history.replaceState
// 上一次的location.pathname
let lastPathname = location.pathname
const callbackSet = new Set<(pathname: string) => void>()

const triggerCallback = () => {
  if (lastPathname === location.pathname) {
    return
  }
  lastPathname = location.pathname
  for (const callback of callbackSet) {
    callback(location.pathname)
  }
}

// 覆盖 pushState
history.pushState = (...args) => {
  Reflect.apply(originalPushState, history, args)
  triggerCallback()
}

// 覆盖 replaceState
history.replaceState = (...args) => {
  Reflect.apply(originalReplaceState, history, args)
  triggerCallback()
}

// 监听 popstate 事件（后退、前进按钮触发）
window.addEventListener('popstate', triggerCallback)

// 监听location.pathname的变化
export const watchLocationPathname = (callback: (pathname: string) => void) => {
  if (callbackSet.has(callback)) {
    if (import.meta.env.DEV) {
      alert('callback已经注册过watchLocationPathname,请检查代码')
      console.error('callback已经注册过watchLocationPathname,请检查代码')
    }
    return
  }

  callbackSet.add(callback)
  return () => {
    callbackSet.delete(callback)
  }
}