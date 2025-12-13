import {Form} from 'antd'
import {useId} from 'react'

export const useBaseForm = () => {
  const [form] = Form.useForm()
  const id = useId()

  return {
    form,
    id,
  }
}
