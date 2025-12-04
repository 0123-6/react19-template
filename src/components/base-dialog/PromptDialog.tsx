import type {
  IPromptDialog,
  IPromptDialogOkButton,
  IPromptDialogTextItem,
} from '@/components/base-dialog/PromptDialogInterface.ts'
import {Button, Modal} from 'antd'
import {useFeedback} from '@/components/base-dialog/useFeedback.ts'
import {useEffect} from 'react'

const styleMap = {
  default: '#646464',
  primary: '#3D6FE2',
  success: '#3AC295',
  warning: '#F89741',
  error: '#E34D59',
  text: '#333333',
  desc: '#979797',
}

export default function PromptDialog(props: IPromptDialog) {
  const innerDialogObject = useFeedback()
  const {
    title = '提示',
    width = 400,
    text = undefined,
    textList = [] as (string | number | IPromptDialogTextItem)[],
    okButton = {} as IPromptDialogOkButton,
    cancel,
    fetchObject,
    dialogObject = innerDialogObject,
    // 按钮是否和fetchObject关联
    buttonConnectFetchObject = true,
  } = props

  useEffect(() => {
    // 初始化text和textList
    if (text && textList.length
      || !text && (textList.length === 0)) {
      console.log(text)
      console.log(textList)
      if (import.meta.env.DEV) {
        alert('PromptDialog组件： text和textList需要有且只有1项')
      }
      console.error('PromptDialog组件： text和textList需要有且只有1项')
    }
    if (text) {
      textList.push(text)
    } else {
      // 啥都不用做
    }
    // 初始化okButton
    okButton.type = okButton.type ?? 'primary'
    okButton.plain = okButton.plain ?? false
    okButton.width = okButton.width ?? 88
    okButton.text = okButton.text ?? '确定'
    okButton.fetchText = okButton.fetchText ?? '确定'
    dialogObject.setIsShow(true)

    return () => {
      textList.length = 0
      dialogObject.setIsShow(false)
    }
  }, [])

  const clickOk = async () => {
    if (!fetchObject) {
      dialogObject.onOk()
      return
    }

    if (!buttonConnectFetchObject) {
      dialogObject.onOk()
    }
    const isOk = await fetchObject.doFetch()
    if (isOk && buttonConnectFetchObject) {
      dialogObject.onOk()
    }
  }

  const onCancel = () => {
    dialogObject.onCancel()
  }
  const afterClose = () => {
    cancel?.()
  }

  return (
    <>
      {dialogObject.isShow}
      <Modal
        zIndex={100000}
        open={dialogObject.isShow}
        title={title}
        width={width}
        centered={true}
        destroyOnHidden={true}
        wrapClassName={'hpj'}
        onCancel={onCancel}
        afterClose={afterClose}
        footer={null}
      >
        <div className={'w-full flex flex-col gap-y-4'}>
          {/*文本*/}
          <div className={'w-full whitespace-pre-line'}>
            {
              textList.map((item, index) => (
                <span
                  key={index}
                  className={'text-text break-all'}
                  style={{
                    color: typeof item === 'object' ? (styleMap[item.color] ?? styleMap.default) : styleMap.default,
                    fontWeight: (typeof item !== 'object' || item.color === 'default') ? 400: 600,
                  }}
                >{ typeof item === 'object' ? ` ${item.text} ` : item }</span>
              ))
            }
            <span className={'text-text break-all'}>确认退出登录吗?</span>
          </div>
          {/*按钮*/}
          <div className={'flex justify-end items-center gap-x-2'}>
            <Button
              onClick={onCancel}
            >取消</Button>
            <Button
              color={styleMap[okButton.type]}
              loading={fetchObject?.isFetching}
              onClick={clickOk}
            >
              { !fetchObject?.isFetching ? okButton.text : (okButton.fetchText ?? okButton.text) }
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
