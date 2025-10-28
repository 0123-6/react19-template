import {warningMessage} from '@/util/message.ts'
import {projectConfig} from '../../project.config.ts'
import router from '@/plugin/vue-router.ts'

interface IOpenNewTab {
  pathnameSuffix: string,
  search?: any,
  newTab?: boolean
}

// 打开新页面
export const openNewTab = (props: IOpenNewTab) => {
  const {
    pathnameSuffix,
    newTab = true,
  } = props
  let {
    search,
  } = props
  if (search) {
    search = '?' + new URLSearchParams(search).toString()
  } else {
    search = ''
  }
  // 如果是子网站iframe
  if (window.parent !== window) {
    if (!newTab) {
      router.replace('/' + pathnameSuffix + search)
    }
    window.parent.postMessage({
      name: projectConfig.projectName,
      type: 'openNewTab',
      data: JSON.stringify({
        pathnameSuffix,
        search,
        newTab,
      }),
    }, location.origin)
  } else {
    // 单独项目
    if (newTab) {
      window.open(location.origin + projectConfig.baseUrl + pathnameSuffix + search)
    } else {
      router.push('/' + pathnameSuffix + search)
    }
  }
}

// 跳转到登陆页面
export const goLoginPage = () => {
  // 如果是子网站
  if (window.parent !== window) {
    window.parent.postMessage({
      name: projectConfig.projectName,
      type: 'goLoginPage',
      data: JSON.stringify(null),
    }, location.origin)
  } else {
    warningMessage('请重新登录')
    if (projectConfig.loginMode === 'router') {
      router.push(projectConfig.loginRoutePath)
    } else {
      location.href = location.origin + projectConfig.loginUrl
    }
  }
}