/**
 * Created by xueyingchen.
 */

export default (variable, typeInfo) => {
  const infoT = what(typeInfo)

  if (infoT !== 'array') {
    if (infoT === 'string')
      return what(variable) === typeInfo

    throw new TypeError('Error typeInfo!')
  }

  return typeInfo.some(info => what(variable) === info)
}

function what (v) {
  if (v === null) return 'null'
  if (v !== Object(v)) return typeof v
  return ({}).toString.call(v).slice(8, -1).toLowerCase()
}
