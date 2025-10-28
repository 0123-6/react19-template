import {useResetState} from '@/util/hooks/useResetState.ts'
import {Button, Input} from 'antd'

export default function App() {
  const [count, setCount] = useResetState(() => 0)
  const [text, setText, resetText] = useResetState(() => '我是大SB')

  const myClick = async () => {
    await navigator.clipboard.writeText(text)
    console.log('赋值功能')
  }

  return (
    <>
      <h1>Vite + React</h1>
      <div>
        <button type='button' onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <input name={'sd'} value={text} onChange={e => setText(e.target.value)}/>
      <Input value={text} onChange={e => setText(e.target.value)}/>
      <p onClick={myClick}>
        Click on the Vite and React logos to learn more
      </p>
      <div className={'flex items-center gap-x-4'}>
        <Button onClick={resetText}>重置</Button>
      </div>
    </>
  )
}