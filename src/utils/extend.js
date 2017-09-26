/**
 * Created by xueyingchen.
 */

import { isNull } from './isType'

export default (target, ...args) => {
  if (isNull(target)) {
    throw new TypeError('Cannot convert undefined or null to object')
  }

  args.forEach(source => {
    if (!isNull(source)) {
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }
  })

  return target
}