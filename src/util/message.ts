import {ElMessage} from 'element-plus'
import {projectConfig} from '../../project.config.ts'

// 成功
export const successMessage = (message: string) => {
  ElMessage({
    type: 'success',
    message,
    showClose: true,
    duration: projectConfig.errorMessageDuration,
  })
}

// 警告
export const warningMessage = (message: string) => {
  ElMessage({
    type: 'warning',
    message,
    showClose: true,
    duration: projectConfig.errorMessageDuration,
  })
}

// 失败
export const errorMessage = (message: string) => {
  ElMessage({
    type: 'error',
    message,
    showClose: true,
    duration: projectConfig.errorMessageDuration,
  })
}