import {type IEntity} from '@views/interfaceCommon.ts'

// 角色信息
export interface IRole extends IEntity {
  // 名称,唯一标识
  name: string,
  // 权限信息
  permissionList: string[],
}
