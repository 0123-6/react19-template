import {createRoot} from 'react-dom/client'
import {createElement, type ReactElement} from 'react'

export default function renderComp(comp: (props: any) => ReactElement, props: Record<string, any> | (() => Record<string, any>))
  : () => void {
  const container = document.createElement('div')
  container.className = 'hpj'
  const root = createRoot(container)

  return () => {
    const element = createElement(comp, {
      ...(typeof props === 'object' ? {...props} : {...props()}),
      cancel: () => {
        queueMicrotask(() => {
          document.body.removeChild(container)
          root.render(null)
        })
      },
    })
    document.body.appendChild(container)
    root.render(element)
  }
}
