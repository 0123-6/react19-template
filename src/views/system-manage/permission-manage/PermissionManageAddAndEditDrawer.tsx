import type {TypeAddOrEdit} from '@/components/base-table/useBaseTable.ts'
import type {IPermission} from '@views/system-manage/permission-manage/permissionManageCommon.ts'
import {useSelect} from '@/components/base-form/useSelect.ts'
import {useBaseForm} from '@/components/base-form/useBaseForm.ts'
import {useBaseFetch} from '@/util/hooks/useBaseFetch.ts'
import {successMessage} from '@/util/message.ts'
import BaseDrawer from '@/components/base-drawer/BaseDrawer.tsx'
import BaseTitle from '@/components/base-drawer/BaseTitle.tsx'
import {Form} from 'antd'
import BaseFormItemList from '@/components/base-form/BaseFormItemList.tsx'

interface IProps {
  item: IPermission,
  isAddOrEdit: TypeAddOrEdit,
  onOk: () => void,
  onCancel: () => void,
}

export default function PermissionManageAddAndEditDrawer(props: IProps) {
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
        label: '权限名称',
        prop: 'name',
        type: 'input',
        list: undefined,
        multiple: undefined,
        rules: [
          {
            required: true,
            message: '权限名称不能为空',
          },
        ],
        disabled: props.isAddOrEdit === 'edit',
        hidden: undefined,
      },
      {
        label: '上级权限',
        prop: 'parent',
        type: 'tree-select',
        list: allPermissionListSelectObject.data,
        multiple: false,
        disabled: undefined,
        hidden: undefined,
      },
      {
        label: '权限描述',
        prop: 'description',
        type: 'textarea',
        list: undefined,
        multiple: undefined,
        disabled: undefined,
        hidden: undefined,
        minRows: 3,
        maxLength: 300,
      },
    ],
    initialValues: props.isAddOrEdit === 'add'
      ? undefined
      : {
        name: props.item?.name,
        parent: props.item?.parent,
        description: props.item?.description,
      },
  })
  const clickOk = async () => {
    if (!await formObject.validate()) {
      return
    }

    await formObject.form.validateFields()
    if (props.isAddOrEdit === 'add') {
      fetchAdd.doFetch()
    } else {
      fetchUpdate.doFetch()
    }
  }
  const clickCancel = () => {
    props.onCancel()
  }

  const fetchAdd = useBaseFetch({
    fetchOptionFn: () => ({
      url: 'permission/add',
      mockProd: true,
      data: formObject.form.getFieldsValue(true),
    }),
    transformResponseDataFn: () => {
      successMessage('新增权限成功')
      allPermissionListSelectObject.doFetch()
      props.onOk()
    },
  })
  const fetchUpdate = useBaseFetch({
    fetchOptionFn: () => ({
      url: 'permission/update',
      mockProd: true,
      data: formObject.form.getFieldsValue(true),
    }),
    transformResponseDataFn: () => {
      successMessage('更新权限成功')
      allPermissionListSelectObject.doFetch()
      props.onOk()
    },
  })

  return (
    <BaseDrawer
      cancelButton={{
        onClick: clickCancel,
      }}
      okButton={{
        text: props.isAddOrEdit === 'add' ? '新增' : '更新',
        onClick: clickOk,
        loading: props.isAddOrEdit === 'add' ? fetchAdd.isFetching : fetchUpdate.isFetching,
      }}
    >
      <BaseTitle title={'权限信息'}/>
      <Form className="w-full grid grid-cols-1 gap-y-1"
            autoComplete="off"
            name={formObject.id}
            form={formObject.form}
            size={'large'}
            style={{
              marginTop: '16px',
            }}
            labelCol={{
              style: {
                width: '90px',
              },
            }}
            scrollToFirstError={true}
            labelAlign={'right'}
            initialValues={formObject.initialValues}
      >
        <BaseFormItemList list={formObject.list}/>
      </Form>
    </BaseDrawer>
  )
}
