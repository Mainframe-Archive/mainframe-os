// @flow

export const mapObject = <T, U>(mapper: (input: T) => U) => (
  obj: ?{ [string]: T },
): { [string]: U } => {
  return obj == null
    ? {}
    : Object.keys(obj).reduce((acc, key) => {
        // $FlowFixMe: obj[key] shouldn't be possibly null
        acc[key] = mapper(obj[key])
        return acc
      }, {})
}
