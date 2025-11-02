import {useBaseFetch} from '@/util/hooks/useBaseFetch.ts'
import {useNavigate} from 'react-router'
import {Button, Form, Input} from 'antd'
import {isEmailRegExp} from '@/util/validator.ts'
import {successMessage} from '@/util/message.ts'

export default function ForgetPassword() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const fetchSendEmail = useBaseFetch({
    fetchOptionFn: () => ({
      url: 'mock_',
      data: form.getFieldsValue(true),
    }),
    transformResponseDataFn: () => {
      successMessage('重置密码邮件已发送到你的邮箱')
    },
  })
  const clickSendEmail = async () => {
    try {
      await form.validateFields()
      fetchSendEmail.doFetch()
    } catch (e) {
      console.log(e)
    }
  }
  const clickReturn = () => {
    navigate('/auth/login', {
      replace: true,
    })
  }

  return (
    <div className={'hpj w-[640px] h-[400px] px-[100px] py-[64px] bg-white shadow-2xl rounded-3xl flex flex-col'}>
      <span className="text-text-title font-bold text-[36px] leading-[36px]">忘记密码? 🤦🏻‍♂️ </span>
      <span className="mt-4 mb-6 text-text ">输入您的电子邮件，我们将向您发送重置密码的连接</span>
      <Form className="w-full flex flex-col gap-y-2"
            autoComplete="off"
            form={form}
            size={'large'}
      >
        <Form.Item
          name={'email'}
          rules={[
            {
              required: true,
              message: '邮箱不能为空',
            },
            {
              pattern: isEmailRegExp,
              message: '邮箱格式不正确',
            },
          ]}
        >
          <Input
            placeholder={'请输入邮箱'}
            allowClear
          />
        </Form.Item>
      </Form>
      <Button
        type={'primary'}
        loading={fetchSendEmail.isFetching}
        style={{
          marginTop: '4px',
          height: '40px',
        }}
        onClick={clickSendEmail}
      >
        {!fetchSendEmail.isFetching ? '发送重置链接' : '发送中'}
      </Button>
      <Button
        size={'large'}
        style={{marginTop: '20px'}}
        onClick={clickReturn}
      >返回</Button>
    </div>
  )
}
