/**
 * Created by xueyingchen.
 */
export default class VNode {
  constructor (nodeName, attributes, children, key) {
    this.nodeName = nodeName
    this.attributes = attributes
    this.children = children
    this.key = key
  }
}


