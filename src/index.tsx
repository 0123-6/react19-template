// tailwindcss入口文件，包含tailwindcss定义和全局base css
import '@/index.css'
import '@/style/antd-reset.css'
import '@/style/nprogress.css'
// 导入react
import React from 'react'
// 导入react-dom
import ReactDOM from 'react-dom/client'

// 导入dayjs，antd依赖这个
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
// dayjs的中文包
import 'dayjs/locale/zh-cn'
// 导入antd顶层组件
import {ConfigProvider} from "antd";
// antd的中文包
import zhCN from 'antd/locale/zh_CN'
import App from './App.tsx'

// 将dayjs语言设置为中文
dayjs.locale('zh-cn')
// 支持季度
dayjs.extend(quarterOfYear)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/*antd包装组件，影响全局antd*/}
    <ConfigProvider
      // 设置antd为中文
      locale={zhCN}
      // 自定义主题
      theme={{
        token: {
          colorPrimary: '#1677ff',
          colorError: '#ff4d4f',
        },
      }}
    >
      <App/>
    </ConfigProvider>
  </React.StrictMode>,
)


