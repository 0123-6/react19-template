import { useState } from 'react'
import {Input} from "antd";

function App() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')

  const myClick = async () => {
    await navigator.clipboard.writeText(text)
    console.log('赋值功能')
  }

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button type='button' onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <input name={'sd'} value={text} onChange={e => setText(e.target.value)}/>
      <Input value={text} onChange={e => setText(e.target.value)}/>
      <p className="read-the-docs" onClick={() => void myClick()}>
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
