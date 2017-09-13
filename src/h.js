/**
 * Created by xueyingchen.
 */
import VNode from './vnode'
import isType from './utils/isType'

export default function h (nodeName, attributes, children) {
  const postChildren = []
  let lastSimpleType = false, simpleType = false

  for (let child of children) {
    if (isType(child, ['null', 'boolean'])) {
      child = ''
    }

    if (isType(child, ['string', 'number'])) {
      child += String(child)
      simpleType = true
    } else if (isType(child, 'function')) {
      simpleType = false
    }

    if (simpleType && lastSimpleType) {
      children[children.length - 1] += child
    } else {
      children.push(child)
    }

    lastSimpleType = simpleType
  }

  return new VNode(
    nodeName,
    attributes,
    postChildren,
    attributes && attributes.key
  )
}
