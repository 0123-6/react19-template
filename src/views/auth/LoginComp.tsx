import {Button, Checkbox, Form, Input} from 'antd'
import {useBaseFetch} from '@/util/hooks/useBaseFetch.ts'
import {useNavigate} from 'react-router'
import IconWeiXin from '@views/auth/icon/IconWeiXin.tsx'
import IconQQ from '@views/auth/icon/IconQQ.tsx'
import IconGithub from '@views/auth/icon/IconGithub.tsx'
import IconGoogle from '@views/auth/icon/IconGoogle.tsx'
import React from 'react'
import {useResetState} from '@/util/hooks/useResetState.ts'
import {successMessage} from '@/util/message.ts'

export default function LoginComp() {
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [remember, setRemember, _resetRemember] = useResetState(() => false)
  const [form] = Form.useForm()

  const fetchLoginObject = useBaseFetch({
    fetchOptionFn: () => ({
      mockProd: true,
      url: 'login',
      data: {
        ...form.getFieldsValue(true),
        remember,
      },
    }),
    transformResponseDataFn: () => {
      successMessage('登录成功')
      navigate('/', {
        replace: true,
      })
    },
  })


  const clickLogin = async () => {
    try {
      await form.validateFields()
      fetchLoginObject.doFetch()
    } catch (e) {
      console.log(e)
    }
  }

  const clickLoginByPhone = () => {
    navigate('/auth/login-by-phone', {
      replace: true,
    })
  }
  const clickLoginByQrcode = () => {
    navigate('/auth/login-by-qrcode', {
      replace: true,
    })
  }
  const clickForgetPassword = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigate('/auth/forget-password', {
      replace: true,
    })
  }
  const clickRegister = () => {
    navigate('/auth/register', {
      replace: true,
    })
  }

  return (
    <div className={'hpj w-[640px] h-[670px] px-[100px] py-[64px] bg-white shadow-2xl rounded-3xl flex flex-col'}>
      <span className={'text-text-title font-bold text-[36px] leading-[36px]'}>欢迎回来 👋🏻</span>
      <span className={'mt-4 mb-6'}>请输入你的账户信息以开始管理你的项目</span>
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
        >
          <Input
            placeholder={'请输入账号,dev(开发人员), admin(管理员)可用'}
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
          ]}>
          <Input.Password
            placeholder={'请输入密码,password可用'}
            allowClear
          />
        </Form.Item>
      </Form>
      <div className={'-mt-2 w-full flex justify-between items-center'}>
        <Checkbox onChange={e => setRemember(e.target.checked)}>记住账号</Checkbox>
        <button
          className="h-[40px] self-start text-primary"
          onClick={clickForgetPassword}
        >
          忘记密码?
        </button>
      </div>
      <Button type={'primary'}
              loading={fetchLoginObject.isFetching}
              className={'mt-4'}
              style={{height: '40px'}}
              onClick={clickLogin}
      >
        {!fetchLoginObject.isFetching ? '登录' : '登录中'}
      </Button>
      <div className={'mt-5 h-[40px] flex items-center gap-x-4'}>
        <Button className={'w-1/2 h-full'}
                onClick={clickLoginByPhone}
        >手机号登录</Button>
        <Button className={'w-1/2 h-full'}
                onClick={clickLoginByQrcode}
        >扫码登录</Button>
      </div>
      <div className="mt-5 flex items-center">
        <div className="w-[160px] h-[1px] bg-disabled"/>
        <div className="flex-1 flex justify-center items-center text-text-desc">
          <span>其它登录方式</span>
        </div>
        <div className="w-[160px] h-[1px] bg-disabled"/>
      </div>
      <div className="mt-4 flex justify-center items-center gap-x-3 text-text text-base">
        <div
          className="w-[36px] h-[36px] hover:bg-bg rounded-full flex justify-center items-center cursor-pointer hover:text-text-title">
          <IconWeiXin/>
        </div>
        <div
          className="w-[36px] h-[36px] hover:bg-bg rounded-full flex justify-center items-center cursor-pointer hover:text-text-title">
          <IconQQ/>
        </div>
        <div
          className="w-[36px] h-[36px] hover:bg-bg rounded-full flex justify-center items-center cursor-pointer hover:text-text-title">
          <IconGithub/>
        </div>
        <div
          className="w-[36px] h-[36px] hover:bg-bg rounded-full flex justify-center items-center cursor-pointer hover:text-text-title">
          <IconGoogle/>
        </div>
      </div>
      <div className="mt-6 flex justify-center items-center">
        <span className="text-base">还没有账号?</span>
        <button
          className="ml-2 text-primary text-base"
          onClick={clickRegister}
        >
          创建账号
        </button>
      </div>
    </div>
  )
}
