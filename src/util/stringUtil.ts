// 驼峰转下划线
export function camelToSnake(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2') // 匹配大小写边界，添加下划线
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2') // 处理连续大写字母分隔
    .toLowerCase() // 转换为小写
}

// 下划线转驼峰
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-zA-Z])/g, (_, letter) => letter.toUpperCase())
}