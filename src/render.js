/**
 * Created by xueyingchen.
 */
import isType from './utils/isType'
import { setAccessor, createNode } from './dom'

export default function render (vnode, parent, merge) {
  diff(vnode, merge, parent)
}

function diff (vnode, dom, parent) {

  let out = dom

  if (isType(vnode, ['string', 'number'])) {
    if (dom && dom.splitText !== undefined && dom.parentNode) {
      if (dom.nodeValue !== vnode) {
        dom.nodeValue = vnode
      }
    }
    else {
      out = document.createTextNode(vnode)
      if (dom) {
        if (dom.parentNode) dom.parentNode.replaceChild(out, dom)
      }
    }

    return out
  }

  const {nodeName, attributes, children} = vnode

  if (isType(nodeName, 'string')) {
    if (!dom) {
      out = createNode(nodeName)

      if (dom) {
        while (dom.firstChild)
          out.appendChild(dom.firstChild)

        if (dom.parentNode)
          dom.parentNode.replaceChild(out, dom)
      }
    }

    const ofc = out.firstChild
    const vfc = children[0]

    if (children.length === 1 && isType(vfc, 'string') && !isType(ofc, 'null')
      && !isType(ofc.splitText, 'undefined') && isType(ofc.nextSibling, 'null')) {
      if (ofc.nodeValue !== vfc) {
        ofc.nodeValue = vfc
      }
    }

    diffAttributes(out, attributes)

    if (children.length > 0) {
      children.forEach(child => {
        const ret = diff(child, dom, out)
        out.appendChild(ret)
      })
    }

    return parent.appendChild(out)
  }
}

/** 给真实 DOM 加上属性（diff 功能尚未实现）
 *  @param {Element} dom    Element with attributes to diff `attrs` against
 *  @param {Object} attrs    The desired end-state key-value attribute pairs
 */
function diffAttributes (dom, attrs) {
  for (const name in attrs) {
    if (name !== 'children' && name !== 'innerHTML') {
      setAccessor(dom, name, attrs[name])
    }
  }
}