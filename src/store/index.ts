import type {IUseSyncExternalStoreProps} from '@/util/hooks/IUseSyncExternalStoreProps.ts'
import type {IUserInfo} from '@views/system-manage/user-manage/userManageCommon.ts'
import {baseFetch} from '@/util/api.ts'

type IProps = IUseSyncExternalStoreProps<IUserInfo | null> & {
  fetch: () => Promise<void>,
}

let userObject: IUserInfo | null = null
const subSet = new Set<() => void>()

export const userStore: IProps = {
  subscribe: sub => {
    subSet.add(sub)

    return () => {
      subSet.delete(sub)
    }
  },
  getSnapshot: () => userObject,
  set: (newUser: IUserInfo | null) => {
    userObject = newUser
    for (const sub of subSet) {
      sub()
    }
  },
  // 获取用户信息
  fetch: async () => {
    // 用户信息已经存在
    if (userStore.getSnapshot()) {
      return
    }

    // 获取用户信息
    const result = await baseFetch({
      url: 'user/getUserInfo',
      mockProd: true,
    })
    if (!result.isOk) {
      return
    }

    userStore.set(result.responseData.data as IUserInfo)
  },
}
