import type {IUseSyncExternalStoreProps} from '@/util/hooks/IUseSyncExternalStoreProps.ts'
import type {IUserInfo} from '@views/system-manage/user-manage/userManageCommon.ts'

let userObject: IUserInfo | null = null
const subSet = new Set<() => void>()

export const userStore: IUseSyncExternalStoreProps<IUserInfo | null> = {
  subscribe: sub => {
    subSet.add(sub)

    return () => {
      subSet.delete(sub)
    }
  },
  getSnapshot: () => userObject,
  set: (newUser: IUserInfo | null) => {
    userObject = newUser
    queueMicrotask(() => {
      for (const sub of subSet) {
        sub()
      }
    })
  },
}
