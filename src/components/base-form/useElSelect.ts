// select的option的标准格式
export interface ISelectOption {
  label: string,
  value: string | number | boolean,
  disabled?: boolean,
  children?: ISelectOption[],
  isLeaf?: boolean,
  // 用于匹配样式
  type?: 'primary' | 'success' | 'warning' | 'error' | 'text',
}
