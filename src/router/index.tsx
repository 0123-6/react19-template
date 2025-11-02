import {createBrowserRouter, redirect} from 'react-router'
import {lazy} from 'react'

export const router = createBrowserRouter([
  // 404页面
  {
    path: '*',
    Component: lazy(() => import('@/views/not-found/NotFound.tsx')),
  },
  // 普通页面
  {
    path: '/',
    Component: lazy(() => import('@/views/layout-page/LayoutPageContent.tsx')),
    children: [
      {
        index: true,
        loader: () => redirect('/index'),
      },
      {
        path: 'index',
        Component: lazy(() => import('@views/index/IndexPage.tsx')),
      },
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
])
