import type {IRoute} from '@/router'
import type {ItemType, MenuItemType, SubMenuType} from 'antd/es/menu/interface'

const dfsMenu = (menuRoute: IRoute)
  : ItemType => {
  let result
  // 目录
  if (menuRoute.children) {
    result = {
      children: menuRoute.children.map(dfsMenu),
      icon: menuRoute.meta.icon,
      key: menuRoute.path,
      label: menuRoute.name,
    } as SubMenuType
  } else {
    // 没有children, 表示是具体菜单
    result = {
      icon: menuRoute.meta.icon,
      key: menuRoute.path,
      label: menuRoute.name,
      title: menuRoute.name,
    } as MenuItemType
  }

  return result
}

// 将router定义转为<Menu/>组件需要的格式
export const menuRouteListToMenuComp = (menuRouteList: IRoute[])
  : ItemType[] => {
  const menuCompList: ItemType[] = []
  for (const menuRoute of menuRouteList) {
    menuCompList.push(dfsMenu(menuRoute))
  }

  return menuCompList
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






















