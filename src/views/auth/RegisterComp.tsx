import {useResetState} from '@/util/hooks/useResetState.ts'
import {useNavigate} from 'react-router'
import {useBaseFetch} from '@/util/hooks/useBaseFetch.ts'
import {Button, Checkbox, Form, Input} from 'antd'
import {isPasswordRegExp} from '@/util/validator.ts'
import {successMessage} from '@/util/message.ts'

export default function RegisterComp() {
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [agree, setAgree, _resetAgree] = useResetState(() => false)
  const [form] = Form.useForm()
  const fetchRegister = useBaseFetch({
    fetchOptionFn: () => ({
      url: 'user/addUser',
      mockProd: true,
      data: form.getFieldsValue(true),
    }),
    transformResponseDataFn: () => {
      successMessage('注册成功')
      navigate('/auth/login', {
        replace: true,
      })
    },
  })
  const clickRegister = async () => {
    try {
      await form.validateFields()
      fetchRegister.doFetch()
    } catch (e) {
      console.log(e)
    }
  }
  const clickLogin = () => {
    navigate('/auth/login', {
      replace: true,
    })
  }

  return (
    <div className={'hpj w-[640px] h-[570px] px-[100px] py-[64px] bg-white shadow-2xl rounded-3xl flex flex-col'}>
      <span className="text-text-title font-bold text-[36px] leading-[36px]">创建一个账号 🚀 </span>
      <span className="mt-4 mb-6 text-text ">让您的应用程序管理变得简单而有趣</span>
      <Form className="w-full flex flex-col gap-y-2"
            autoComplete="off"
            form={form}
            size={'large'}
      >
        <Form.Item
          name={'account'}
          rules={[
            {
              required: true,
              message: '账号不能为空',
            },
          ]}
          validateFirst
        >
          <Input
            placeholder={'请输入账号'}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name={'password'}
          rules={[
            {
              required: true,
              message: '密码不能为空',
            },
            {
              pattern: isPasswordRegExp,
              message: '只能包含数字，字母，下划线，8-16位',
            },
          ]}
          validateFirst
        >
          <Input.Password
            placeholder={'请输入密码，只能包含数字，字母，下划线，8-16位'}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name={'password2'}
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: '密码不能为空',
            },
            {
              pattern: isPasswordRegExp,
              message: '只能包含数字，字母，下划线，8-16位',
            },
            {
              validator: () => {
                const data = form.getFieldsValue(true)
                if (data.password2 !== data.password) {
                  return Promise.reject(new Error('两次密码不一致'))
                } else {
                  return Promise.resolve()
                }
              },
            },
          ]}
          validateFirst
        >
          <Input.Password
            placeholder={'请再次确认密码，只能包含数字，字母，下划线，8-16位'}
            allowClear
          />
        </Form.Item>
      </Form>
      <div className={'mt-2 flex items-center'}>
        <Checkbox onChange={e => setAgree(e.target.checked)}/>
        <span className="ml-2">
          我同意
          <span className="ml-1 text-primary cursor-pointer select-none">隐私政策和条款</span>
        </span>
      </div>
      <Button type={'primary'}
              loading={fetchRegister.isFetching}
              disabled={!agree}
              style={{
                marginTop: '20px',
                height: '40px',
              }}
              onClick={clickRegister}
      >{ !fetchRegister.isFetching ? '注册' : '注册中' }</Button>
      <div className={'mt-5 flex justify-center items-center gap-x-1'}>
        <span>已经有账号了?</span>
        <span className={'text-primary cursor-pointer select-none'}
              onClick={clickLogin}
        >去登录</span>
      </div>
    </div>
  )
}
























