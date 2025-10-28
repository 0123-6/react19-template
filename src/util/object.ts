// 判断是否为“普通对象”的运行时辅助
export const isPlainObject = (value: unknown)
  : boolean => {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}