import type {IBaseProps} from '@/components/IBaseProps.ts'
import {useResetState} from '@/util/hooks/useResetState.ts'
import {Fragment, useEffect} from 'react'
import {watchLocationPathname} from '@/util/watchLocationPathname.ts'
import {router} from '@/router'

export default function BreadcrumbComp(props: IBaseProps) {
  const [menuList, setMenuList] = useResetState((): string[] => [])
  const getMenuList = () => {
    queueMicrotask(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const newMenuList = router.state.matches.slice(1).map(matched => matched.route.name as string)
      setMenuList(newMenuList)
    })
  }
  useEffect(() => {
    getMenuList()
    return watchLocationPathname(getMenuList)
  }, [])

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
