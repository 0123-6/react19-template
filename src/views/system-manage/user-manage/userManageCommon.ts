import {type ISelectOption} from '@/components/base-form/useElSelect.ts'
import type {IEntity} from '@views/interfaceCommon.ts'

// 用户的信息
export interface IUserInfo extends IEntity {
  // 账号,唯一标识
  account: string,
  // 密码
  password: string,
  // 昵称
  nickname?: string,
  // 性别
  sex?: 'man' | 'woman',
  // 手机号,唯一
  phone?: string,
  // 状态
  status: 'normal' | 'disabled',
  // 最新活跃时间
  lastActiveTime: string,
  // 所属角色
  roleList: string[],
  // 在线状态,动态设置,非用户自身信息
  isOnline?: boolean,
  // 权限,动态设置,只读属性
  readonly permissionList: string[],
}

export const sexList: ISelectOption[] = [
  {
    label: '男',
    value: 'man',
    type: 'primary',
  },
  {
    label: '女',
    value: 'woman',
    type: 'warning',
  },
]

// 用户状态
export const userStatusList: ISelectOption[] = [
  {
    label: '正常',
    value: 'normal',
    type: 'success',
  },
  {
    label: '禁用',
    value: 'disabled',
    type: 'error',
  },
]

// true & false
export const onlineSelectObject: ISelectOption[] = [
  {
    label: '在线',
    value: true,
    type: 'primary',
  },
  {
    label: '不在线',
    value: false,
    type: 'text',
  },
]

