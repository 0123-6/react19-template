import {useEffect, useRef, useState} from 'react'
import {ableSelectFileByClick, ableSelectFileByDrag, ISelectFileProps} from '@/util/file.ts'
import {successMessage} from '@/util/message.ts'

export default function PersonCenter() {
  // state
  const clickElementRef = useRef(null)
  const dragElementRef = useRef(null)
  const imgUrl = useRef('')
  const [showModal, setShowModal] = useState(false)
  const [imgUrl2, setImgUrl2] = useState('')
  // effect
  useEffect(() => {
    // 设置点击选择文件元素
    const clickProps: ISelectFileProps = {
      element: clickElementRef.current!,
      accept: 'image/*',
      callback: file => {
        successMessage('点击读取成功')
        console.log(file)
        imgUrl.current = URL.createObjectURL(file)
        setShowModal(true)
      },
      callbackError: text => {
        alert(text)
      },
    }
    const removeClickHandler = ableSelectFileByClick(clickProps)

    // 设置拖拽选择文件元素
    const dragProps: ISelectFileProps = {
      element: dragElementRef.current!,
      accept: 'image/*',
      callback: file => {
        successMessage('点击读取成功')
        console.log(file)
        imgUrl.current = URL.createObjectURL(file)
        setShowModal(true)
      },
      callbackError: text => {
        alert(text)
      },
    }
    const removeDragHandler = ableSelectFileByDrag(dragProps)

    return () => {
      removeClickHandler()
      removeDragHandler()
    }
  }, [])
  // methods
  // render
  return (
    // 最外层
    <div className={'w-full h-full flex flex-col bg-red-400'}>
      <span>个人中心</span>
      {/*头像*/}
      <div className={'mt-5 flex items-center'}>
        <img ref={clickElementRef}
             src="/default_avatar.jpg" alt=""
             className="cursor-pointer"
             style={{width: '400px'}}
        />
        <div ref={dragElementRef}
             className="ml-2 w-[400px] min-h-[400px] cursor-pointer bg-blue-700 flex justify-center items-center">
          <span>将文件拖到此处</span>
        </div>
      </div>
      {/*展示*/}
      <img src={imgUrl2} alt="" className={'w-[300px] h-[300px]'}/>
    </div>
  )
}
