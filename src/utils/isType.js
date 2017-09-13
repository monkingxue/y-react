/**
 * Created by xueyingchen.
 */

export default isType = (variable, typeInfo) => {
  const infoT = what(typeInfo)

  if (infoT !== 'array') {
    if (infoT === 'string')
      return what(variable) === typeInfo

    throw new TypeError()
  }

  return typeInfo.some(info => what(v) === variable)
}

function what (v) {
  if (v === null) return 'null'
  if (v !== Object(v)) return typeof v
  return ({}).toString.call(v).slice(8, -1).toLowerCase()
}
