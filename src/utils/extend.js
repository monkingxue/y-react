/**
 * Created by xueyingchen.
 */

import { eqNull } from './isType'

export default extend = (target, ...args) => {
  if (eqNull(target)) {
    throw new TypeError('Cannot convert undefined or null to object')
  }

  args.forEach(source => {
    if (!eqNull(source)) {
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }
  })

  return target
}