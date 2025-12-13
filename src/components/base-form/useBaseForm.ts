import {Form} from 'antd'
import {useId} from 'react'
import type {IBaseFormItem} from '@/components/base-form/BaseFormItemList.tsx'
import {warningMessage} from '@/util/message.ts'

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

  const validate = async (list?: any[])
    : Promise<boolean> => {
    if (!form) {
      warningMessage('form组件不存在,请检查代码')
      return false
    }

    try {
      await form.validateFields(list)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  return {
    form,
    id,
    list,
    initialValues,
    validate,
  }
}
