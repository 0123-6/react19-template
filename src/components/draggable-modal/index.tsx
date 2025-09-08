import React, {useRef, useState} from 'react'
import {Modal} from 'antd'
import Draggable, {type DraggableData, type DraggableEvent} from 'react-draggable'

interface IProps {
  title: string;
  wrapClassName?: string;
  show: boolean;
  children: React.ReactNode;
  onCancel: (e: any) => void;
}

export interface IDraggableModalProps {
  title: string;
  show: boolean;
  data: any;
  onOk: (e: any) => void;
  onCancel: () => void;

  [key: string]: any;
}

export default function DraggableModal(props: IProps) {
  // state
  const {title, wrapClassName = '', show, children, onCancel} = props
  // draggable
  const [disabled, setDisabled] = useState(true)
  const [bounds, setBounds] = useState({left: 0, top: 0, bottom: 0, right: 0})
  const draggleRef = useRef<HTMLDivElement>(null)
  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const {clientWidth, clientHeight} = window.document.documentElement
    const targetRect = draggleRef.current?.getBoundingClientRect()
    if (!targetRect) {
      return
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    })
  }

  const titleComponent = (_title: string) => (
    <div
      style={{
        width: '100%',
        cursor: 'move',
        padding: '12px 24px',
      }}
      onMouseOver={() => {
        if (disabled) {
          setDisabled(false)
        }
      }}
      onMouseOut={() => {
        setDisabled(true)
      }}
    >
      {_title}
    </div>
  )

  const modalRenderComponent = (modal: any) => (
    <Draggable
      disabled={disabled}
      bounds={bounds}
      onStart={onStart}
    >
      <div ref={draggleRef}>{modal}</div>
    </Draggable>
  )

  //render
  return (
    <Draggable>
      <Modal title={titleComponent(title)}
             modalRender={modalRenderComponent}
             centered
             wrapClassName={wrapClassName}
             footer={null}
             destroyOnClose
             open={show}
             onCancel={onCancel}>
        {children}
      </Modal>
    </Draggable>
  )
}
