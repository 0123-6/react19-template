import { message } from 'antd'
import {projectConfig} from '../../project.config.ts'

// 成功
export const successMessage = (messageInfo: string) => {
  message.success(messageInfo, projectConfig.errorMessageDuration)
}

// 警告
export const warningMessage = (messageInfo: string) => {
  message.warning(messageInfo, projectConfig.errorMessageDuration)
}

// 失败
export const errorMessage = (messageInfo: string) => {
  message.error(messageInfo, projectConfig.errorMessageDuration)
}
