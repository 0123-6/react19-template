import {createBrowserRouter, redirect, type RouteObject} from 'react-router'
import {lazy} from 'react'
import {HomeOutlined, KeyOutlined, SettingOutlined, TagOutlined, UserOutlined} from '@ant-design/icons'

export type IRoute = Omit<RouteObject, 'children'> & {
  name?: string,
  meta?: Record<string, any>,
  children?: IRoute[],
}

export const menuRouteList: IRoute[] = [
  // 首页
  {
    index: true,
    loader: () => redirect('/index'),
  },
  {
    path: '/index',
    name: '首页',
    Component: lazy(() => import('@views/index-page/IndexPage.tsx')),
    meta: {
      icon: HomeOutlined,
    },
  },
  {
    path: '/system-manage',
    name: '系统管理',
    meta: {
      icon: SettingOutlined,
    },
    children: [
      {
        path: '/system-manage/user-manage',
        name: '用户管理',
        Component: lazy(() => import('@/views/system-manage/user-manage/UserManage.tsx')),
        meta: {
          icon: UserOutlined,
        },
      },
      {
        path: '/system-manage/role-manage',
        name: '角色管理',
        Component: lazy(() => import('@views/system-manage/role-manage/RoleManage.tsx')),
        meta: {
          icon: TagOutlined,
        },
      },
      {
        path: '/system-manage/permission-manage',
        name: '权限管理',
        Component: lazy(() => import('@views/system-manage/permission-manage/PermissionManage.tsx')),
        meta: {
          icon: KeyOutlined,
        },
      },
    ],
  },
  // 业务目录一
  {
    path: '/business-directory-one',
    name: '业务目录一',
    meta: {
      icon: HomeOutlined,
    },
    children: [
      {
        path: '/business-directory-one/business-menu-one-one',
        name: '业务菜单1-1',
        Component: lazy(() => import('@views/business-directory-one/business-menu-one-one/BusinessMenuOneOne.tsx')),
        meta: {
          icon: HomeOutlined,
        },
      },
      {
        path: '/business-directory-one/business-menu-one-two',
        name: '业务菜单1-2',
        Component: lazy(() => import('@views/business-directory-one/business-menu-one-two/BusinessMenuOneTwo.tsx')),
        meta: {
          icon: HomeOutlined,
        },
      },
      {
        path: '/business-directory-one/business-menu-one-three',
        name: '业务菜单1-3',
        Component: lazy(() => import('@views/business-directory-one/business-menu-one-three/BusinessMenuOneThree.tsx')),
        meta: {
          icon: HomeOutlined,
        },
      },
      {
        path: '/business-directory-one/business-menu-one-four',
        name: '业务菜单1-4',
        Component: lazy(() => import('@views/business-directory-one/business-menu-one-four/BusinessMenuOneFour.tsx')),
        meta: {
          icon: HomeOutlined,
        },
      },
    ],
  },
  // 业务目录二
  {
    path: '/business-directory-two',
    name: '业务目录二',
    meta: {
      icon: HomeOutlined,
    },
    children: [
      {
        path: '/business-directory-two/business-menu-two-one',
        name: '业务菜单2-1',
        Component: lazy(() => import('@views/business-directory-two/business-menu-two-one/BusinessMenuTwoOne.tsx')),
        meta: {
          icon: HomeOutlined,
        },
      },
      {
        path: '/business-directory-two/business-menu-two-two',
        name: '业务菜单2-2',
        Component: lazy(() => import('@views/business-directory-two/business-menu-two-two/BusinessMenuTwoTwo.tsx')),
        meta: {
          icon: HomeOutlined,
        },
      },
    ],
  },
]

const routes: RouteObject[] = [
  // 404页面
  {
    path: '*',
    Component: lazy(() => import('@/views/not-found/NotFound.tsx')),
  },
  // 普通页面
  {
    path: '/',
    Component: lazy(() => import('@/views/layout-page/LayoutPageContent.tsx')),
    children: menuRouteList as RouteObject[],
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

export const router = createBrowserRouter(routes)
