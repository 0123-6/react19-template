interface ISelectFile {
  // 接收的文件类型，同input元素的accept属性,''代表所有类型
  accept: string,
  // 最大文件大小
  maxSize?: number,
  // 多选吗,默认单选
  multiple?: boolean,
  // 选中文件后的回调函数
  callback: (params: { file: File, fileList: File[] }) => Promise<void>,
  // 选中文件，但是存在错误后的回调函数
  callbackError: (text: string) => void,
}

// 通用接口定义
export interface ISelectFileProps extends ISelectFile {
  // 要设置的HTML元素
  element: HTMLElement | (() => HTMLElement),
}

interface IParseFile extends ISelectFile {
  fileList: File[],
}

/**
 * 检查文件类型是否符合要求
 * @param accept 允许的文件类型（MIME类型或文件扩展名，如 'text/plain, .txt, .pdf, image/*'）
 * @param file 要检查的文件
 * @returns 是否符合要求
 */
const isValidFileType = (accept: string, file: File): boolean => {
  const acceptedTypes = accept.split(',').map(type => type.trim())

  const fileTypeMatches = acceptedTypes.some(type => {
    if (type.includes('/*')) {
      const [mainType] = type.split('/')
      const [fileMainType] = file.type.split('/')
      return mainType === fileMainType
    }
    return file.type === type
  })

  const fileExtensionMatches = acceptedTypes.some(type => file.name.endsWith(type))

  return fileTypeMatches || fileExtensionMatches
}

const parseFile = (props: IParseFile): void => {
  const {
    fileList,
    accept = '',
    maxSize = Infinity,
    callback = () => { /* empty */ },
    callbackError = () => { /* empty */ },
  } = props
  if (!fileList.length) {
    callbackError('文件读取失败')
    return
  }
  if (fileList.some(file => file.size > maxSize)) {
    callbackError('文件大小超出最大限制,请检查文件')
    return
  }
  if (accept && fileList.some(file => !isValidFileType(accept, file))) {
    callbackError('选中的文件格式错误')
    return
  }
  callback({
    file: fileList[0],
    fileList,
  })
}

// 选择文件实用函数
export const ableSelectFileByClick = (props: ISelectFileProps)
  : () => void => {
  const {
    accept,
    multiple = false,
  } = props
  let {
    element,
  } = props
  if (element instanceof Function) {
    element = element()
  }
  // 手动创建input元素
  const inputElement = document.createElement('input')
  inputElement.type = 'file'
  inputElement.accept = accept
  inputElement.multiple = multiple
  const handleChange = () => {
    parseFile({
      ...props,
      fileList: inputElement.files ? [...inputElement.files] : [],
    })
  }

  const handleClick = () => {
    inputElement.value = ''
    inputElement.click()
  }

  inputElement.addEventListener('change', handleChange)
  element.addEventListener('click', handleClick)

  // 返回清理函数
  return () => {
    inputElement.removeEventListener('change', handleChange)
    element.removeEventListener('click', handleClick)
  }
}

// 将普通HTML元素可以通过拖拽读取文件，需要在DOM绑定后调用一次
export const ableSelectFileByDrag = (props: ISelectFileProps)
  : () => void => {
  let {
    element,
  } = props
  if (element instanceof Function) {
    element = element()
  }

  const handleDragEnter = (e: DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const handleDragOver = (e: DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const handleDrop = (e: DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
    parseFile({
      ...props,
      fileList: e.dataTransfer?.files ? [...e.dataTransfer.files] : [],
    })
  }

  // 添加点击事件回调函数
  element.addEventListener('dragenter', handleDragEnter)
  element.addEventListener('dragover', handleDragOver)
  element.addEventListener('drop', handleDrop)

  // 返回清理函数
  return () => {
    element.removeEventListener('dragenter', handleDragEnter)
    element.removeEventListener('dragover', handleDragOver)
    element.removeEventListener('drop', handleDrop)
  }
}

export interface IExportFileProps {
  file: File
  callback: () => void
  callbackError: (text: string) => void
}

export function exportFile(props: IExportFileProps) {
  const {file, callback, callbackError} = props

  if (file.size === 0) {
    callbackError('文件为空，无法导出')
    return
  }

  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  document.body.appendChild(a)
  a.click()

  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  callback()
}