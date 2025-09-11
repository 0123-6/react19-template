import * as XLSX from 'xlsx'

export interface IExcelParse {
  // 要解析的Excel文件
  file: File
  // 解析的sheet名，不存在的话，解析第一张表
  sheetName?: string
  // 期待的表头，不符合期待会触发错误回调
  expectedKeyList?: string[]

  // 正确回调
  callback: (list: any[]) => void
  // Excel文件不符合期待时的错误回调
  callbackError: (text: string) => void
}

// 解析Excel文件
export async function excelParse(props: IExcelParse) {
  const {
    file,
    expectedKeyList = [],
    callback,
    callbackError,
  } = props
  let {
    sheetName = '',
  } = props

  try {
    // 获取文件流
    const fileArrayBuffer = await file.arrayBuffer()
    // 获取Excel全部sheet表
    const workbook = XLSX.read(fileArrayBuffer)
    // 如何不存在任何sheet表
    if (workbook.SheetNames.length === 0) {
      callbackError('Excel没有任何sheet')
      return
    }

    // 获取指定表，默认第1张表
    sheetName = sheetName || workbook.SheetNames[0]
    // 获取指定sheet
    const sheet = workbook.Sheets[sheetName]
    // 如果获取不到指定sheet，报错
    if (!sheet) {
      callbackError('无法找到指定sheet')
      return
    }

    // 获取表格数据，以行为单位
    const sheetList = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    })
    // 指定sheet文件是空文件
    if (sheetList.length === 0) {
      callbackError('指定sheet文件是空文件')
      return
    }

    // 判断文件是否符合预期
    const keyList = sheetList[0] as string[]
    const isExpected = expectedKeyList.length === 0 ||
      expectedKeyList.length === keyList.length &&
      expectedKeyList.every(key => keyList.includes(key))
    // 不符合预期
    if (!isExpected) {
      callbackError('文件标题不符合预期')
      return
    }

    // 以第一行为key，解析表格为JSON格式
    const sheetData = XLSX.utils.sheet_to_json(sheet, {
      defval: null,
    })
    callback(sheetData)
  } catch (error) {
    callbackError(`解析Excel文件时出错：${(error as Error).message}`)
  }
}

// 将数据导出为Excel文件
export interface IExcelExportProps {
  // 要创建的文件名
  fileName: string
  // 要创建的sheet名
  sheetName?: string
  // 要导出的数据
  data: object[]
  // 成功回调
  callback: () => void
  // 失败回调
  callbackError: (text: string) => void
}

// 将数据导出为Excel文件
export function excelExport(props: IExcelExportProps) {
  const {
    sheetName = 'Sheet1',
    data,
    callback,
    callbackError,
  } = props
  let {
    fileName,
  } = props

  // 兼容fileName
  if (!fileName.endsWith('.xlsx')) {
    fileName += '.xlsx'
  }

  try {
    // 创建新Excel对象
    const newExcel = XLSX.utils.book_new()
    // 创建新Sheet对象
    const newSheet = XLSX.utils.json_to_sheet(data)
    // 绑定Excel对象和Sheet对象
    XLSX.utils.book_append_sheet(newExcel, newSheet, sheetName)
    // 导出Excel文件
    XLSX.writeFile(newExcel, fileName, {
      compression: true,
    })
    // 触发成功回调
    callback()
  } catch (e) {
    callbackError(`导出Excel文件时发生错误：${(e as Error).message}`)
  }
}