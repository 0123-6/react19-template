import {DatePicker, Form, Input, Radio, Select, TreeSelect} from 'antd'
import {isFalse, isTrue} from '@/util/validator.ts'

export interface IBaseFormItem {
  label?: string,
  prop?: string,
  type: string,
  placeholder?: string,
  list?: any[],
  multiple?: boolean,
  rules?: any[],
  hidden?: boolean | (() => boolean),
  disabled?: boolean | (() => boolean),
  dependencies?: string[],
  // textarea专用
  maxLength?: number,
  minRows?: number,
}

interface IBaseFormItemList {
  list: IBaseFormItem[],
  range?: number[],
}

export default function BaseFormItemList(props: IBaseFormItemList) {
  const {
    list,
  } = props

  return (
    <>
      {
        list
        .filter(item => isFalse(item.hidden))
        .map((item, index) => (
          <Form.Item
            key={index}
            label={item.label}
            name={item.prop}
            rules={item.rules}
            validateFirst
            dependencies={item.dependencies}
          >
            {
              item.type === 'input' && (
                <Input
                  placeholder={item.placeholder ?? `请输入${item.label}`}
                  allowClear
                  disabled={isTrue(item.disabled)}
                />
              )
            }
            {
              item.type === 'input-password' && (
                <Input.Password
                  placeholder={item.placeholder ?? `请输入${item.label}`}
                  allowClear
                  disabled={isTrue(item.disabled)}
                />
              )
            }
            {
              item.type === 'textarea' && (
                <Input.TextArea
                  placeholder={item.placeholder ?? `请输入${item.label}`}
                  allowClear
                  disabled={isTrue(item.disabled)}
                  maxLength={item.maxLength}
                  autoSize={{
                    minRows: item.minRows,
                  }}
                />
              )
            }
            {
              item.type === 'select' && (
                <Select
                  placeholder={item.placeholder ?? `请选择${item.label}`}
                  allowClear
                  showSearch
                  options={item.list}
                  mode={item.multiple ? 'multiple' : undefined}
                  disabled={isTrue(item.disabled)}
                />
              )
            }
            {
              item.type === 'tree-select' && (
                <TreeSelect
                  placeholder={item.placeholder ?? `请选择${item.label}`}
                  allowClear
                  showSearch
                  treeData={item.list}
                  multiple={item.multiple}
                  disabled={isTrue(item.disabled)}
                />
              )
            }
            {
              item.type === 'radio' && (
                <Radio.Group
                  options={item.list}
                  disabled={isTrue(item.disabled)}
                />
              )
            }
            {
              item.type === 'daterange' && (
                <DatePicker.RangePicker
                  allowClear
                  disabled={isTrue(item.disabled)}
                />
              )
            }
          </Form.Item>
        ))
      }
    </>
  )
}
