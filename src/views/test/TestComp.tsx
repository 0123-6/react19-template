import {Popover} from 'antd'

const ContentComp = (
  <div className={'w-[400px] h-[400px] flex flex-col items-center bg-[orange]'}>
    <span>123</span>
    <span>456</span>
  </div>
)

export default function TestComp() {
  // state
  // effect
  // methods
  // render
  return (
    // 最外层
    <div className={'test-comp flex-grow flex flex-col items-center'}>
      <Popover
        color={'#ffa500'}
        overlayStyle={{
          maxWidth: '500px',
          padding: 0,
        }}
        arrow={false}
        overlayInnerStyle={{
          padding: 0,
        }}
        trigger={'hover'}
        placement={'top'}
        title={null}
        content={ContentComp}
      >
        <div className={'mt-[700px] w-[500px] h-[200px] flex items-center bg-[orange]'}></div>
      </Popover>
    </div>
  )
}
