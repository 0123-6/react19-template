type TreeNode<T> = T & { children?: TreeNode<T>[] }

interface ArrayToTreeOptions<T> {
  // 标识当前项唯一性的字段（如 name, id）
  idKey?: keyof T
  // 表示父节点的字段名（如 parentId, parent）
  parentKey?: keyof T
  // 根节点的父值（如 null, undefined, '' 等）
  rootParentValue?: unknown
}

// 将扁平数组转为树结构
export function arrayToTree<T extends Record<string, any>>(
  items: T[],
  options: ArrayToTreeOptions<T> = {},
): TreeNode<T>[] {
  const {
    idKey = 'name',
    parentKey = 'parent',
    rootParentValue = undefined,
  } = options

  const nodeMap = new Map<any, TreeNode<T>>()
  const tree: TreeNode<T>[] = []

  // 初始化每一项为 TreeNode 并建立索引表
  for (const item of items) {
    nodeMap.set(item[idKey], item as TreeNode<T>)
  }

  // 第二遍建立 parent -> children 关系
  for (const item of items) {
    const node = nodeMap.get(item[idKey])
    const parentId = item[parentKey]

    if (parentId === rootParentValue || !nodeMap.has(parentId)) {
      tree.push(node)
    } else {
      const parentNode = nodeMap.get(parentId)
      if (!parentNode.children) parentNode.children = []
      parentNode.children.push(node)
    }
  }

  return tree
}