import {Button} from 'antd'
import type {OverlayScrollbars} from 'overlayscrollbars'
import {type ReactNode, useEffect, useRef} from 'react'
import overlayScrollbar from '@/util/overlayScrollbar.ts'

export interface IBaseDrawerProps {
  children?: ReactNode,
  // 配置式按钮
  okButton?: {
    isShow?: boolean,
    onClick?: () => void,
    text?: string,
    loading?: boolean,
  },
  cancelButton?: {
    isShow?: boolean,
    onClick?: () => void,
    text?: string,
  },
}

export default function BaseDrawer(props: IBaseDrawerProps) {
  const {
    okButton,
    cancelButton,
  } = props
  const instance = useRef<OverlayScrollbars>(null)
  const drawerBodyRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (drawerBodyRef.current) {
      instance.current = overlayScrollbar({
        element: drawerBodyRef.current,
        autoHide: false,
      })
    }

    return () => {
      instance.current?.destroy?.()
      instance.current = null
    }
  }, [])

  return (
    <div className={'w-full h-full flex flex-col'}>
      {/* 内容 */}
      <div
        ref={drawerBodyRef}
        className={'w-full flex flex-col'}
        style={{
          height: 'calc(100% - 88px)',
          padding: '16px 24px 16px 0',
        }}
      >
        <div className={'w-full flex flex-col'}>
          {props.children}
        </div>
      </div>
      {/* 按钮 */}
      <div
        className={'w-full px-6 h-[88px] flex justify-end items-center gap-x-4'}
        style={{
          borderTop: '2px solid #f2f2f3',
        }}
      >
        {
          (cancelButton.isShow ?? true) && (
            <Button
              variant={'solid'}
              onClick={cancelButton.onClick}
            >{cancelButton.text ?? '取消'}</Button>
          )
        }
        {
          (okButton.isShow ?? true) && (
            <Button
              color={'primary'}
              variant={'filled'}
              onClick={okButton.onClick}
              loading={okButton.loading}
            >
              {okButton.text ?? '确定'}
            </Button>
          )
        }
      </div>
    </div>
  )
}
