import {useNavigate} from 'react-router'
import {getFirstRoute} from '@/router'

export default function NotFound() {
  // state
  const navigate = useNavigate()
  // methods
  const goIndexPage = () => {
    const path = getFirstRoute()
    navigate(path)
  }
  // render
  return (
    <div className={'hpj w-full grow flex flex-col'}>
      <span className={'text-[30px] leading-[30px]'}>404</span>
      <button
        type={'button'}
        onClick={goIndexPage}>跳转到首页
      </button>
    </div>
  )
}
