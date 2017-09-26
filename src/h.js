/**
 * Created by xueyingchen.
 */
import VNode from './vnode'
import isType from './utils/isType'

export default function h (nodeName, attributes, ...children) {
  const postChildren = []
  let lastSimpleType = false, simpleType = false

  if (!isType(children, 'null') && children.length > 0) {

    for (let child of children) {
      if (isType(child, ['null', 'boolean'])) {
        child = ''
      }

      if (isType(child, ['string', 'number'])) {
        child = String(child)
        simpleType = true
      } else if (isType(child, 'function')) {
        simpleType = false
      }

      if (simpleType && lastSimpleType) {
        postChildren[postChildren.length - 1] += child
      } else {
        postChildren.push(child)
      }

      lastSimpleType = simpleType
      simpleType = false
    }
  }

  return new VNode(
    nodeName,
    attributes,
    postChildren,
    attributes && attributes.key
  )
}
