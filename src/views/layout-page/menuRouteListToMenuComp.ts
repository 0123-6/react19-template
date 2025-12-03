import type {ItemType, MenuItemType, SubMenuType} from 'antd/es/menu/interface'
import type {IUserInfo} from '@views/system-manage/user-manage/userManageCommon.ts'
import {userStore} from '@/store'
import type {RouteObject} from 'react-router'
import type {IRouteHandle} from '@/router'

const dfsMenu = (menuRoute: RouteObject)
  : ItemType => {
  let result
  // 目录
  if (menuRoute.children) {
    result = {
      children: menuRoute.children.map(dfsMenu),
      icon: menuRoute.handle.icon,
      key: menuRoute.path,
      label: menuRoute.handle.name,
    } as SubMenuType
  } else {
    // 没有children, 表示是具体菜单
    result = {
      icon: menuRoute.handle.icon,
      key: menuRoute.path,
      label: menuRoute.handle.name,
      title: menuRoute.handle.name,
    } as MenuItemType
  }

  return result
}

// 将router定义转为<Menu/>组件需要的格式
export const menuRouteListToMenuComp = (menuRouteList: RouteObject[])
  : ItemType[] => {
  const menuCompList: ItemType[] = []
  for (const menuRoute of menuRouteList) {
    menuCompList.push(dfsMenu(menuRoute))
  }

  return menuCompList
}

const dfsGetUserMenu = (menuRoute: RouteObject)
  : RouteObject => {
  const userObject: IUserInfo = userStore.getSnapshot()
  if (!userObject?.permissionList?.includes((menuRoute.handle as IRouteHandle).name)) {
    return undefined
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return {
    ...menuRoute,
    children: menuRoute?.children?.map(dfsGetUserMenu).filter(Boolean),
  }
}

// 获取该用户拥有的菜单和按钮
export const getUserMenuList = (menuRouteList: RouteObject[])
  : RouteObject[] => {
  const userMenuList: RouteObject[] = []
  for (const menuRoute of menuRouteList) {
    userMenuList.push(dfsGetUserMenu(menuRoute))
  }

  return userMenuList.filter(Boolean)
}

// 将location.pathname转为多段,来高亮当前目录
export const pathnameToMulti = (pathname: string)
  : string[] => {
  const list: string[] = []

  let afterPathname = pathname
  while (afterPathname) {
    list.push(afterPathname)
    const lastIndex = afterPathname.lastIndexOf('/')
    afterPathname = afterPathname.slice(0, lastIndex)
  }

  return list
}






















