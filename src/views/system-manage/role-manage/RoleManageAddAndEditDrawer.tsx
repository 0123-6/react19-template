import type {IRole} from '@views/system-manage/role-manage/roleManageCommon.ts'
import type {TypeAddOrEdit} from '@/components/base-table/useBaseTable.ts'
import {useSelect} from '@/components/base-form/useSelect.ts'
import {useBaseForm} from '@/components/base-form/useBaseForm.ts'
import {useBaseFetch} from '@/util/hooks/useBaseFetch.ts'
import {successMessage} from '@/util/message.ts'
import BaseDrawer from '@/components/base-drawer/BaseDrawer.tsx'
import BaseTitle from '@/components/base-drawer/BaseTitle.tsx'
import {Form, Tree} from 'antd'
import BaseFormItemList from '@/components/base-form/BaseFormItemList.tsx'
import {useResetState} from '@/util/hooks/useResetState.ts'

interface IProps {
  onOk: () => void,
  onCancel: () => void,
  item: IRole,
  isAddOrEdit: TypeAddOrEdit,
}

export default function RoleManageAddAndEditDrawer(props: IProps) {
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
        type: 'input',
        disabled: props.isAddOrEdit === 'edit',
        rules: [
          {
            required: true,
            message: '角色名称不能为空',
          },
        ],
      },
      {
        label: '简介',
        prop: 'description',
        type: 'textarea',
        maxLength: 300,
        minRows: 4,
      },
    ],
    initialValues: props.isAddOrEdit === 'add'
      ? undefined
      : {
        name: props.item?.name,
        description: props.item?.description,
      },
  })
  const [selectPermissionList, setSelectPermissionList, _resetSelectPermissionList] = useResetState((): any[] => props.item?.permissionList ?? [])
  const onCheckChange = (list: any[]) => {
    setSelectPermissionList(list)
  }
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
      url: 'role/add',
      mockProd: true,
      data: {
        ...formObject.form.getFieldsValue(true),
        permissionList: selectPermissionList,
      },
    }),
    transformResponseDataFn: () => {
      successMessage('新增角色成功')
      allPermissionListSelectObject.doFetch()
      props.onOk()
    },
  })
  const fetchUpdate = useBaseFetch({
    fetchOptionFn: () => ({
      url: 'role/update',
      mockProd: true,
      data: {
        ...formObject.form.getFieldsValue(true),
        permissionList: selectPermissionList,
      },
    }),
    transformResponseDataFn: () => {
      successMessage('更新角色成功')
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
      <BaseTitle title={'角色信息'}/>
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
      <div className={'w-full flex'}>
        <span className="w-[90px] pr-3 text-right text-sm text-text-title">权限信息</span>
        {
          allPermissionListSelectObject.data.length && (
            <Tree
              checkable
              treeData={allPermissionListSelectObject.data}
              autoExpandParent
              defaultExpandAll
              checkStrictly
              checkedKeys={selectPermissionList}
              onCheck={(e: { checked: any[], halfChecked: any[],})=>onCheckChange(e.checked)}
            />
          )
        }
      </div>
    </BaseDrawer>
  )
}
