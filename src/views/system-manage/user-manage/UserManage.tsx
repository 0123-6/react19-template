import {useSelect} from '@/components/base-form/useSelect.ts'
import {Button, Drawer, Form, Switch, Table} from 'antd'
import {ReloadOutlined, SearchOutlined} from '@ant-design/icons'
import {useSyncExternalStore} from 'react'
import {
  type IUserInfo,
  onlineSelectObject,
  sexList,
  sexListToMap,
  userStatusList,
} from '@views/system-manage/user-manage/userManageCommon.ts'
import dayjs from 'dayjs'
import {useBaseFetch} from '@/util/hooks/useBaseFetch.ts'
import {useResetState} from '@/util/hooks/useResetState.ts'
import PromptDialog from '@/components/base-dialog/PromptDialog.tsx'
import {successMessage, warningMessage} from '@/util/message.ts'
import {useFeedback} from '@/components/base-dialog/useFeedback.ts'
import {userStore} from '@/store'
import UserManageAddOrEditDrawer from '@views/system-manage/user-manage/UserManageAddOrEditDrawer.tsx'
import {
  type TypeAddOrEdit,
  useBaseTable,
} from '@/components/base-table/useBaseTable.ts'
import {useBaseForm} from '@/components/base-form/useBaseForm.ts'
import BaseFormItemList from '@/components/base-form/BaseFormItemList.tsx'

