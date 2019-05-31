/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
export type ContactConnectionState = "CONNECTED" | "DECLINED" | "RECEIVED" | "SENDING_BLOCKCHAIN" | "SENDING_FEED" | "SENT_BLOCKCHAIN" | "SENT_FEED" | "%future added value";
export type ContactStakeState = "RECLAIMED" | "RECLAIMING" | "SEIZED" | "STAKED" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type InviteContactModal_contact$ref: FragmentReference;
export type InviteContactModal_contact = {|
  +localID: string,
  +peerID: string,
  +publicID: string,
  +connectionState: ContactConnectionState,
  +invite: ?{|
    +inviteTX: ?string,
    +stake: {|
      +reclaimedTX: ?string,
      +amount: ?string,
      +state: ContactStakeState,
    |},
  |},
  +profile: {|
    +name: ?string,
    +ethAddress: ?string,
  |},
  +$refType: InviteContactModal_contact$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "InviteContactModal_contact",
  "type": "Contact",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "localID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "peerID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "publicID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "connectionState",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "invite",
      "storageKey": null,
      "args": null,
      "concreteType": "ContactInviteData",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "inviteTX",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "stake",
          "storageKey": null,
          "args": null,
          "concreteType": "ContactInviteStake",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "reclaimedTX",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "amount",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "state",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "profile",
      "storageKey": null,
      "args": null,
      "concreteType": "GenericProfile",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "ethAddress",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '664acbd0911aeea85d5f2174a2eb9610';
module.exports = node;
