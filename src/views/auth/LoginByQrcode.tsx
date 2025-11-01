import {useNavigate} from 'react-router'
import {Button} from 'antd'
import qrcodeImg from './icon/qrcode.png'

export default function LoginByQrcode() {
  const navigate = useNavigate()
  const clickReturn = () => {
    navigate('/auth/login', {
      replace: true,
    })
  }

  return (
    <div className={'hpj w-[640px] h-[520px] px-[100px] py-[64px] bg-white shadow-2xl rounded-3xl flex flex-col'}>
      <span className="text-text-title font-bold text-[36px] leading-[36px]">欢迎回来 📱 </span>
      <span className="mt-4 text-text ">请用手机扫描二维码登录</span>
      <img
        src={qrcodeImg}
        className="self-center w-[250px] h-[250px]"
      />
      <span className="text-text self-center">扫码后点击 '确认'，即可完成登录</span>
      <Button
        className={'mt-5'}
        size={'large'}
        onClick={clickReturn}
      >返回</Button>
    </div>
  )
}