export default function UserManage() {
  const userInfo = useSyncExternalStore(userStore.subscribe, userStore.getSnapshot)
  // 获取账号列表
  const getUserAccountListSelectObject = useSelect({
    fetchOptionFn: () => ({
      url: 'user/getAccountList',
      mockProd: true,
    }),
  })
  const formObject = useBaseForm({
    list: [
      {
        label: '账号',
        prop: 'account',
        type: 'select',
        list: getUserAccountListSelectObject?.data,
        multiple: true,
      },
      {
        label: '昵称',
        prop: 'nickname',
        type: 'input',
      },
      {
        label: '性别',
        prop: 'sex',
        type: 'select',
        list: sexList,
        multiple: true,
      },
      {
        label: '手机号',
        prop: 'phone',
        type: 'input',
      },
      {
        label: '状态',
        prop: 'status',
        type: 'select',
        list: userStatusList,
        multiple: true,
      },
      {
        label: '是否在线',
        prop: 'isOnline',
        type: 'select',
        list: onlineSelectObject,
        multiple: true,
      },
      {
        label: '简介',
        prop: 'description',
        type: 'input',
      },
      {
        label: '创建时间',
        prop: '创建时间',
        type: 'daterange',
        rules: [
          {
            required: true,
            message: '创建时间不能为空',
          },
        ],
      },
    ],
    initialValues: {
      '创建时间': [
        dayjs().subtract(1, 'year'),
        dayjs(),
      ],
    },
  })

  const tableObject = useBaseTable({
    formObject: formObject.form,
    fetchOptionFn: () => ({
      url: 'user/getUserList',
      mockProd: true,
      data: {
        ...formObject.form.getFieldsValue(true),
        '创建时间': undefined,
        createTimeBegin: formObject.form.getFieldValue('创建时间')?.[0]?.format('YYYY-MM-DD'),
        createTimeEnd: formObject.form.getFieldValue('创建时间')?.[1]?.format('YYYY-MM-DD'),
      },
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
        key: 'account',
        dataIndex: 'account',
        title: '账号',
        width: 150,
        fixed: 'left',
      },
      {
        key: 'nickname',
        dataIndex: 'nickname',
        title: '昵称',
        width: 150,
        render: value => <span className={'w-full line-clamp-3'}>{value}</span>,
      },
      {
        key: 'sex',
        dataIndex: 'sex',
        title: '性别',
        width: 150,
        render: value => sexListToMap[value],
      },
      {
        key: 'phone',
        dataIndex: 'phone',
        title: '手机号',
        width: 200,
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: '状态',
        width: 150,
        render: (value, row) => (value === 'normal' || value === 'disabled')
          && <Switch
            checked={value === 'normal'}
            onChange={() => clickSingleChangeStatusButton(row)}
          />,
      },
      {
        key: 'isOnline',
        dataIndex: 'isOnline',
        title: '是否在线',
        width: 150,
        render: (value, row) => (value === true || value === false)
          && <Switch
            checked={value}
            disabled={!value}
            onChange={() => clickSingleChangeIsOnlineButton(row)}
          />,
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
        key: 'lastActiveTime',
        dataIndex: 'lastActiveTime',
        title: '最新活跃时间',
        width: 160,
      },
      {
        key: 'operator',
        dataIndex: 'operator',
        title: '操作',
        width: 100,
        fixed: 'right',
        render: (_value, row: IUserInfo) => (
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
              disabled={row.account === userInfo.account}
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
    formObject.form.setFieldValue('创建时间', [
      dayjs().subtract(1, 'year'),
      dayjs(),
    ])
    tableObject.resetParams()
  }

  // 新增和编辑
  const [isAddOrEdit, setIsAddOrEdit, _resetIsAddOrEdit] = useResetState((): TypeAddOrEdit => 'add')
  const addOrEditDialogObject = useFeedback({
    okHook: () => {
      getUserAccountListSelectObject.doFetch()
      tableObject.doFetch()
    },
  })

  const clickBatchAdd = () => {
    tableObject.setSelectType('batch')
    setIsAddOrEdit('add')
    addOrEditDialogObject.setIsShow(true)
  }
  const clickSingleEditButton = (row: IUserInfo) => {
    tableObject.setSelectType('single')
    tableObject.setSelectItem(row)
    setIsAddOrEdit('edit')
    addOrEditDialogObject.setIsShow(true)
  }

  // 删除
  const deleteDialogObject = useFeedback()
  const clickSingleDeleteButton = (row: IUserInfo) => {
    tableObject.setSelectType('single')
    tableObject.setSelectItem(row)
    deleteDialogObject.setIsShow(true)
  }
  const clickBatchDelete = () => {
    tableObject.setSelectType('batch')
    deleteDialogObject.setIsShow(true)
  }
  const fetchDeleteUserObject = useBaseFetch({
    fetchOptionFn: () => ({
      url: 'user/deleteUser',
      mockProd: true,
      data: {
        accountList: tableObject.selectType === 'single'
          ? [tableObject.selectItem.account]
          : tableObject.selectItemList.map(item => item.account),
      },
    }),
    transformResponseDataFn: () => {
      successMessage('删除成功')
      formObject.form.setFieldValue('account', undefined)
      tableObject.setParams({
        ...tableObject.params,
        pageNum: 1,
      })
      getUserAccountListSelectObject.doFetch()
    },
  })

  // 导入
  const clickBatchImport = () => {
    warningMessage('功能未上线,敬请期待')
  }

  // 导出
  const clickBatchExport = () => {
    warningMessage('功能未上线,敬请期待')
  }

  // 改变状态
  const changeStatusDialogObject = useFeedback()
  const clickSingleChangeStatusButton = (row: IUserInfo) => {
    tableObject.setSelectType('single')
    tableObject.setSelectItem(row)
    changeStatusDialogObject.setIsShow(true)
  }
  const fetchChangeStatusObject = useBaseFetch({
    fetchOptionFn: () => ({
      url: 'user/editUser',
      mockProd: true,
      data: {
        ...tableObject.selectItem,
        status: tableObject.selectItem.status === 'normal' ? 'disabled' : 'normal',
      },
    }),
    transformResponseDataFn: () => {
      successMessage(`${tableObject.selectItem.status === 'normal' ? '停用' : '启用'}账号成功`)

      const newList = tableObject.list.map((item) => ({
        ...item,
        status:  tableObject.selectItem.account !== item.account
          ? item.status
          : item.status === 'normal' ? 'disabled' : 'normal',
      }))
      tableObject.setList(newList)
    },
  })

  // 改变其它账号在线状态
  const changeAccountIsOnlineObject = useFeedback()
  const clickSingleChangeIsOnlineButton = (row: IUserInfo) => {
    tableObject.setSelectType('single')
    tableObject.setSelectItem(row)
    changeAccountIsOnlineObject.setIsShow(true)
  }
  const fetchChangeIsOnlineObject = useBaseFetch({
    fetchOptionFn: () => ({
      url: 'user/logout',
      mockProd: true,
      data: {
        accountList: [tableObject.selectItem.account],
      },
    }),
    transformResponseDataFn: () => {
      successMessage('下线成功')
      const newList = tableObject.list.map((item) => ({
        ...item,
        isOnline:  tableObject.selectItem.account !== item.account
          ? item.isOnline
          : false,
      }))
      tableObject.setList(newList)
    },
  })

  return (
    <div className={'hpj w-full grow rounded bg-white p-4 flex flex-col gap-y-4'}>
      {/*标题*/}
      <span className="text-text-title font-medium text-base">用户管理</span>
      {/* form表单 */}
      <div className={'rounded bg-[#f6f7fc] p-4 flex flex-col'}>
        {/* 上 */}
        <Form className="w-full grid grid-cols-4 gap-x-2"
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
          disabled={!(
            tableObject.selectItemList?.length
            && tableObject.selectItemList.every(item => item.account !== userInfo?.account)
          )}
          onClick={clickBatchDelete}
        >
          批量删除
        </Button>
        <Button
          type={'primary'}
          onClick={clickBatchImport}
        >
          批量导入
        </Button>
        {/*:disabled="tableObject.data.total === 0"*/}
        <Button
          onClick={clickBatchExport}
        >
          批量导出
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
          y: 300,
        }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: tableObject.selectItemKeyList,
          onChange: tableObject.onSelectionChange,
        }}
      />
      <PromptDialog
        dialogObject={changeStatusDialogObject}
        width={500}
        title={`${tableObject.selectItem?.status === 'normal' ? '停用' : '启用'}账号`}
        textList={[
          '确定',
          tableObject.selectItem?.status === 'normal' ? '停用' : '启用',
          {
            text: tableObject.selectItem?.account,
            color: 'primary',
          },
          '账号吗?',
        ]}
        okButton={{
          text: tableObject.selectItem?.status === 'normal' ? '停用' : '启用',
          fetchText: tableObject.selectItem?.status === 'normal' ? '停用中' : '启用中',
        }}
        fetchObject={fetchChangeStatusObject}
      />
      <PromptDialog
        dialogObject={changeAccountIsOnlineObject}
        width={500}
        title={'下线账号'}
        textList={[
          '确定下线',
          {
            text: tableObject.selectItem?.account,
            color: 'primary',
          },
          '账号吗?',
        ]}
        okButton={{
          text: '下线',
          fetchText: '下线中',
        }}
        fetchObject={fetchChangeIsOnlineObject}
      />
      <PromptDialog
        dialogObject={deleteDialogObject}
        width={500}
        title={'删除用户'}
        textList={
          tableObject.selectType === 'single'
            ? ['确定删除', {text: tableObject.selectItem?.account, color: 'primary'}, '吗?']
            : ['确定批量删除', {text: tableObject.selectItemList?.length, color: 'primary'}, '个账号吗?']
        }
        okButton={{
          text: '确定删除',
          fetchText: '删除中',
          type: 'danger',
        }}
        fetchObject={fetchDeleteUserObject}
      />
      <Drawer
        title={isAddOrEdit === 'add' ? '新增' : '编辑'}
        open={addOrEditDialogObject.isShow}
        onClose={addOrEditDialogObject.onCancel}
        rootClassName={'hpj'}
        size={500}
        destroyOnHidden={true}
      >
        <UserManageAddOrEditDrawer
          item={tableObject.selectItem}
          isAddOrEdit={isAddOrEdit}
          onOk={addOrEditDialogObject.onOk}
          onCancel={addOrEditDialogObject.onCancel}
        />
      </Drawer>
    </div>
  )
}
