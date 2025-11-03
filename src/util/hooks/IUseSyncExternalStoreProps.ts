export interface IUseSyncExternalStoreProps {
  subscribe: (sub: () => void) => () => void,
  getSnapshot: () => any,
  [key: string]: any,
}
