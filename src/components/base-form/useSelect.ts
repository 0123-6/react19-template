import type {IBaseFetch} from '@/util/api.ts'
import {useResetState} from '@/util/hooks/useResetState.ts'
import {useBaseFetch} from '@/util/hooks/useBaseFetch.ts'
import {warningMessage} from '@/util/message.ts'

// select的option的标准格式
export interface ISelectOption {
  label: string,
  value: string | number | boolean,
  disabled?: boolean,
  children?: ISelectOption[],
  isLeaf?: boolean,
  // 用于匹配样式
  type?: 'primary' | 'success' | 'warning' | 'error' | 'text',
}

interface IUseElSelectPropsConfig {
  labelName?: string | ((item: any) => string),
  valueName?: string,
  disabledName?: string,
  childrenName?: string,
  isLeafName?: string,
}

export interface IUseElSelectProps {
  // 配置项
  config?: IUseElSelectPropsConfig,
  fetchOptionFn: () => IBaseFetch,
  microTask?: boolean,
}

export interface IUseElSelectReturn {
  data: ISelectOption[],
  dataToMap: Record<string | number, string | number>,

  readonly isFetching: boolean,
  doFetch: () => Promise<boolean>,
}

// 根据value匹配label
export const selectOptionListToMap = (list: ISelectOption[])
  : Record<string | number, string | number> => {
  const map = Object.create(null)
  for (const item of list) {
    map[item.value as (string | number)] = item.label
  }
  return map
}

// 为select类型组件提供支持
export const useSelect = (props: IUseElSelectProps)
  : IUseElSelectReturn => {
  const {
    config = {} as IUseElSelectPropsConfig,
    fetchOptionFn,
    microTask = true,
  } = props
  config.labelName = config.labelName ?? 'label'
  const labelFn: ((item: any) => string) = typeof config.labelName === 'string' ? (item => item[config.labelName as string]) : config.labelName
  config.valueName = config.valueName ?? 'value'
  config.disabledName = config.disabledName ?? 'disabled'
  config.childrenName = config.childrenName ?? 'children'
  config.isLeafName = config.isLeafName ?? 'isLeaf'

  // dfs
  const dfs = (item: any): ISelectOption => {
    if (!item) {
      return
    }

    const result: ISelectOption = {
      label: labelFn(item),
      value: item[config.valueName],
      disabled: item[config.disabledName] ?? false,
      children: item[config.childrenName] ?? [],
      isLeaf: item[config.isLeafName] ?? false,
    }

    for (let i = 0; i < result.children.length; i++) {
      result.children[i] = dfs(result.children[i])
    }

    return result
  }

  const [selectOptionList, setSelectOptionList, resetSelectOptionList] = useResetState((): ISelectOption[] => [])
  const [dataToMap, setDataToMap] = useResetState((): Record<string | number, string | number> => ({}))
  const fetchSelectOption = useBaseFetch({
    beforeFetchResetFn: resetSelectOptionList,
    fetchOptionFn: () => ({
      mockUrl: 'getList',
      mockObject: {
        label: '模拟数据项',
        labelName: typeof config.labelName === 'string' ? config.labelName : undefined,
        valueName: config.valueName,
      },
      ...fetchOptionFn(),
    }),
    transformResponseDataFn: (responseData: any) => {
      if (!responseData) {
        resetSelectOptionList()
        return
      }
      if (!Array.isArray(responseData)) {
        warningMessage('表单请求接口返回值类型不合法,请检查接口')
        resetSelectOptionList()
        return
      }
      // 转换和兼容非对象值
      for (let i = 0; i < (responseData).length; i++) {
        if (!(typeof responseData[i] === 'object' && responseData[i] !== null)) {
          responseData[i] = {
            [config.labelName as string]: responseData[i],
            [config.valueName]: responseData[i],
          }
        }
      }
      responseData = (responseData as Record<string, any>[])
      .filter(Boolean)
      .filter(item => labelFn(item) != null && item[config.valueName] != null)
      if (
        (responseData as any[]).length !== new Set((responseData as any[]).map(item => item[config.valueName])).size
        || (responseData as any[]).length !== new Set((responseData as any[]).map(labelFn)).size
      ) {
        warningMessage('表单的label或value存在重复,请检查接口')
        resetSelectOptionList()
        return
      }
      setSelectOptionList(responseData.map(dfs))
      setDataToMap(selectOptionListToMap(selectOptionList))
    },
    microTask,
  })

  return {
    get data() {
      return selectOptionList
    },
    get dataToMap() {
      return dataToMap
    },

    get isFetching() {
      return fetchSelectOption.isFetching
    },
    doFetch: fetchSelectOption.doFetch,
  }
}
