import {goLoginPage} from '@/util/env.ts'
import errorMessage from '@/util/errorMessage.ts'
import {exportFile} from '@/util/file.ts'
import {ElMessage} from 'element-plus'
import {projectConfig} from '../../project.config.ts'
import {isFalse} from '@/util/validator.ts'
import type {ISelectOption} from '@/components/base-form/useElSelect.ts'

// 防抖函数
export function debounce(fn: () => void, delay: number = 1000) {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
      clearTimeout(timer!)
      timer = null
    }, delay)
  }
}

// 节流函数
export function throttle(fn: () => void, delay: number = 1000) {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: any[]) {
    if (!timer) {
      fn.apply(this, args)
      timer = setTimeout(() => {
        clearTimeout(timer!)
        timer = null
      }, delay)
    }
  }
}

export interface IBaseFetch {
  // 前端mock Url
  mockUrl?: string,
  // mock专用请求属性
  mockObject?: Record<string, any>,
  // 开发环境直接访问后端接口
  mockProd?: boolean,

  prefix?: string,
  url: string,

  method?: 'get' | 'post',
  headers?: Record<string, string>,
  signal?: AbortSignal,

  data?: Record<string, any>,
  isJson?: boolean,
  isFormData?: boolean,

  // 返回的是不是文件流
  isFile?: boolean,

  // 是否有接口权限
  permission?: boolean | (() => boolean),
}

export interface IResponseData {
  // 正常情况下为200
  code: number
  // 描述信息
  msg?: string
  message?: string
  // 真正的数据
  data: Record<string, any>
}

interface IBaseFetchReturn {
  // 是否成功
  isOk: boolean,
  // 失败原因
  reason?: string,
  // 返回数据
  responseData?: IResponseData,
}

// 没有超时功能
// 没有重试机制
export async function baseFetch(props: IBaseFetch)
  : Promise<IBaseFetchReturn> {
  const {
    mockUrl = '',
    mockObject = undefined,
    mockProd = false,
    prefix = projectConfig.apiPrefix.DEFAULT,
    method = projectConfig.fetchDefaultMethod,
    signal,
    isFormData = false,
    isFile = false,
    permission = true,
  } = props
  let {
    url,
    headers = {},
    data,
    isJson = true,
  } = props
  if (isFormData) {
    isJson = false
  }
  let body: string | Blob | FormData = undefined
  const isFetchProd = import.meta.env.PROD || mockProd
  if (!url) {
    ElMessage.error('url不可以为\'\',请设置初始值为\'mock_\'')
    return {
      isOk: false,
    }
  }
  // 保证修改完全
  if (url.startsWith('/') || mockUrl.startsWith('/')) {
    ElMessage.error('请检查url或mockUrl,不能以/开头')
    return {
      isOk: false,
    }
  }
  if (isFalse(permission)) {
    return {
      isOk: false,
    }
  }
  // 特殊处理/mock
  if (!isFetchProd && mockObject) {
    data = {
      ...data,
      mockObject,
    }
  }

  // 设置data属性和content-type
  if (data) {
    if (method === 'get') {
      url += `?${new URLSearchParams(data).toString()}`
    } else if (method === 'post') {
      if (isJson) {
        body = JSON.stringify(data)
        headers = {
          ...headers,
          // 小写即可
          'content-type': 'application/json',
        }
      } else if (isFormData) {
        const formData = new FormData()
        for (const [key, value] of Object.entries(data)) {
          if (Array.isArray(value)) {
            for (const item of value) {
              formData.append(key, item)
            }
          } else {
            formData.set(key, value)
          }
        }
        body = formData
      } else {
        // 不是json，也不是FormData
        body = data as string | Blob
      }
    }
  }

  try {
    const resource = isFetchProd ? (prefix + url) : ('/mock/' + mockUrl)
    // 添加前缀，通过代理方式解决跨域报错
    const response = await fetch(resource, {
      method,
      headers,
      body,
      signal,
    })

    // 接口无效或服务器错误
    if (!response.ok) {
      errorMessage('api请求失败：' + response.status + ' 接口无效或服务器错误')
      return {
        isOk: false,
      }
    }

    // 如果是json格式
    const contentType = response.headers.get('Content-Type')
    if (contentType && contentType.includes('application/json')) {
      // 格式为{code:'',msg:'',data: object}
      const responseData: IResponseData = await response.json()
      // 正常情况为fetchApiResponseCodeMap.success数组的一个
      if (!projectConfig.fetchApiResponseCodeMap.success.includes(responseData.code)) {
        errorMessage(responseData.msg || responseData.message || `${url}接口异常`)
        // 账号超时，需要重新登录
        if (projectConfig.fetchApiResponseCodeMap.notLogin.includes(responseData.code)) {
          goLoginPage()
        }
        return {
          isOk: false,
        }
      } else if (isFile) {
        // 文件类型得到json表示错误
        ElMessage.warning('文件下载失败: ' + responseData?.msg || responseData?.message || '')
        return {
          isOk: false,
        }
      }
      return {
        isOk: true,
        responseData,
      }
    } else {
      // 文件类型
      // 提取文件名
      const contentDisposition = response.headers.get('Content-Disposition')
      let fileName = 'downloaded-file' // 默认文件名
      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*=utf-8''([^;]+)$/i)
        if (match && match[1]) {
          fileName = decodeURIComponent(match[1]) // 解码文件名，解决乱码
        }
      }
      const responseBlob = await response.blob()
      if (responseBlob.size === 0) {
        ElMessage.warning('文件为空文件,无法下载')
        return {
          isOk: false,
        }
      }

      const file = new File([responseBlob], fileName, {type: responseBlob.type})
      exportFile({
        file,
        callback: () => {
          ElMessage.success('文件下载成功')
        },
        callbackError: text => {
          ElMessage.error(text)
        },
      })
      return {
        isOk: true,
      }
    }
  } catch (e) {
    if ((e as Error).name === 'AbortError') {
      console.log('手动停止的错误')
      return {
        isOk: false,
        reason: 'AbortError',
      }
    } else {
      errorMessage('api请求失败：网络错误')
      return {
        isOk: false,
      }
    }
  }
}

