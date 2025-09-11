import {ElMessage} from 'element-plus'
import {projectConfig} from '../../project.config.ts'

export default function (message: string) {
  ElMessage({
    type: 'error',
    message,
    showClose: true,
    duration: projectConfig.errorMessageDuration,
  })
}