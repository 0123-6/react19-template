import {Link, Outlet} from 'react-router-dom'

export default function Layout() {
  // state
  // mounted
  // methods
  // render
  return (
    <div className={'w-screen h-screen bg-pink-200 flex flex-col'}>
      {/*导航*/}
      <div className={'flex-shrink-0 h-[100px] flex items-center gap-x-2'}>
        <Link to={'/index'} replace>首页</Link>
        <Link to={'/module-one'} replace>模块1</Link>
        <Link to={'/module-two'} replace>模块2</Link>
        <Link to={'/module-four'} replace>模块4</Link>
        <Link to={'/person-center'} replace>个人中心</Link>
      </div>
      {/*内容*/}
      <Outlet/>
    </div>
  )
}
