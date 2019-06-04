/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
export type ConnectionState = "CONNECTED" | "DECLINED" | "RECEIVED" | "SENDING_BLOCKCHAIN" | "SENDING_FEED" | "SENT_BLOCKCHAIN" | "SENT_FEED" | "%future added value";
export type StakeState = "RECLAIMED" | "RECLAIMING" | "SEIZED" | "STAKED" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type ContactsScreen_user$ref: FragmentReference;
export type ContactsScreen_user = {|
  +localID: string,
  +publicID: string,
  +profile: {|
    +name: string,
    +ethAddress: ?string,
  |},
  +contactRequests: $ReadOnlyArray<{|
    +localID: string,
    +publicID: string,
    +localPeerID: string,
    +profile: {|
      +name: ?string,
      +ethAddress: ?string,
    |},
    +connectionState: ConnectionState,
    +ethNetwork: string,
    +stakeAmount: string,
    +receivedAddress: string,
  |}>,
  +contacts: $ReadOnlyArray<{|
    +localID: string,
    +peerID: string,
    +publicID: string,
    +connectionState: ConnectionState,
    +invite: ?{|
      +ethNetwork: ?string,
      +inviteTX: ?string,
      +stakeState: StakeState,
      +stakeAmount: string,
      +reclaimedStakeTX: ?string,
    |},
    +profile: {|
      +name: ?string,
      +ethAddress: ?string,
    |},
  |}>,
  +$refType: ContactsScreen_user$ref,
|};
*/


const node/*: ConcreteFragment*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "publicID",
  "args": null,
  "storageKey": null
},
v2 = [
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
],
v3 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "profile",
  "storageKey": null,
  "args": null,
  "concreteType": "GenericProfile",
  "plural": false,
  "selections": v2
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "connectionState",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "ethNetwork",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "stakeAmount",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "ContactsScreen_user",
  "type": "User",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    v0,
    v1,
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "profile",
      "storageKey": null,
      "args": null,
      "concreteType": "NamedProfile",
      "plural": false,
      "selections": v2
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "contactRequests",
      "storageKey": null,
      "args": null,
      "concreteType": "ContactRequest",
      "plural": true,
      "selections": [
        v0,
        v1,
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "localPeerID",
          "args": null,
          "storageKey": null
        },
        v3,
        v4,
        v5,
        v6,
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "receivedAddress",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "contacts",
      "storageKey": null,
      "args": null,
      "concreteType": "Contact",
      "plural": true,
      "selections": [
        v0,
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "peerID",
          "args": null,
          "storageKey": null
        },
        v1,
        v4,
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "invite",
          "storageKey": null,
          "args": null,
          "concreteType": "ContactInviteData",
          "plural": false,
          "selections": [
            v5,
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "inviteTX",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "stakeState",
              "args": null,
              "storageKey": null
            },
            v6,
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "reclaimedStakeTX",
              "args": null,
              "storageKey": null
            }
          ]
        },
        v3
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = 'c56bdb5da788a6f06b2c08fd2e5041eb';
module.exports = node;
