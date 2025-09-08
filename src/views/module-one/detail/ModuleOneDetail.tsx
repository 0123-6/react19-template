import {useNavigate, useParams} from 'react-router-dom'

export default function ModuleOneDetail() {
  // state
  const {id} = useParams()
  const navigate = useNavigate()

  // methods
  function goBack() {
    navigate(-1)
  }

  // render
  return (
    <div className={'w-full h-[600px] flex flex-col bg-amber-300'}>
      <span className={'text-3xl'}>模块1详情页面,id: {id}</span>
      <button onClick={goBack}>返回</button>
    </div>
  )
}
