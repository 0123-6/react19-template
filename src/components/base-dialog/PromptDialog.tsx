import {Button, Modal} from 'antd'
import type {IUseFeedbackReturn} from '@/components/base-dialog/useFeedback.ts'
import type {IUseBaseFetchReturn} from '@/util/hooks/useBaseFetch.ts'

export interface IPromptDialog {
  // 弹框标题, 默认为'提示'
  title?: string,
  // 宽度, 默认为400
  width?: number,
  // 要展示的文字内容
  text?: string | number | IPromptDialogTextItem,
  textList?: (string | number | IPromptDialogTextItem)[],
  // 必须存在
  cancel?: () => void,
  // 确认按钮
  okButton?: IPromptDialogOkButton,
  // useElFeedback.ts实例,应该是独立的逻辑,不应该依赖fetchObject
  // 如果发现依赖fetchObject, 则考虑将逻辑写到fetchObject中,以确保功能内聚和各自的独立性.
  dialogObject?: IUseFeedbackReturn,
  // 点击确认按钮触发的事件
  fetchObject?: IUseBaseFetchReturn,
  // 按钮是否和fetchObject关联
  buttonConnectFetchObject?: boolean,
}

export interface IPromptDialogOkButton {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info',
  plain?: boolean,
  width?: number,
  text?: string,
  fetchText?: string,
}

export interface IPromptDialogTextItem {
  text: string | number,
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'text' | 'desc',
}

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
  const {
    title = '提示',
    width = 400,
    text = undefined,
    textList = [] as (string | number | IPromptDialogTextItem)[],
    okButton = {} as IPromptDialogOkButton,
    cancel,
    fetchObject,
    dialogObject,
    // 按钮是否和fetchObject关联
    buttonConnectFetchObject = true,
  } = props

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
  if (!textList.length) {
    textList.push(text)
  }
  // 初始化okButton
  okButton.type = okButton.type ?? 'primary'
  okButton.plain = okButton.plain ?? false
  okButton.width = okButton.width ?? 88
  okButton.text = okButton.text ?? '确定'
  okButton.fetchText = okButton.fetchText ?? '确定'

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
          </div>
          {/*按钮*/}
          <div className={'flex justify-end items-center gap-x-2'}>
            <Button
              onClick={onCancel}
            >取消</Button>
            <Button
              color={'primary'}
              variant={'filled'}
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