// 常见数据结构,可以提取mock和transform
export interface IBaseItem {
  label?: string,
  prop?: string,
  children?: IBaseItem[],
  // 展示时使用,不改变原数据
  formatter?: (value: any) => (string | number),
  // 数据转换,处理脏数据,改变原数据
  transform?: (value: any) => any,
  mock?: any,
  // 适用于{label: '', value: ''}类固定信息展示
  list?: ISelectOption[],
  hidden?: boolean | (() => boolean),
}

const dfsGenerateMockObject = (item: IBaseItem, mockObject: Record<string, any>) => {
  if (!item) {
    return
  }
  if (Array.isArray(item.children)) {
    // 嵌套column
    item.children.forEach(item => dfsGenerateMockObject(item, mockObject))
    return
  }
  // 单个column
  if (!(item.label && item.prop)) {
    return
  }
  // {label: '', value: ''}格式
  if (item.list?.length) {
    mockObject[item.prop] = [
      '',
      ...(item.list.map(_item => _item.value)),
    ]
    return
  }
  mockObject[item.prop] = item.mock
    ?? [
      '',
      item.label,
      Array(20).fill(item.label).join(),
    ]
}

export const generateMockObject = (list: IBaseItem[]) => {
  const mockObject = Object.create(null)
  for (let i = 0; i < list.length; i++) {
    dfsGenerateMockObject(list[i], mockObject)
  }
  return mockObject
}

const dfsGenerateTransformMap = (item: IBaseItem, map: Record<string, any>) => {
  if (!item) {
    return
  }
  if (Array.isArray(item.children)) {
    // 嵌套column
    item.children.forEach(item => dfsGenerateTransformMap(item, map))
    return
  }
  // 单个column
  if (!(item.label && item.prop)) {
    return
  }
  if (item.transform) {
    map[item.prop] = item
  }
}

// 使用transform转换
export const transformValue = (rawValue: Record<string, any>, list: IBaseItem[])
  : Record<string, any> => {
  const listMap = Object.create(null)
  for (let i = 0; i < list.length; i++) {
    dfsGenerateTransformMap(list[i], listMap)
  }
  return Object.fromEntries(
    Object.entries(rawValue).map(([key, value]) => [
      key,
      listMap[key]?.transform?.(value) ?? value,
    ]),
  )
}