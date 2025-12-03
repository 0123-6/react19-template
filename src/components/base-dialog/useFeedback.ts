import {useResetState} from '@/util/hooks/useResetState.ts'

export interface IUseFeedbackProps {
  okHook?: (...args: any[]) => void,
  cancelHook?: () => void,
}

export interface IUseFeedbackReturn {
  isShow: boolean,
  setIsShow: (newValue: boolean) => void,
  onOk: (...args: any[]) => void,
  onCancel: () => void,
}

// 弹窗,抽屉类组件使用
export const useFeedback = (props: IUseFeedbackProps = {})
  : IUseFeedbackReturn => {
  const {
    okHook = () => undefined,
    cancelHook = () => undefined,
  } = props

  const [isShow, setIsShow, resetIsShow] = useResetState((): boolean => false)

  const onOk = (...args: any[]) => {
    okHook(...args)
    onCancel()
  }

  const onCancel = () => {
    resetIsShow()
    cancelHook()
  }

  return {
    isShow,
    setIsShow,
    onOk,
    onCancel,
  }
}
