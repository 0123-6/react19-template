export interface IUseSyncExternalStoreProps<T> {
  subscribe: (sub: () => void) => () => void,
  getSnapshot: () => T,
  set: (value: T) => void,
}
