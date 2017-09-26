/**
 * Created by xueyingchen.
 */
import isType, { isNull } from './utils/isType'
import { setAccessor, createNode } from './dom'
import { buildComponentFromVNode } from './component'
import { SYNC_RENDER, FORCE_RENDER } from './constants'

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

  if (isType(nodeName, 'function')) {
    out = buildComponentFromVNode(dom, vnode)
  }

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
    children.forEach((child, idx) => {
      const ret = diff(child, dom && dom.children[idx], out)
      out.appendChild(ret)
    })
  }

  if (parent)
    return parent.appendChild(out)

  return out
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

export function renderComponent (component, renderMode) {
  if (component._disable) return

  let props = component.props,
    state = component.state,
    context = component.context,
    previousProps = component.prevProps || props,
    previousState = component.prevState || state,
    previousContext = component.prevContext || context,
    isUpdate = component.base,
    nextBase = component.nextBase,
    initialBase = isUpdate || nextBase,
    initialChildComponent = component._component,
    skip = false,
    rendered, inst, cbase

  // if updating
  if (isUpdate) {
    component.props = previousProps
    component.state = previousState
    component.context = previousContext
    if (renderMode !== FORCE_RENDER
      && component.shouldComponentUpdate
      && component.shouldComponentUpdate(props, state, context) === false) {
      skip = true
    } else if (component.componentWillUpdate) {
      component.componentWillUpdate(props, state, context)
    }
    component.props = props
    component.state = state
    component.context = context
  }

  component.prevProps = component.prevState = component.prevContext = component.nextBase = null
  component._dirty = false

  if (!skip) {
    rendered = component.render(props, state, context)

    if (component.getChildContext) {
      context = extend({}, context, component.getChildContext())
    }

    let childComponent = rendered && rendered.nodeName,
      toUnmount, base

    if (typeof childComponent === 'function') {
      // set up high order component link

      let childProps = getNodeProps(rendered)
      inst = initialChildComponent

      if (inst && inst.constructor === childComponent && childProps.key === inst.__key) {
        setComponentProps(inst, childProps, SYNC_RENDER, context, false)
      } else {
        toUnmount = inst

        component._component = inst = createComponent(childComponent, childProps, context)
        inst.nextBase = inst.nextBase || nextBase
        inst._parentComponent = component
        setComponentProps(inst, childProps, NO_RENDER, context, false)
        renderComponent(inst, SYNC_RENDER)
      }

      base = inst.base
    } else {
      cbase = initialBase

      // destroy high order component link
      toUnmount = initialChildComponent
      if (toUnmount) {
        cbase = component._component = null
      }

      if (initialBase || renderMode === SYNC_RENDER) {
        if (cbase) cbase._component = null
        base = diff(rendered, cbase, initialBase && initialBase.parentNode)
      }
    }

    if (initialBase && base !== initialBase && inst !== initialChildComponent) {
      let baseParent = initialBase.parentNode
      if (baseParent && base !== baseParent) {
        baseParent.replaceChild(base, initialBase)

        if (!toUnmount) {
          initialBase._component = null
          recollectNodeTree(initialBase, false)
        }
      }
    }

    component.base = base
  }

  if (!skip) {

    if (component.componentDidUpdate) {
      component.componentDidUpdate(previousProps, previousState, previousContext)
    }
  }

  if (isNull(component._renderCallbacks)) {
    while (component._renderCallbacks.length)
      component._renderCallbacks.pop().call(component)
  }
}