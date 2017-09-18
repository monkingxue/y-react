/**
 * Created by xueyingchen.
 */
export default class VNode {
  /**
   * VNode 的构造函数
   * @param {String} nodeName
   * @param {Object} attributes
   * @param {Array} children
   * @param {String} key
   */
  constructor (nodeName, attributes, children, key) {
    this.nodeName = nodeName
    this.attributes = attributes
    this.children = children
    this.key = key
  }
}


