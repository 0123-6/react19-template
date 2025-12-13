import {Form} from 'antd'
import {useId} from 'react'
import type {IBaseFormItem} from '@/components/base-form/BaseFormItemList.tsx'

export interface IUseBaseFormProps {
  list: IBaseFormItem[],
  initialValues: Record<string, any>,
}

export const useBaseForm = (props: IUseBaseFormProps) => {
  const {
    list,
    initialValues,
  } = props
  const [form] = Form.useForm()
  const id = useId()

  return {
    form,
    id,
    list,
    initialValues,
  }
}
