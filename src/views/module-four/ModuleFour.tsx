import React, {useEffect, useRef, useState} from 'react'
import DraggableModal from '@/components/draggable-modal'
import {Space, Table, type TableProps, Typography} from 'antd'
import {debounce, throttle} from '@/util/api.ts'
import {ableSelectFileByClick, type ISelectFileProps} from '@/util/file.ts'
import {excelExport, excelParse, type IExcelExportProps} from '@/util/excel.ts'

// import DraggableComp from "@/components/react-beautiful-dnd/DraggableComp.tsx";

interface RecordType {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  address1: string;
  address2: string;
  address3: string;
}


const fixedColumns: TableProps<RecordType>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
    fixed: 'left',
  },
  {
    title: 'FistName',
    dataIndex: 'firstName',
    width: 120,
    fixed: 'left',
  },
  {
    title: 'LastName',
    dataIndex: 'lastName',
    width: 120,
    fixed: 'left',
  },
  {
    title: 'Group',
    width: 120,
    render: (_, record) => `Group ${Math.floor(record.id / 4)}`,
    onCell: (record) => ({
      rowSpan: record.id % 4 === 0 ? 4 : 0,
    }),
  },
  {
    title: 'Age',
    dataIndex: 'age',
    width: 100,
    onCell: (record) => ({
      colSpan: record.id % 4 === 0 ? 2 : 1,
    }),
  },
  {
    title: 'Address 1',
    dataIndex: 'address1',
    onCell: (record) => ({
      colSpan: record.id % 4 === 0 ? 0 : 1,
    }),
  },
  {
    title: 'Address 2',
    dataIndex: 'address2',
  },
  {
    title: 'Address 3',
    dataIndex: 'address3',
  },
  {
    title: 'Action',
    width: 150,
    fixed: 'right',
    render: () => (
      <Space>
        <Typography.Link>Action1</Typography.Link>
        <Typography.Link>Action2</Typography.Link>
      </Space>
    ),
  },
]

const columns: TableProps<RecordType>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: 'FistName',
    dataIndex: 'firstName',
    width: 120,
  },
  {
    title: 'LastName',
    dataIndex: 'lastName',
    width: 120,
  },
]

const getData = (count: number) => {
  const data: RecordType[] = new Array(count).fill(null).map((_, index) => ({
    id: index,
    firstName: `First_${index.toString(16)}`,
    lastName: `Last_${index.toString(16)}`,
    age: 25 + (index % 10),
    address1: `New York No. ${index} Lake Park`,
    address2: `London No. ${index} Lake Park`,
    address3: `Sydney No. ${index} Lake Park`,
  }))

  return data
}

export default function ModuleFour() {
  // state
  const [text, setText] = useState<string>('')
  const [show, setShow] = useState(false)
  // 虚拟表格
  const [fixed, setFixed] = React.useState(true)
  const [bordered, setBordered] = React.useState(true)
  const [expanded, setExpanded] = React.useState(false)
  const [empty, setEmpty] = React.useState(false)
  const [count, setCount] = React.useState(10000)
  const xlsxRef = useRef(null)
  // effect
  useEffect(() => {
    const clickProps: ISelectFileProps = {
      element: xlsxRef.current!,
      accept: '.xlsx, .xls',
      callback: async file => {
        excelParse({
          file,
          expectedKeyList: ['编号', '姓名', '性别', '年龄', '单位'],
          callback: excelData => {
            console.log(excelData)
          },
          callbackError: text => {
            alert(text)
          },
        })
      },
      callbackError: text => {
        alert(text)
      },
    }
    const cancelFn = ableSelectFileByClick(clickProps)

    return () => {
      cancelFn()
    }
  }, [])

  // methods
  async function copy() {
    await navigator.clipboard.writeText(text)
  }

  const tblRef: Parameters<typeof Table>[0]['ref'] = React.useRef(null)
  const data = React.useMemo(() => getData(count), [count])

  const mergedColumns = React.useMemo<typeof fixedColumns>(() => {
    if (!fixed) {
      return columns
    }

    if (!expanded) {
      return fixedColumns
    }

    return fixedColumns.map((col) => ({...col, onCell: undefined}))
  }, [expanded, fixed])

  const expandableProps = React.useMemo<TableProps<RecordType>['expandable']>(() => {
    if (!expanded) {
      return undefined
    }

    return {
      columnWidth: 48,
      expandedRowRender: (record) => <p style={{margin: 0}}>🎉 Expanded {record.address1}</p>,
      rowExpandable: (record) => record.id % 2 === 0,
    }
  }, [expanded])
  const getData10 = debounce(function () {
    console.log('点击了防抖函数')
  }, 2000)
  const getData11 = throttle(function () {
    console.log('点击了节流函数')
  }, 2000)

  function clickExport() {
    const data = [
      {
        '姓名': '夏翀',
        '年龄': 25,
      },
      {
        '姓名': '吕凤凤',
        '年龄': 24,
      },
      {
        '姓名': '江思雨',
        '年龄': 31,
      },
      {
        '姓名': '申梦瑶',
        '年龄': 32,
      },
      {
        '姓名': '唐建飞',
        '年龄': 33,
      },
      {
        '姓名': '马晓琪',
        '年龄': 28,
      },
      {
        '是': 's',
      },
    ]
    const exportProps: IExcelExportProps = {
      fileName: '美女名单.xlsx',
      data,
      callback: () => {
        alert('导出成功')
      },
      callbackError: text => {
        alert(text)
      },
    }
    excelExport(exportProps)
  }

  // render
  return (
    <div className={'w-full h-[600px] flex flex-col'}>
      <span className={'text-3xl'}>模块4</span>
      <div className={'w-full h-[300px] flex flex-col'}>
        <span className={'mt-2 text-3xl'}>复制</span>
        <textarea value={text}
          onChange={e => setText(e.target.value)}></textarea>
        <button className={'mt-2 w-[100px]'}
          onClick={copy}>复制
        </button>
        <button className={'mt-2 w-[100px]'}
          onClick={() => setShow(true)}>打开弹框
        </button>
      </div>
      <Table
        bordered={bordered}
        virtual
        columns={mergedColumns}
        scroll={{x: 2000, y: 400}}
        rowKey="id"
        dataSource={empty ? [] : data}
        pagination={false}
        ref={tblRef}
        rowSelection={
          expanded
            ? undefined
            : {
              type: 'radio',
              columnWidth: 48,
            }
        }
        expandable={expandableProps}
      />
      <div className={'flex-shrink-0 w-full h-[1000px]'}></div>
      <div className={'h-[30px]'}></div>
      {/*可拖拽*/}
      {/*<DraggableComp/>*/}
      <div className={'mt-5 flex items-center'}>
        <button onClick={getData10}>防抖</button>
        <button onClick={getData11} className={'ml-5'}>节流</button>
      </div>
      {/*excel相关*/}
      <div className={'mt-5 flex items-center'}>
        <button ref={xlsxRef}>解析XLSX</button>
        <button onClick={clickExport}>导出XLSX</button>
      </div>
      <DraggableModal title={'我草吕凤凤'}
        show={show}
        onCancel={() => setShow(false)}>
        <div className={'w-[400px] h-[400px] flex flex-col'}>
          <div className={'w-full h-[100px] bg-amber-300'}>
            <span className={'text-blue-500'}>吕凤凤</span>
          </div>
        </div>
      </DraggableModal>
    </div>
  )
}
