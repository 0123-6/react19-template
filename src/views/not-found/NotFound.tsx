import {useNavigate} from 'react-router'

export default function NotFound() {
  // state
  const navigate = useNavigate()
  // methods
  const goIndexPage = () => {
    navigate('/index')
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
