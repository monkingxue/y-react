/**
 * Created by xueyingchen.
 */

const isType = (variable, typeInfo) => {
  const kind = what(typeInfo)
  const type = what(variable)

  if (kind !== 'array') {
    if (kind === 'string')
      return type === typeInfo

    throw new TypeError('The typeInfo must be string or array!')
  }

  return typeInfo.some((ti, index) => {
    if (what(ti) !== 'string')
      throw new TypeError(`The ${index} of typeInfo must be string!`)
    return type === ti
  })
}

function what (v) {
  if (v === null) return 'null'
  if (v !== Object(v)) return typeof v
  return ({}).toString.call(v).slice(8, -1).toLowerCase()
}

export const isNull = v => isType(v, ['null', 'undefined'])

export default isType
