/**
 * Created by xueyingchen.
 */
import extend from './utils/extend'
import isType from './utils/isType'
import defer from './utils/defer'
import h from './h'
import { FORCE_RENDER, SYNC_RENDER, NO_RENDER } from './constants'
import { renderComponent } from './render'
import { getNodeProps } from './dom'

export default class Component {
  constructor (props = {}, context = {}) {
    this._dirty = true
    this.prevState = null
    this.state = {}
    this.props = props
    this.context = context

    this._renderCallbacks = []
  }

  shouldComponentUpdate (nextProps, nextState) {
    return true
  }

  // TODO 增加 like React 的 stack reconcile
  setState (state, callback) {
    const st = this.state
    if (!this.prevState) this.prevState = extend({}, st)
    this.state = extend({}, st, isType(state, 'function') ? state(st, this.props) : state)
    if (callback) this._renderCallbacks.push(callback)
    enqueueRender(this)
  }

  forceUpdate (callback) {
    if (callback) this._renderCallbacks.push(callback)
    renderComponent(this, FORCE_RENDER)
  }

  render (props, state) {
    return h('div', null, props.children)
  }
}

let willRenderedComponents = []

export function enqueueRender (component) {
  if (!component._dirty) {
    component._dirty = true
    willRenderedComponents.push(component)
    defer(reRender)
  }
}

export function reRender () {
  let component, list = willRenderedComponents
  willRenderedComponents = []
  while (component = list.pop()) {
    if (component._dirty)
      renderComponent(component, SYNC_RENDER)
  }
}

export function buildComponentFromVNode (dom, vnode, context) {

  const props = getNodeProps(vnode)
  const component = createComponent(vnode.nodeName, props, context)

  setComponentProps(component, props, SYNC_RENDER, context)
  return component.base
}

export function createComponent (ctor, props, context) {
  let instance = null

  if (ctor.prototype && ctor.prototype.render) {
    instance = new ctor(props, context)
  } else {
    instance = new Component(props, context)
    instance.constructor = ctor
    instance.render = ctor.bind(instance)
  }

  return instance
}

export function setComponentProps (component, props, renderMode, context) {
  if (component._disable) return
  component._disable = true

  if (!component.base) {
    if (component.componentWillMount)
      component.componentWillMount()
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props, context)
  }

  if (context && context !== component.context) {
    if (!component.prevContext)
      component.prevContext = component.context
    component.context = context
  }

  if (!component.prevProps)
    component.prevProps = component.props
  component.props = props

  component._disable = false

  if (renderMode !== NO_RENDER) {
    if (renderMode === SYNC_RENDER || !component.base) {
      renderComponent(component, SYNC_RENDER)
    } else {
      enqueueRender(component)
    }
  }
}