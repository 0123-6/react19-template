import {type IEntity} from '@views/interfaceCommon.ts'

// 权限相关
export interface IPermission extends IEntity {
  // 唯一的名字
  name: string,
  // 父节点,不存在代表顶层结构
  parent?: string,
  children?: IPermission[],
}
