/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type WalletsScreen_user$ref: FragmentReference;
export type WalletsScreen_user = {|
  +profile: {|
    +ethAddress: ?string
  |},
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
  +$refType: WalletsScreen_user$ref,
|};
*/


const node/*: ConcreteFragment*/ = (function(){
var v0 = [
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
    "name": "localID",
    "args": null,
    "storageKey": null
  },
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
  "name": "WalletsScreen_user",
  "type": "User",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "profile",
      "storageKey": null,
      "args": null,
      "concreteType": "NamedProfile",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "ethAddress",
          "args": null,
          "storageKey": null
        }
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
          "selections": v0
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "ledger",
          "storageKey": null,
          "args": null,
          "concreteType": "EthLedgerWallet",
          "plural": true,
          "selections": v0
        }
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = 'a47e909f26e8dd47a8be7c9565b07076';
module.exports = node;
