import {Outlet} from 'react-router'
import BaseBg from '@/components/base-bg/BaseBg.tsx'

export default function AuthPage() {
  return (
    <div className={'w-full grow'}>
      <BaseBg/>
      <div className="w-full h-full flex justify-center items-center">
        <Outlet/>
      </div>
    </div>
  )
}