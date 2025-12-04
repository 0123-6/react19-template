import {Outlet, useMatches, useNavigate} from 'react-router'
import {useEffect, useRef, useSyncExternalStore} from 'react'
import overlayScrollbar from '@/util/overlayScrollbar.ts'
import {projectConfig} from '../../../project.config.ts'
import {SearchOutlined} from '@ant-design/icons'
import BaseFullscreen from '@/components/base-fullscreen/BaseFullscreen.tsx'
import {Menu, Popover} from 'antd'
import {type IRouteHandle, menuRouteList} from '@/router'
import {getUserMenuList, menuRouteListToMenuComp, pathnameToMulti} from '@views/layout-page/menuRouteListToMenuComp.ts'
import BreadcrumbComp from '@views/layout-page/BreadcrumbComp.tsx'
import type {IUserInfo} from '@views/system-manage/user-manage/userManageCommon.ts'
import {userStore} from '@/store'
import {watchLocationPathname} from '@/util/watchLocationPathname.ts'
import BaseSpanTooltip from '@/components/base-span-tooltip/BaseSpanTooltip.tsx'
import LogoutIcon from '@views/layout-page/icon/LogoutIcon.tsx'
import {useBaseFetch} from '@/util/hooks/useBaseFetch.ts'
import PromptDialog from '@/components/base-dialog/PromptDialog.tsx'
import renderComp from '@/components/base-dialog/renderComp.ts'
import type {IPromptDialog} from '@/components/base-dialog/PromptDialogInterface.ts'

const PopoverComp = () => {
  const navigate = useNavigate()
  const userObject: IUserInfo = useSyncExternalStore(userStore.subscribe, userStore.getSnapshot)
  const clickLogout = () => {
    renderLogoutDialog()
  }

  const renderLogoutDialog = renderComp(PromptDialog, (): IPromptDialog => ({
    title: '提示',
    width: 400,
    text: '确认退出登录吗?',
    okButton: {
      type: 'primary',
      text: '退出',
      fetchText: '退出中',
    },
    fetchObject: fetchLogoutObject,
  }))

  const fetchLogoutObject = useBaseFetch({
    beforeFetchResetFn: async () => {
      await navigate('/auth/login', {
        replace: true,
      })
      setTimeout(() => {
        userStore.set(null)
      }, 1000)
    },
    fetchOptionFn: () => ({
      url: 'logout',
      mockProd: true,
    }),
  })

  return (
    <div className={'w-[240px] flex flex-col'}>
      <div className={'w-full p-3 flex items-center gap-x-2 border-b border-disabled'}>
        <div className="w-[48px] shrink-0 h-[48px] rounded-full overflow-hidden">
          <img
            src="/default_avatar.jpg"
            alt=""
          />
        </div>
        <div className={'grow h-[48px] flex flex-col justify-between'}>
          <BaseSpanTooltip
            text={userObject?.account}
            style={{
              width: '100px',
            }}
          />
          <BaseSpanTooltip
            text={userObject?.phone}
            className={'text-xs'}
          />
        </div>
      </div>
      <div
        className={'m-1 h-[40px] p-1.5 rounded flex items-center gap-x-1 text-text-title cursor-pointer hover:bg-disabled'}
        onClick={clickLogout}
      >
        <LogoutIcon/>
        <span>退出登录</span>
      </div>
    </div>
  )
}

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
          {/* 个人照片 */}
          <Popover
            content={PopoverComp}
            classNames={{
              container: '!p-0',
            }}
            placement="bottomRight"
            arrow={false}
          >
            <button className="w-[44px] h-[44px] flex justify-center items-center hover:bg-disabled rounded-full">
              <div className="w-[32px] h-[32px] rounded-full overflow-hidden">
                <img
                  src="/default_avatar.jpg"
                  alt=""
                />
              </div>
            </button>
          </Popover>
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
            userObject?.permissionList?.length > 0 && (
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
              userObject?.permissionList?.includes((matches.at(-1).handle as IRouteHandle).name)
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







































