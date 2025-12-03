import type {IUseBaseFetchReturn} from '@/util/hooks/useBaseFetch.ts'
import type {IUseFeedbackReturn} from '@/components/base-dialog/useFeedback.ts'

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
