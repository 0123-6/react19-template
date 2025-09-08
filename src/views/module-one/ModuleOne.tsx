import {useNavigate} from 'react-router-dom'

export default function ModuleOne() {
  // state
  const navigate = useNavigate()

  // methods
  function goDetail() {
    navigate('/module-one/detail/' + 12)
  }

  // render
  return (
    <div className={'w-full h-[600px] bg-red-400 flex flex-col'}>
      <span className={'text-3xl'}>模块1</span>
      <button onClick={goDetail}>跳转</button>
    </div>
  )
}
