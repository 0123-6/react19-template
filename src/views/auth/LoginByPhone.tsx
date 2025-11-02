import {useNavigate} from 'react-router'
import {useBaseFetch} from '@/util/hooks/useBaseFetch.ts'
import {Button, Form, Input} from 'antd'
import {useCountdown} from '@/components/base-form/useCountdown.ts'
import {isPhoneRegExp, isVerificationCodeRegExp} from '@/util/validator.ts'
import React from 'react'
import {successMessage} from '@/util/message.ts'

export default function LoginByPhone() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const fetchLogin = useBaseFetch({
    fetchOptionFn: () => ({
      url: 'mock_',
      data: form.getFieldsValue(true),
    }),
    transformResponseDataFn: () => {
      successMessage('登录成功')
      navigate('/', {
        replace: true,
      })
    },
  })
  const countdownObject = useCountdown()
  const fetchSendCode = useBaseFetch({
    fetchOptionFn: () => ({
      url: 'auth/getCode',
      mockProd: true,
      data: {
        phone: form.getFieldValue('phone'),
      },
    }),
    transformResponseDataFn: () => {
      successMessage('发送成功')
      countdownObject.begin()
    },
  })

  const clickSendCode = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      await form.validateFields(['phone'])
      fetchSendCode.doFetch()
    } catch (e) {
      console.log(e)
    }
  }
  const clickLogin = async () => {
    try {
      await form.validateFields()
      fetchLogin.doFetch()
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
    <div className={'hpj w-[640px] h-[470px] px-[100px] py-[64px] bg-white shadow-2xl rounded-3xl flex flex-col'}>
      <span className="text-text-title font-bold text-[36px] leading-[36px]">欢迎回来 📲 </span>
      <span className="mt-4 mb-6 text-text ">请输入您的手机号码以开始管理您的项目</span>
      <Form className="w-full flex flex-col gap-y-2"
            autoComplete="off"
            form={form}
            size={'large'}
      >
        <Form.Item
          name={'phone'}
          rules={[
            {
              required: true,
              message: '手机号码不能为空',
            },
            {
              pattern: isPhoneRegExp,
              message: '手机格式不正确',
            },
          ]}
        >
          <Input placeholder={'请输入手机号码'}
                 allowClear
          />
        </Form.Item>
        <Form.Item
          name={'code'}
          rules={[
            {
              required: true,
              message: '验证码不能为空',
            },
            {
              pattern: isVerificationCodeRegExp,
              message: '验证码格式不正确',
            },
          ]}
        >
          <div className={'w-full flex justify-between items-center gap-x-4'}>
            <div>
              <Input placeholder={'请输入验证码'}
                     allowClear
              />
            </div>
            <Button
              className={'self-start text-text-title'}
              style={{
                width: '200px',
                height: '40px',
              }}
              loading={fetchSendCode.isFetching}
              disabled={countdownObject.isRunning}
              onClick={clickSendCode}
            >
              { !countdownObject.isRunning ? '获取验证码' : `${countdownObject.countdown}秒后重新获取` }
            </Button>
          </div>
        </Form.Item>
      </Form>
      <Button className={'mt-5'}
              type={'primary'}
              size={'large'}
              loading={fetchLogin.isFetching}
              onClick={clickLogin}
      >{!fetchLogin.isFetching ? '登录' : '登录中'}</Button>
      <Button className={'mt-5'}
              size={'large'}
              onClick={clickReturn}
      >返回</Button>
    </div>
  )
}































