import {type IUserInfo, sexList, userStatusList} from '@views/system-manage/user-manage/userManageCommon.ts'
import {useSyncExternalStore} from 'react'
import {Form} from 'antd'
import BaseTitle from '@/components/base-drawer/BaseTitle.tsx'
import {successMessage} from '@/util/message.ts'
import {useBaseFetch} from '@/util/hooks/useBaseFetch.ts'
import {isPasswordRegExp, isPhoneRegExp} from '@/util/validator.ts'
import {userStore} from '@/store'
import type {TypeAddOrEdit} from '@/components/base-table/useBaseTable.ts'
import BaseFormItemList from '@/components/base-form/BaseFormItemList.tsx'
import {useSelect} from '@/components/base-form/useSelect.ts'
import {useBaseForm} from '@/components/base-form/useBaseForm.ts'
import BaseDrawer from '@/components/base-drawer/BaseDrawer.tsx'

interface IProps {
  item: IUserInfo,
  isAddOrEdit: TypeAddOrEdit,
  onOk: () => void,
  onCancel: () => void,
}

export default function UserManageAddOrEditDrawer(props: IProps) {
  const userInfo = useSyncExternalStore(userStore.subscribe, userStore.getSnapshot)
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

  const formObject = useBaseForm({
    list: [
      {
        label: '账号',
        prop: 'account',
        type: 'input',
        list: undefined,
        multiple: undefined,
        rules: [
          {
            required: true,
            message: '账号不能为空',
          },
        ],
        hidden: undefined,
        disabled: props.isAddOrEdit === 'edit',
      },
      {
        label: '密码',
        prop: 'password',
        type: 'input-password',
        placeholder: '请输入密码，只能包含数字，字母，下划线，8-16位',
        list: undefined,
        multiple: undefined,
        rules: [
          {
            required: true,
            message: '密码不能为空',
          },
          {
            pattern: isPasswordRegExp,
            message: '只能包含数字，字母，下划线，8-16位',
          },
        ],
        hidden: !(props.isAddOrEdit === 'add'),
        disabled: undefined,
      },
      {
        label: '确认密码',
        prop: 'password2',
        type: 'input-password',
        placeholder: '请再次确认密码，只能包含数字，字母，下划线，8-16位',
        list: undefined,
        multiple: undefined,
        rules: [
          {
            required: true,
            message: '确认密码不能为空',
          },
          {
            pattern: isPasswordRegExp,
            message: '只能包含数字，字母，下划线，8-16位',
          },
          {
            validator: () => {
              const data = formObject.form.getFieldsValue(true)
              if (data.password2 !== data.password) {
                return Promise.reject(new Error('两次密码不一致'))
              } else {
                return Promise.resolve()
              }
            },
          },
        ],
        hidden: !(props.isAddOrEdit === 'add'),
        disabled: undefined,
        dependencies: ['password'],
      },
      {
        label: '角色',
        prop: 'roleList',
        type: 'select',
        list: allRoleListSelectObject.data,
        multiple: true,
        rules: [
          {
            required: true,
            message: '角色不能为空',
          },
        ],
        hidden: undefined,
        disabled: undefined,
      },
      {
        label: '昵称',
        prop: 'nickname',
        type: 'input',
        list: undefined,
        multiple: undefined,
        rules: undefined,
        hidden: undefined,
        disabled: undefined,
      },
      {
        label: '性别',
        prop: 'sex',
        type: 'radio',
        list: sexList,
        multiple: undefined,
        rules: undefined,
        hidden: undefined,
        disabled: undefined,
      },
      {
        label: '手机号码',
        prop: 'phone',
        type: 'input',
        list: undefined,
        multiple: undefined,
        rules: [
          {pattern: isPhoneRegExp, message: '手机格式不正确'},
        ],
        hidden: undefined,
        disabled: undefined,
      },
      {
        label: '状态',
        prop: 'status',
        type: 'radio',
        list: userStatusList,
        multiple: undefined,
        rules: [
          {
            required: true,
            message: '状态不能为空',
          },
        ],
        hidden: undefined,
        // 不允许修改当前用户自己的状态
        disabled: props.isAddOrEdit === 'edit' && props.item?.account === userInfo.account,
      },
      {
        label: '简介',
        prop: 'description',
        type: 'textarea',
        list: undefined,
        multiple: undefined,
        rules: undefined,
        hidden: undefined,
        disabled: undefined,
        maxLength: 300,
        minRows: 4,
      },
    ],
    initialValues: props.isAddOrEdit === 'add'
      ? {
        status: 'normal',
      }
      : {
        account: props.item?.account,
        roleList: props.item?.roleList,
        nickname: props.item?.nickname,
        sex: props.item?.sex,
        phone: props.item?.phone,
        status: props.item?.status,
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
      url: 'user/addUser',
      mockProd: true,
      data: formObject.form.getFieldsValue(true),
    }),
    transformResponseDataFn: () => {
      successMessage('新增用户成功')
      props.onOk()
    },
  })
  const fetchUpdate = useBaseFetch({
    fetchOptionFn: () => ({
      url: 'user/editUser',
      mockProd: true,
      data: formObject.form.getFieldsValue(true),
    }),
    transformResponseDataFn: () => {
      successMessage('更新用户成功')
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
      <BaseTitle title={'用户信息'}/>
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
