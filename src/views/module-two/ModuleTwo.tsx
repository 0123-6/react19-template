import {useState} from 'react'

export default function ModuleTwo() {
  // state
  const [number, setNumber] = useState<number>(0)

  // methods
  function add() {
    debugger
    setNumber(num => num + 1)
  }

  // render
  return (
    <div className={'w-full h-[600px] bg-blue-600 flex flex-col'}>
      <span className={'text-3xl'}>模块2</span>
      <span className={'text-3xl'}>{number}</span>
      <button onClick={add}>增加</button>
    </div>
  )
}
