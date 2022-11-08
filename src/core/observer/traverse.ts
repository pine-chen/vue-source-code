import { _Set as Set, isObject, isArray } from '../util/index'
import type { SimpleSet } from '../util/index'
import VNode from '../vdom/vnode'

const seenObjects = new Set()

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 * val 如果不是 Array Object 或者已经被冻结的则直接返回
 */
export function traverse(val: any) {
  _traverse(val, seenObjects)
  seenObjects.clear()
  return val
}

function _traverse(val: any, seen: SimpleSet) {
  let i, keys
  const isA = isArray(val)
  if (
    (!isA && !isObject(val)) ||
    Object.isFrozen(val) ||
    val instanceof VNode
  ) {
    return
  }
  // 通过 dep.id 确保不会重复收集依赖
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    // 对象取key，递归子值触发收集依赖
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
