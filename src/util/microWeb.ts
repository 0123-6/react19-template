import {projectConfig} from '../../project.config.ts'
import {watchLocationPathname} from '@/util/watchLocationPathname.ts'
import {goLoginPage, openNewTab} from '@/util/env.ts'

// 子网站向父网站发送消息约定格式
interface IMessage {
  // 子网站的唯一标示符
  name: string,
  // 发送信息的类型
  type: string,
  // 发送的实际信息,使用JSON.stringify()转换为string字符串.
  data: string,
}

interface IChildWeb {
  name: string,
  baseUrl: string,
}

interface IMicroWeb {
  childWebList: IChildWeb[],
  initTypeData: Record<string, any>,
}

// 父网站调用，拥有微前端的能力
export const microWeb = (props: IMicroWeb): {
  locationPathnameChangeCallback: () => void,
  cancel: () => void,
} => {
  const {
    childWebList,
    initTypeData,
  } = props

  const sendMessage = (message: IMessage) => {
    (document.getElementById('iframe') as HTMLIFrameElement)?.contentWindow?.postMessage(message, location.origin)
  }

  const messageEvent = (event: MessageEvent) => {
    if (event.origin !== location.origin) {
      console.log('无效的message')
      console.log(event)
      return
    }

    if (!childWebList.some(childWeb => childWeb.name === event.data.name)) {
      console.log('这并不是此网站的子系统的信息,忽略')
      return
    }
    console.log('event: ', event)
    const eventData = JSON.parse(event.data?.data || 'null')
    // 子项目挂载完成
    if (event.data.type === 'init') {
      sendMessage({
        name: event.data.name,
        type: 'init',
        data: JSON.stringify({
          pathnameSuffix: location.pathname.split(projectConfig.baseUrl)[1].split(event.data.name + '/')[1],
          search: location.search,
          ...initTypeData,
        }),
      })
    } else if (event.data.type === 'openNewTab') {
      // 子项目请求打开新页面
      openNewTab({
        pathnameSuffix: event.data.name + '/' + eventData.pathnameSuffix,
        search: eventData.search,
        newTab: eventData.newTab,
      })
    } else if (event.data.type === 'goLoginPage') {
      goLoginPage()
    }
  }

  const locationPathnameChangeCallback = () => {
    // 是否匹配某个子网站
    const matchChildWeb = childWebList.find(childWeb => location.pathname.split(projectConfig.baseUrl)[1].split(/\//)[0] === childWeb.name)
    if (!matchChildWeb) {
      return
    }
    const iframeElement = document.getElementById('iframe') as HTMLIFrameElement
    if (iframeElement.src !== location.origin + matchChildWeb.baseUrl) {
      iframeElement.src = location.origin + matchChildWeb.baseUrl
    }
    sendMessage({
      name: matchChildWeb.name,
      type: 'uri',
      data: JSON.stringify({
        pathnameSuffix: location.pathname.split(projectConfig.baseUrl)[1].split(matchChildWeb.name + '/')[1],
        search: location.search,
      }),
    })
  }

  window.addEventListener('message', messageEvent)
  const cancelWatchLocationPathname = watchLocationPathname(locationPathnameChangeCallback)

  // 取消函数
  const cancel = () => {
    window.removeEventListener('message', messageEvent)
    cancelWatchLocationPathname()
  }

  return {
    locationPathnameChangeCallback,
    cancel,
  }
}

interface IMicroWebChild {
  router: IAnyRouter,
  initEvent: (initData: Record<string, any>) => void,
}

interface IAnyRouter {
  currentRoute: any;
  push: Function,
  replace: Function,
}

// 子网站调用,
export const microWebChild = (props: IMicroWebChild): {
  ready: () => void,
  cancel: () => void,
} => {
  const {
    router,
    initEvent,
  } = props

  const ready = () => {
    // 如果父网站存在
    if (window.parent !== window) {
      window.parent?.postMessage({
        name: projectConfig.projectName,
        type: 'init',
        data: JSON.stringify(null),
      }, location.origin)
    }
  }

  const messageEvent = (event: MessageEvent) => {
    if (event.origin !== location.origin) {
      console.log('无效的message', event)
      return
    }
    if (event.data.name !== projectConfig.projectName) {
      console.log('不是发送给此此网站的信息', event)
      return
    }

    console.log('子项目收到父项目信息, event: ', event)
    const eventData = JSON.parse(event.data?.data || 'null')
    if (event.data.type === 'init') {
      initEvent(eventData)
      router.replace('/' + eventData.pathnameSuffix + eventData.search)
    } else if (event.data.type === 'uri') {
      if (router.currentRoute.value.path === `/${eventData.pathnameSuffix}`) {
        console.log(`子网站已经位于${eventData.pathnameSuffix}路径,忽略父网站的url命令`)
        return
      }
      router.replace('/' + eventData.pathnameSuffix + eventData.search)
    } else {
      console.error('未知消息类型，请检查代码')
      if (import.meta.env.DEV) {
        alert('未知消息类型，请检查代码')
      }
    }
  }

  window.addEventListener('message', messageEvent)

  const cancel = () => {
    window.removeEventListener('message', messageEvent)
  }

  return {
    ready,
    cancel,
  }
}