import {RouterProvider} from 'react-router'
import {router} from '@/router'

export default function LayoutPage() {
  return (
    <RouterProvider router={router}/>
  )
}