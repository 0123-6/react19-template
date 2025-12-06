import {createBrowserRouter, redirect, type RouteObject} from 'react-router'
import {lazy, type ReactElement} from 'react'
import {HomeOutlined, KeyOutlined, SettingOutlined, TagOutlined, UserOutlined} from '@ant-design/icons'
import {userStore} from '@/store'

export interface IRouteHandle {
  name: string,
  icon: ReactElement,
}

export const menuRouteList: RouteObject[] = [
  {
    path: '/index',
    Component: lazy(() => import('@views/index-page/IndexPage.tsx')),
    handle: {
      name: '首页',
      icon: <HomeOutlined/>,
    },
  },
  {
    path: '/system-manage',
    children: [
      {
        path: '/system-manage/user-manage',
        Component: lazy(() => import('@/views/system-manage/user-manage/UserManage.tsx')),
        handle: {
          name: '用户管理',
          icon: <UserOutlined/>,
        },
      },
      {
        path: '/system-manage/role-manage',
        Component: lazy(() => import('@views/system-manage/role-manage/RoleManage.tsx')),
        handle: {
          name: '角色管理',
          icon: <TagOutlined/>,
        },
      },
      {
        path: '/system-manage/permission-manage',
        Component: lazy(() => import('@views/system-manage/permission-manage/PermissionManage.tsx')),
        handle: {
          name: '权限管理',
          icon: <KeyOutlined/>,
        },
      },
    ],
    handle: {
      name: '系统管理',
      icon: <SettingOutlined/>,
    },
  },
  // 业务目录一
  {
    path: '/business-directory-one',
    children: [
      {
        path: '/business-directory-one/business-menu-one-one',
        Component: lazy(() => import('@views/business-directory-one/business-menu-one-one/BusinessMenuOneOne.tsx')),
        handle: {
          name: '业务菜单1-1',
          icon: <HomeOutlined/>,
        },
      },
      {
        path: '/business-directory-one/business-menu-one-two',
        Component: lazy(() => import('@views/business-directory-one/business-menu-one-two/BusinessMenuOneTwo.tsx')),
        handle: {
          name: '业务菜单1-2',
          icon: <HomeOutlined/>,
        },
      },
      {
        path: '/business-directory-one/business-menu-one-three',
        Component: lazy(() => import('@views/business-directory-one/business-menu-one-three/BusinessMenuOneThree.tsx')),
        handle: {
          name: '业务菜单1-3',
          icon: <HomeOutlined/>,
        },
      },
      {
        path: '/business-directory-one/business-menu-one-four',
        Component: lazy(() => import('@views/business-directory-one/business-menu-one-four/BusinessMenuOneFour.tsx')),
        handle: {
          name: '业务菜单1-4',
          icon: <HomeOutlined/>,
        },
      },
    ],
    handle: {
      name: '业务目录一',
      icon: <HomeOutlined/>,
    },
  },
  // 业务目录二
  {
    path: '/business-directory-two',
    children: [
      {
        path: '/business-directory-two/business-menu-two-one',
        Component: lazy(() => import('@views/business-directory-two/business-menu-two-one/BusinessMenuTwoOne.tsx')),
        handle: {
          name: '业务菜单2-1',
          icon: <HomeOutlined/>,
        },
      },
      {
        path: '/business-directory-two/business-menu-two-two',
        Component: lazy(() => import('@views/business-directory-two/business-menu-two-two/BusinessMenuTwoTwo.tsx')),
        handle: {
          name: '业务菜单2-2',
          icon: <HomeOutlined/>,
        },
      },
    ],
    handle: {
      name: '业务目录二',
      icon: <HomeOutlined/>,
    },
  },
]

const routes: RouteObject[] = [
  // 404页面
  {
    path: '*',
    Component: lazy(() => import('@/views/not-found/NotFound.tsx')),
    loader: async () => {
      if (location.pathname === '/') {
        return
      }

      await userStore.fetch()
    },
  },
  // 普通页面
  {
    path: '/',
    Component: lazy(() => import('@/views/layout-page/LayoutPageContent.tsx')),
    loader: async () => {
      if (location.pathname === '/') {
        return
      }

      await userStore.fetch()
    },
    children: [
      // 首页
      {
        index: true,
        loader: async () => {
          await userStore.fetch()
          const path = getFirstRoute()
          return redirect(path)
        },
      },
      ...menuRouteList,
    ],
  },
  // 登录相关页面
  {
    path: '/auth',
    Component: lazy(() => import('@views/auth/AuthPage.tsx')),
    children: [
      {
        index: true,
        loader: () => redirect('/auth/login'),
      },
      {
        path: 'login',
        Component: lazy(() => import('@views/auth/LoginComp.tsx')),
      },
      {
        path: 'register',
        Component: lazy(() => import('@views/auth/RegisterComp.tsx')),
      },
      {
        path: 'forget-password',
        Component: lazy(() => import('@views/auth/ForgetPassword.tsx')),
      },
      {
        path: 'login-by-qrcode',
        Component: lazy(() => import('@views/auth/LoginByQrcode.tsx')),
      },
      {
        path: 'login-by-phone',
        Component: lazy(() => import('@views/auth/LoginByPhone.tsx')),
      },
    ],
  },
]

// 获取用户第1个有效的路由
export const getFirstRoute = () => {
  const userInfo = userStore.getSnapshot()
  let ok = false
  let path: string
  for (let i = 0; i < menuRouteList.length && !ok; i++) {
    if (!userInfo.permissionList.includes(menuRouteList[i].handle.name as string)) {
      continue
    }

    // 目录
    if (menuRouteList[i].children?.length) {
      for (let j = 0; j < menuRouteList[i].children.length && !ok; j++) {
        if (!userInfo.permissionList.includes(menuRouteList[i].children[j].handle.name as string)) {
          continue
        }

        path = menuRouteList[i].children[j].path
        ok = true
      }
    } else if (menuRouteList[i].Component) {
      // 菜单
      path = menuRouteList[i].path
      ok = true
    }
  }
  return path ?? '/index'
}

export const router = createBrowserRouter(routes)
