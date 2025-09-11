import { message } from 'antd'
import {projectConfig} from '../../project.config.ts'

// 成功
export const successMessage = (messageInfo: string) => {
  const [messageApi] = message.useMessage()
  messageApi.success(
    messageInfo,
    projectConfig.errorMessageDuration,
  )
}

// 警告
export const warningMessage = (messageInfo: string) => {
  const [messageApi] = message.useMessage()
  messageApi.warning(
    messageInfo,
    projectConfig.errorMessageDuration,
  )
}

// 失败
export const errorMessage = (messageInfo: string) => {
  const [messageApi] = message.useMessage()
  messageApi.error(
    messageInfo,
    projectConfig.errorMessageDuration,
  )
}