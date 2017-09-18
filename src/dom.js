/**
 * Created by xueyingchen.
 */
import isType from './utils/isType'

export function setAccessor (node, name, value = '') {

  const isName = attr => name === attr

  if (isName('class') || isName('className')) {
    node.className = value
  } else if (isName('ref')) {
    value && value(node)
  } else if (isName('style')) {
    if (!value || isType(value, 'string')) {
      node.style.cssText = value
    }

    if (value && isType(value, 'object')) {
      for (let i in value) {
        if (value.hasOwnProperty(i)) {
          node.style[i] = isType(value[i], 'number') && value[i] + 'px'
        }
      }
    }
  } else if (isName('dangerouslySetInnerHTML')) {
    if (value)
      node.innerHTML = value.__html || ''
  } else if (name[0] === 'o' && name[1] === 'n') {
    let useCapture = name !== (name = name.replace(/Capture$/, ''))
    name = name.toLowerCase().substring(2)
    if (value) {
      node.addEventListener(name, eventProxy, useCapture)
    } else {
      node.removeEventListener(name, eventProxy, useCapture)
    }
    (node._listeners || (node._listeners = {}))[name] = value
  }
}

/**
 * 构建真实 DOM
 * @param nodeName
 * @return {Element}
 */
export function createNode (nodeName) {
  const node = document.createElement(nodeName)
  node.normalizedNodeName = nodeName
  return node
}

/**
 *
 * @param {Event} e
 * @return {*}
 */
function eventProxy (e) {
  return this._listeners[e.type](e)
}