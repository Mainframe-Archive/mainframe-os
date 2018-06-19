// @flow

export const mapObject = <V, T>(mapper: (input: V) => T) => (
  obj: { [string]: V } = {},
): $ObjMap<{ [string]: V }, mapper> => {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = mapper(obj[key])
    return acc
  }, {})
}
