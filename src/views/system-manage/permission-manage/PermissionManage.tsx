import {type TypeAddOrEdit, useBaseTable} from '@/components/base-table/useBaseTable.ts'
import {Button, Drawer, Table} from 'antd'
import {useFeedback} from '@/components/base-dialog/useFeedback.ts'
import {useResetState} from '@/util/hooks/useResetState.ts'
import {successMessage} from '@/util/message.ts'
import {useBaseFetch} from '@/util/hooks/useBaseFetch.ts'
import {SearchOutlined} from '@ant-design/icons'
import PromptDialog from '@/components/base-dialog/PromptDialog.tsx'
import type {IPermission} from '@views/system-manage/permission-manage/permissionManageCommon.ts'
import PermissionManageAddAndEditDrawer
  from '@views/system-manage/permission-manage/PermissionManageAddAndEditDrawer.tsx'

export default function PermissionManage() {
  const tableObject = useBaseTable<IPermission>({
    fetchOptionFn: () => ({
      url: 'getPermissionList',
      mockProd: true,
    }),
    columns: [
      {
        title: '权限名称',
        key: 'name',
        dataIndex: 'name',
        width: 260,
        align: 'left',
      },
      {
        title: '权限描述',
        key: 'description',
        dataIndex: 'description',
        minWidth: 200,
      },
      {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        width: 160,
      },
      {
        title: '更新时间',
        key: 'lastChangeTime',
        dataIndex: 'lastChangeTime',
        width: 160,
      },
      {
        key: 'operator',
        dataIndex: 'operator',
        title: '操作',
        width: 100,
        fixed: 'right',
        render: (_value, row: IPermission) => (
          <div className={'w-full flex items-center'}>
            <Button
              color={'primary'}
              variant={'text'}
              onClick={() => clickSingleEditButton(row)}
            >
              编辑
            </Button>
            <Button
              color={'red'}
              variant={'text'}
              onClick={() => clickSingleDeleteButton(row)}
            >
              删除
            </Button>
          </div>
        ),
      },
    ],
  })
  const {
    tableRef,
  }= tableObject
  // 点击查询按钮
  const clickSearch = () => {
    tableObject.resetParams()
  }

  // 新增和编辑
  const [isAddOrEdit, setIsAddOrEdit, _resetIsAddOrEdit] = useResetState((): TypeAddOrEdit => 'add')
  const addOrEditDialogObject = useFeedback({
    okHook: () => {
      tableObject.doFetch()
    },
  })
  const clickBatchAdd = () => {
    tableObject.setSelectType('batch')
    setIsAddOrEdit('add')
    addOrEditDialogObject.setIsShow(true)
  }
  const clickSingleEditButton = (row: IPermission) => {
    tableObject.setSelectType('single')
    tableObject.setSelectItem(row)
    setIsAddOrEdit('edit')
    addOrEditDialogObject.setIsShow(true)
  }

  // 删除
  const deleteDialogObject = useFeedback()
  const clickSingleDeleteButton = (row: IPermission) => {
    tableObject.setSelectType('single')
    tableObject.setSelectItem(row)
    deleteDialogObject.setIsShow(true)
  }
  const fetchDeleteObject = useBaseFetch({
    fetchOptionFn: () => ({
      url: 'permission/delete',
      mockProd: true,
      data: {
        name: tableObject.selectItem.name,
      },
    }),
    transformResponseDataFn: () => {
      successMessage('删除成功')
      tableObject.setParams({
        ...tableObject.params,
        pageNum: 1,
      })
    },
  })

  return (
    <div className={'hpj w-full grow rounded bg-white p-4 flex flex-col gap-y-4'}>
      {/*标题*/}
      <span className="text-text-title font-medium text-base">权限管理</span>
      {/* form表单 */}
      <div className={'rounded bg-[#f6f7fc] p-4 flex flex-col'}>
        {/* 下 */}
        <div className={'ml-[120px] flex items-center gap-x-4'}>
          <Button
            type={'primary'}
            icon={<SearchOutlined/>}
            onClick={clickSearch}
          >查询</Button>
        </div>
      </div>
      {/*操作行*/}
      <div className="flex items-center gap-x-4">
        <Button
          type={'primary'}
          onClick={clickBatchAdd}
        >
          新增
        </Button>
      </div>
      {/* 表格 */}
      <Table
        ref={tableRef}
        rowKey={'index'}
        columns={tableObject.columns}
        dataSource={tableObject.list}
        pagination={{
          current: tableObject.params.pageNum,
          pageSize: tableObject.params.pageSize,
          size: 'default',
          total: tableObject.total,
          pageSizeOptions: tableObject.pageSizeOptions,
          showQuickJumper: true,
          showSizeChanger: true,
          showTitle: true,
          showTotal: (total) => `共 ${total} 项`,
          onChange: tableObject.changePagination,
        }}
        tableLayout={'fixed'}
        loading={tableObject.isFetching}
        scroll={{
          x: 'max-content',
        }}
      />
      <PromptDialog
        dialogObject={deleteDialogObject}
        width={500}
        title={'删除用户'}
        textList={
          tableObject.selectType === 'single'
            ? ['确定删除', {text: tableObject.selectItem?.name, color: 'primary'}, '吗?']
            : ['确定批量删除', {text: tableObject.selectItemList?.length, color: 'primary'}, '个账号吗?']
        }
        okButton={{
          text: '确定删除',
          fetchText: '删除中',
          type: 'danger',
        }}
        fetchObject={fetchDeleteObject}
      />
      <Drawer
        title={isAddOrEdit === 'add' ? '新增' : '编辑'}
        open={addOrEditDialogObject.isShow}
        onClose={addOrEditDialogObject.onCancel}
        rootClassName={'hpj'}
        size={500}
        destroyOnHidden={true}
      >
        <PermissionManageAddAndEditDrawer
          item={tableObject.selectItem}
          isAddOrEdit={isAddOrEdit}
          onOk={addOrEditDialogObject.onOk}
          onCancel={addOrEditDialogObject.onCancel}
        />
      </Drawer>
    </div>
  )
}
