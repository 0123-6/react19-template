import {useSelect} from '@/components/base-form/useSelect.ts'
import {useBaseForm} from '@/components/base-form/useBaseForm.ts'
import {type TypeAddOrEdit, useBaseTable} from '@/components/base-table/useBaseTable.ts'
import {Button, Drawer, Form, Table} from 'antd'
import BaseFormItemList from '@/components/base-form/BaseFormItemList.tsx'
import {ReloadOutlined, SearchOutlined} from '@ant-design/icons'
import {useResetState} from '@/util/hooks/useResetState.ts'
import {useFeedback} from '@/components/base-dialog/useFeedback.ts'
import {useBaseFetch} from '@/util/hooks/useBaseFetch.ts'
import {successMessage} from '@/util/message.ts'
import PromptDialog from '@/components/base-dialog/PromptDialog.tsx'
import RoleManageAddAndEditDrawer from '@views/system-manage/role-manage/RoleManageAddAndEditDrawer.tsx'
import type {IRole} from '@views/system-manage/role-manage/roleManageCommon.ts'

export default function RoleManage() {
  // 获取全量角色列表
  const allRoleListSelectObject = useSelect({
    config: {
      labelName: 'name',
      valueName: 'name',
    },
    fetchOptionFn: () => ({
      url: 'role/getAllRoleList',
      mockProd: true,
    }),
  })
  // 获取全量权限列表
  const allPermissionListSelectObject = useSelect({
    config: {
      labelName: 'name',
      valueName: 'name',
    },
    fetchOptionFn: () => ({
      url: 'getAllPermissionList',
      mockProd: true,
    }),
  })

  const formObject = useBaseForm({
    list: [
      {
        label: '角色名称',
        prop: 'name',
        type: 'select',
        list: allRoleListSelectObject.data,
        multiple: true,
      },
      {
        label: '权限名称',
        prop: 'permissionList',
        type: 'tree-select',
        list: allPermissionListSelectObject.data,
        multiple: true,
      },
      {
        label: '简介',
        prop: 'description',
        type: 'input',
      },
    ],
  })

  const tableObject = useBaseTable<IRole>({
    formObject: formObject.form,
    fetchOptionFn: () => ({
      url: 'role/query',
      mockProd: true,
      data: formObject.form.getFieldsValue(true),
    }),
    columns: [
      {
        key: 'index',
        dataIndex: 'index',
        title: '序号',
        fixed: 'left',
        width: 70,
      },
      {
        key: 'name',
        dataIndex: 'name',
        title: '角色名称',
        width: 150,
        fixed: 'left',
      },
      {
        key: 'description',
        dataIndex: 'description',
        title: '简介',
        width: 200,
        render: value => <span className={'w-full line-clamp-2'}>{value}</span>,
      },
      {
        key: 'createTime',
        dataIndex: 'createTime',
        title: '创建时间',
        width: 160,
      },
      {
        key: 'lastChangeTime',
        dataIndex: 'lastChangeTime',
        title: '最后修改时间',
        width: 160,
      },
      {
        key: 'operator',
        dataIndex: 'operator',
        title: '操作',
        width: 100,
        fixed: 'right',
        render: (_value, row: IRole) => (
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
  const clickSearch = async () => {
    if (!await formObject.validate()) {
      return
    }

    tableObject.resetParams()
  }
  const clickReset = () => {
    formObject.form.resetFields()
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
  const clickSingleEditButton = (row: IRole) => {
    tableObject.setSelectType('single')
    tableObject.setSelectItem(row)
    setIsAddOrEdit('edit')
    addOrEditDialogObject.setIsShow(true)
  }

  // 删除
  const deleteDialogObject = useFeedback()
  const clickSingleDeleteButton = (row: IRole) => {
    tableObject.setSelectType('single')
    tableObject.setSelectItem(row)
    deleteDialogObject.setIsShow(true)
  }
  const clickBatchDelete = () => {
    tableObject.setSelectType('batch')
    deleteDialogObject.setIsShow(true)
  }
  const fetchDeleteRoleObject = useBaseFetch({
    fetchOptionFn: () => ({
      url: 'role/delete',
      mockProd: true,
      data: {
        roleList: tableObject.selectType === 'single'
          ? [tableObject.selectItem.name]
          : tableObject.selectItemList.map(item => item.name),
      },
    }),
    transformResponseDataFn: () => {
      successMessage('删除成功')
      formObject.form.setFieldValue('name', undefined)
      tableObject.setParams({
        ...tableObject.params,
        pageNum: 1,
      })
      allRoleListSelectObject.doFetch()
    },
  })

  return (
    <div className={'hpj w-full grow rounded bg-white p-4 flex flex-col gap-y-4'}>
      {/*标题*/}
      <span className="text-text-title font-medium text-base">角色管理</span>
      {/* form表单 */}
      <div className={'rounded bg-[#f6f7fc] p-4 flex flex-col'}>
        {/* 上 */}
        <Form className="w-full grid grid-cols-3 gap-x-2"
              autoComplete="off"
              name={formObject.id}
              form={formObject.form}
              size={'large'}
              labelCol={{
                style: {
                  width: '120px',
                },
              }}
              onValuesChange={clickSearch}
              initialValues={formObject.initialValues}
        >
          <BaseFormItemList list={formObject.list}/>
        </Form>
        {/* 下 */}
        <div className={'ml-[120px] flex items-center gap-x-4'}>
          <Button
            type={'primary'}
            icon={<SearchOutlined/>}
            onClick={clickSearch}
          >查询</Button>
          <Button
            icon={<ReloadOutlined/>}
            onClick={clickReset}
          >重置</Button>
          <span>展开/折叠</span>
          {/*<base-form-fold :form-object="formObject" />*/}
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
        <Button
          danger
          disabled={!(tableObject.selectItemList?.length)}
          onClick={clickBatchDelete}
        >
          批量删除
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
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: tableObject.selectItemKeyList,
          onChange: tableObject.onSelectionChange,
        }}
      />
      <PromptDialog
        dialogObject={deleteDialogObject}
        width={500}
        title={'删除角色'}
        textList={
          tableObject.selectType === 'single'
            ? ['确定删除', {text: tableObject.selectItem?.name, color: 'primary'}, '吗?']
            : ['确定批量删除', {text: tableObject.selectItemList?.length, color: 'primary'}, '个角色吗?']
        }
        okButton={{
          text: '确定删除',
          fetchText: '删除中',
          type: 'danger',
        }}
        fetchObject={fetchDeleteRoleObject}
      />
      <Drawer
        title={isAddOrEdit === 'add' ? '新增' : '编辑'}
        open={addOrEditDialogObject.isShow}
        onClose={addOrEditDialogObject.onCancel}
        rootClassName={'hpj'}
        size={500}
        destroyOnHidden={true}
      >
        <RoleManageAddAndEditDrawer
          onOk={addOrEditDialogObject.onOk}
          onCancel={addOrEditDialogObject.onCancel}
          item={tableObject.selectItem}
          isAddOrEdit={isAddOrEdit}
        />
      </Drawer>
    </div>
  )
}
