import {Outlet, useMatches, useNavigate} from 'react-router'
import {useEffect, useRef, useSyncExternalStore} from 'react'
import overlayScrollbar from '@/util/overlayScrollbar.ts'
import {projectConfig} from '../../../project.config.ts'
import {SearchOutlined} from '@ant-design/icons'
import BaseFullscreen from '@/components/base-fullscreen/BaseFullscreen.tsx'
import {Menu} from 'antd'
import {type IRouteHandle, menuRouteList} from '@/router'
import {getUserMenuList, menuRouteListToMenuComp, pathnameToMulti} from '@views/layout-page/menuRouteListToMenuComp.ts'
import BreadcrumbComp from '@views/layout-page/BreadcrumbComp.tsx'
import type {IUserInfo} from '@views/system-manage/user-manage/userManageCommon.ts'
import {userStore} from '@/store'
import {watchLocationPathname} from '@/util/watchLocationPathname.ts'

export default function LayoutPageContent() {
  const navigate = useNavigate()
  const matches = useMatches()
  const isChildWeb = window !== window.parent
  const userObject: IUserInfo = useSyncExternalStore(userStore.subscribe, userStore.getSnapshot)

  // React无关，将滚动条改为好看的样式
  const appElementRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const instance = overlayScrollbar({
      element: appElementRef.current,
      autoHide: false,
    })

    const stop = watchLocationPathname(() => {
      instance.elements()?.scrollOffsetElement?.scrollTo({
        top: 0,
        left: 0,
      })
    })

    return () => {
      stop()
    }
  }, [])

  const userMenuList = getUserMenuList(menuRouteList)
  const menuList = menuRouteListToMenuComp(userMenuList)

  const clickMenu = (e: {key: string}) => {
    navigate(e.key)
  }

  console.log('ssssssssssssss')

  return (
    <div
      className={'w-full h-full flex flex-col shrink-0-children'}
      style={{
        padding: isChildWeb
          ? '4px 24px 0 16px'
          : projectConfig.isShowMenu
            ? ''
            : '16px 24px 0 16px',
      }}
    >
      {/* 头部 */}
      <div className={'hpj w-full h-[50px] flex justify-between items-center bg-white border-b border-disabled px-4'}>
        {/* 左 */}
        <div className={'flex items-center shrink-0-children'}>
          <img
            src="/logo.webp"
            alt=""
            className={'object-cover w-[32px] h-[32px]'}
          />
          <span className="ml-2 text-text-title text-lg font-semibold">React19模板网站</span>
          <BreadcrumbComp className={'ml-[24px]'}/>
        </div>
        {/* 右 */}
        <div className={'flex items-center gap-x-3'}>
          <div
            className="w-[120px] h-[32px] bg-disabled rounded-full flex items-center px-2 cursor-pointer hover:text-text-title"
          >
            <SearchOutlined/>
            <span className="ml-4">搜索菜单</span>
          </div>
          <BaseFullscreen/>
        </div>
      </div>
      {/* 内容 */}
      <div
        className={'w-full flex shrink-0-children'}
        style={{
          height: 'calc(100% - 50px)',
        }}
      >
        {/* 左边菜单 */}
        <div className={'w-[222px] h-full flex flex-col bg-white border-r border-disabled'}>
          {
            userObject.permissionList.length > 0 && (
              <Menu
                items={menuList}
                mode={'inline'}
                onClick={clickMenu}
                defaultSelectedKeys={[location.pathname]}
                defaultOpenKeys={pathnameToMulti(location.pathname)}
              />
            )
          }
        </div>
        {/* 右边内容 */}
        <div
          ref={appElementRef}
          className={'h-full bg-[#f7f7f7]'}
          style={{
            width: 'calc(100% - 222px)',
          }}
        >
          <div
            className={'w-full min-w-[1218px] h-full min-h-[700px] flex flex-col'}
            style={{
              padding: '16px 24px 0 16px',
            }}
          >
            {
              userObject.permissionList.includes((matches.at(-1).handle as IRouteHandle).name)
                ? <Outlet/>
                : <span className={'text-[30px] text-warning'}>没有权限</span>
            }
            <div className="h-[16px] shrink-0"/>
          </div>
        </div>
      </div>
    </div>
  )
}







































