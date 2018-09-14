// @flow

import MainframeSDK from '@mainframe/sdk'
import { decodeHex, encodeHex, type hex } from '@mainframe/utils-hex'
import type { Observable } from 'rxjs'
import { map, filter } from 'rxjs/operators'

import { createEvent, type SwarmEvent } from './SwarmEvent'

export const PROTOCOL = 'swarmchat/v1'

// TODO: move to erebos-api-pss
export type PssEvent = {
  Key: hex,
  Asym: boolean,
  Msg: hex,
}

export type IncomingProtocolEvent = {
  key: hex,
  data: SwarmEvent,
}

export type ChatMessagePayload = {
  text: string,
}

export type IncomingChatMessage = {
  type: 'chat_message',
  key: hex,
  utc_timestamp: number,
  payload: ChatMessagePayload,
}

export type IncomingChatEvent = IncomingChatMessage

export type ContactRequestPayload = {
  topic: hex,
  overlay_address?: hex,
  username?: string,
}

export type IncomingContactRequest = {
  type: 'contact_request',
  key: hex,
  payload: ContactRequestPayload,
}

export type ContactResponsePayload = {
  contact: boolean,
  overlay_address?: hex,
  username?: string,
}

export type IncomingContactResponse = {
  type: 'contact_response',
  key: hex,
  payload: ContactResponsePayload,
}

export type IncomingContactEvent =
  | IncomingContactRequest
  | IncomingContactResponse

export type IncomingEvent = IncomingChatEvent | IncomingContactEvent

export type OwnInfo = {
  publicKey: hex,
  overlayAddress: hex,
}

const createRandomString = (): string => {
  return Math.random()
    .toString(36)
    .slice(2)
}

export const createPssMessage = (type: string, payload?: Object): hex => {
  return encodeHex(JSON.stringify(createEvent(type, payload)))
}

export const decodePssEvent = (data: PssEvent): IncomingProtocolEvent => ({
  key: data.Key,
  data: JSON.parse(decodeHex(data.Msg)),
})

export default class SwarmChat {
  _sdk: MainframeSDK
  _ownInfo: ?OwnInfo

  constructor() {
    this._sdk = new MainframeSDK()
  }

  get hasOwnInfo(): boolean {
    return this._ownInfo != null
  }

  async getOwnInfo(): Promise<OwnInfo> {
    if (this._ownInfo == null) {
      const [publicKey, overlayAddress] = await Promise.all([
        this._sdk.pss.getPublicKey(),
        this._sdk.pss.baseAddr(),
      ])
      this._ownInfo = { publicKey, overlayAddress }
    }
    return this._ownInfo
  }

  async createChatSubscription(
    contactKey: hex,
    topic: hex,
  ): Promise<Observable<IncomingChatEvent>> {
    const [sub] = await Promise.all([
      this._sdk.pss.createTopicSubscription(topic),
      this._sdk.pss.setPeerPublicKey(contactKey, topic),
    ])
    return sub.pipe(
      map(decodePssEvent),
      filter((event: IncomingProtocolEvent) => {
        return event.data.type === 'chat_message' && event.data.payload != null
      }),
      map(
        // $FlowFixMe: polymorphic type
        (event: IncomingProtocolEvent): IncomingChatEvent => ({
          key: event.key,
          type: event.data.type,
          utc_timestamp: event.data.utc_timestamp,
          payload: event.data.payload,
        }),
      ),
    )
  }

  async createContactSubscription(): Promise<Observable<IncomingContactEvent>> {
    const { publicKey } = await this.getOwnInfo()
    const topic = await this._sdk.pss.stringToTopic(publicKey)
    const sub = await this._sdk.pss.createTopicSubscription(topic)
    return sub.pipe(
      map(decodePssEvent),
      filter((event: IncomingProtocolEvent) => {
        return (
          (event.data.type === 'contact_request' &&
            event.data.payload != null &&
            event.data.payload.topic != null) ||
          event.data.type === 'contact_response'
        )
      }),
      map(
        // $FlowFixMe: polymorphic type
        (event: IncomingProtocolEvent): IncomingContactEvent => ({
          key: event.key,
          type: event.data.type,
          payload: event.data.payload,
        }),
      ),
    )
  }

  async sendChatMessage(
    key: hex,
    topic: hex,
    payload: ChatMessagePayload,
  ): Promise<void> {
    const message = createPssMessage('chat_message', payload)
    await this._sdk.pss.sendAsym(key, topic, message)
  }

  async sendContactRequest(
    key: hex,
    data?: { username?: string, message?: string } = {},
  ): Promise<hex> {
    const [ownInfo, contactTopic, sharedTopic] = await Promise.all([
      this.getOwnInfo(),
      this._sdk.pss.stringToTopic(key),
      this._sdk.pss.stringToTopic(createRandomString()),
    ])
    await this._sdk.pss.setPeerPublicKey(key, contactTopic)
    const message = createPssMessage('contact_request', {
      ...data,
      topic: sharedTopic,
      overlay_address: ownInfo.overlayAddress,
    })
    await this._sdk.pss.sendAsym(key, contactTopic, message)
    return sharedTopic
  }

  async sendContactResponse(
    key: hex,
    accept: boolean,
    data?: { username?: string } = {},
  ): Promise<void> {
    let payload
    if (accept) {
      const ownInfo = await this.getOwnInfo()
      payload = {
        contact: true,
        overlay_address: ownInfo.overlayAddress,
        username: data.username,
      }
    } else {
      payload = { contact: false }
    }
    const topic = await this._sdk.pss.stringToTopic(key)
    await this._sdk.pss.setPeerPublicKey(key, topic)
    const message = createPssMessage('contact_response', payload)
    await this._sdk.pss.sendAsym(key, topic, message)
  }
}
