// @flow

export type SwarmEvent = {
  type: string,
  utc_timestamp: number,
  payload?: Object,
}

export const createEvent = (
  type: string,
  payload?: Object = {},
): SwarmEvent => ({
  type,
  payload,
  utc_timestamp: Date.now(),
})
