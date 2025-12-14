import {useRef} from 'react'
import {useResetState} from '@/util/hooks/useResetState.ts'
import type {IBaseFetch} from '@/util/api.ts'
import {useBaseFetch} from '@/util/hooks/useBaseFetch.ts'
import {warningMessage} from '@/util/message.ts'
import {useAsyncEffect} from '@/util/hooks/useEffectUtil.ts'
import type {FormInstance} from 'antd'

export type TypeTableSelectType = 'single' | 'batch'
export type TypeAddOrEdit = 'add' | 'edit'

export interface ITableRef {
  scrollTo: (
    config: {
      index?: number,
      key?: React.Key,
      top?: number,
      offset?: number,
    }
  ) => void,
  nativeElement: HTMLDivElement,
}

export interface IUseBaseTableProps {
  // 因为这是要多次执行的,所以不能传递一个一次性值,而是一个函数,获取当时的期待值
  // 通过接口获取数据时必填
  fetchOptionFn?: () => IBaseFetch,
  microTask?: boolean,
  formObject?:  FormInstance | (() =>  FormInstance),
  columns: any[],
  pageSizeOptions?: number[],
}

export const useBaseTable = <T extends Record<string, any>>(props: IUseBaseTableProps<T>) => {
  const {
    fetchOptionFn,
    microTask = true,
    columns,
    pageSizeOptions = [10, 20, 30],
  } = props
  let formObject: FormInstance
  if (props.formObject) {
    formObject = typeof props.formObject === 'function'
      ? props.formObject()
      : props.formObject
  }

  const tableRef = useRef<ITableRef>(null)

  const [total, setTotal, resetTotal] = useResetState(() => 0)
  const [list, setList, resetList] = useResetState((): T[] => [])

  const [params, setParams, resetParams] = useResetState(() => ({
    pageNum: 1,
    pageSize: 10,
    // 排序属性
    orderFiled: '',
    // '', asc升序,desc降序
    orderStatus: '',
  }))
  const changePagination = (pageNum: number, pageSize: number) => {
    setParams({
      ...params,
      pageNum,
      pageSize,
    })
  }
  useAsyncEffect(async () => {
    try {
      if (formObject) {
        await formObject.validateFields()
      }
      fetchTableObject.doFetch()
    } catch (e) {
      warningMessage('查询表单校验失败')
      console.log(e)
    }
  }, [params], {
    immediate: false,
  })

  const [selectType, setSelectType, resetSelectType] = useResetState((): TypeTableSelectType => 'single')
  const [selectItem, setSelectItem, resetSelectItem] = useResetState((): T => null)
  const [selectItemList, setSelectItemList, resetSelectItemList] = useResetState((): T[] => [])
  const [selectItemKeyList, setSelectItemKeyList, resetSelectItemKeyList] = useResetState((): number[] => [])
  const onSelectionChange = (selectedRowKeys: number[], selectedRows: T[]) => {
    setSelectItemKeyList(selectedRowKeys)
    setSelectItemList(selectedRows)
  }
  const tableObjectReset = () => {
    tableRef.current?.scrollTo?.({
      top: 0,
    })
    resetSelectType()
    resetSelectItem()
    resetSelectItemList()
    resetSelectItemKeyList()
  }


  const solveRawData = (responseData: any) => {
    if (!responseData) {
      resetTotal()
      resetList()
      return
    }
    // 兼容数组类型
    if (Array.isArray(responseData)) {
      responseData = {
        list: responseData,
        total: responseData.length,
      }
    }
    if (typeof responseData !== 'object') {
      warningMessage('表格请求接口返回值类型不合法,请检查接口')
      resetTotal()
      resetList()
      return
    }
    if (responseData.total == null || responseData.list == null || responseData.total < 0) {
      resetTotal()
      resetList()
      return
    }
    if (!Number.isInteger(responseData.total) || !Array.isArray(responseData.list)) {
      warningMessage('表格请求接口返回值类型不合法,请检查接口')
      resetTotal()
      resetList()
      return
    }

    // responseData.list = (responseData.list as T[])
    // .filter(Boolean)
    // .map((item, index) => ({
    //   ...transformValue(item, list),
    // }))
    setTotal(responseData.total)
    setList(responseData.list.map((item, index) => ({
      ...item,
      index: index + 1 + params.pageSize * (params.pageNum - 1),
    })))
  }
  const fetchTableObject = useBaseFetch({
    beforeFetchResetFn: tableObjectReset,
    fetchOptionFn: () => ({
      ...fetchOptionFn(),
      mockUrl: 'getTableList',
      data: {
        ...params,
        ...(fetchOptionFn().data),
      },
    }),
    transformResponseDataFn: solveRawData,
    microTask,
  })

  return {
    tableRef,
    columns,

    total,
    setTotal,
    list,
    setList,

    params,
    setParams,
    resetParams,
    changePagination,
    pageSizeOptions,

    selectType,
    setSelectType,
    resetSelectType,
    selectItem,
    setSelectItem,
    resetSelectItem,
    selectItemList,
    setSelectItemList,
    resetSelectItemList,
    selectItemKeyList,
    setSelectItemKeyList,
    resetSelectItemKeyList,
    onSelectionChange,
    tableObjectReset,

    get isFetching() {
      return fetchTableObject.isFetching
    },
    doFetch: fetchTableObject.doFetch,
  }
}
