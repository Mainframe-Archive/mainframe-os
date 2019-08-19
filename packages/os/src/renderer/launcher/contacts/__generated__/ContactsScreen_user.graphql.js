/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type InviteContactModal_contactInvite$ref = any;
type InviteContactModal_user$ref = any;
export type ContactConnectionState = "CONNECTED" | "DECLINED" | "RECEIVED" | "SENDING_BLOCKCHAIN" | "SENDING_FEED" | "SENT_BLOCKCHAIN" | "SENT_FEED" | "%future added value";
export type ContactStakeState = "RECLAIMED" | "RECLAIMING" | "SEIZED" | "STAKED" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type ContactsScreen_user$ref: FragmentReference;
export type ContactsScreen_user = {|
  +localID: string,
  +publicID: string,
  +profile: {|
    +name: string,
    +ethAddress: ?string,
  |},
  +contactInviteStake: string,
  +contactRequests: $ReadOnlyArray<{|
    +localID: string,
    +publicID: string,
    +peerID: string,
    +profile: {|
      +name: ?string,
      +ethAddress: ?string,
    |},
    +connectionState: ContactConnectionState,
    +ethNetwork: string,
    +stakeAmount: string,
    +receivedAddress: string,
    +senderAddress: string,
  |}>,
  +contacts: $ReadOnlyArray<{|
    +localID: string,
    +peerID: string,
    +publicID: string,
    +connectionState: ContactConnectionState,
    +invite: ?{|
      +ethNetwork: string,
      +fromAddress: string,
      +inviteTX: string,
      +stakeState: ContactStakeState,
      +stakeAmount: string,
      +reclaimedStakeTX: ?string,
      +$fragmentRefs: InviteContactModal_contactInvite$ref,
    |},
    +profile: {|
      +name: ?string,
      +ethAddress: ?string,
    |},
  |}>,
  +ethWallets: {|
    +hd: $ReadOnlyArray<{|
      +name: ?string,
      +localID: string,
      +accounts: $ReadOnlyArray<{|
        +address: string,
        +balances: {|
          +eth: string,
          +mft: string,
        |},
      |}>,
    |}>,
    +ledger: $ReadOnlyArray<{|
      +name: ?string,
      +localID: string,
      +accounts: $ReadOnlyArray<{|
        +address: string,
        +balances: {|
          +eth: string,
          +mft: string,
        |},
      |}>,
    |}>,
  |},
  +$fragmentRefs: InviteContactModal_user$ref,
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
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = [
  v2,
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "ethAddress",
    "args": null,
    "storageKey": null
  }
],
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "peerID",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "profile",
  "storageKey": null,
  "args": null,
  "concreteType": "GenericProfile",
  "plural": false,
  "selections": v3
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "connectionState",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "ethNetwork",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "stakeAmount",
  "args": null,
  "storageKey": null
},
v9 = [
  v2,
  v0,
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "accounts",
    "storageKey": null,
    "args": null,
    "concreteType": "WalletAccount",
    "plural": true,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "address",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "balances",
        "storageKey": null,
        "args": null,
        "concreteType": "WalletBalances",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "eth",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "mft",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Fragment",
  "name": "ContactsScreen_user",
  "type": "User",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "InviteContactModal_user",
      "args": null
    },
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
      "selections": v3
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "contactInviteStake",
      "args": null,
      "storageKey": null
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
        v4,
        v5,
        v6,
        v7,
        v8,
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "receivedAddress",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "senderAddress",
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
        v4,
        v1,
        v6,
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "invite",
          "storageKey": null,
          "args": null,
          "concreteType": "ContactInvite",
          "plural": false,
          "selections": [
            {
              "kind": "FragmentSpread",
              "name": "InviteContactModal_contactInvite",
              "args": null
            },
            v7,
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "fromAddress",
              "args": null,
              "storageKey": null
            },
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
            v8,
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "reclaimedStakeTX",
              "args": null,
              "storageKey": null
            }
          ]
        },
        v5
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "ethWallets",
      "storageKey": null,
      "args": null,
      "concreteType": "EthWallets",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "hd",
          "storageKey": null,
          "args": null,
          "concreteType": "EthHDWallet",
          "plural": true,
          "selections": v9
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "ledger",
          "storageKey": null,
          "args": null,
          "concreteType": "EthLedgerWallet",
          "plural": true,
          "selections": v9
        }
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = 'da37ef917c74a968e3746d3a3d587f5f';
module.exports = node;
