import type {IBaseProps} from '@/components/IBaseProps.ts'
import {Fragment} from 'react'
import {type IRouteHandle} from '@/router'
import {useMatches} from 'react-router'

export default function BreadcrumbComp(props: IBaseProps) {
  const matches = useMatches()
  const menuList = matches.slice(1).map(matched => (matched.handle as IRouteHandle).name)

  return (
    <div
      className={`flex items-center gap-x-2 ${props.className ?? ''}`}
      style={props.style}
    >
      <span>{menuList?.[0]}</span>
      {
        menuList.slice(1).map((menu) => (
          <Fragment key={menu}>
            <span>/</span>
            <span>{menu}</span>
          </Fragment>
        ))
      }
    </div>
  )
}
