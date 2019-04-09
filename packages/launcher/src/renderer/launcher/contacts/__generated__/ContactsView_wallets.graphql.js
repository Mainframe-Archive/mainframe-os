/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type ContactsView_wallets$ref: FragmentReference;
export type ContactsView_wallets = {|
  +ethWallets: {|
    +hd: $ReadOnlyArray<{|
      +name: ?string,
      +localID: string,
      +accounts: ?$ReadOnlyArray<?{|
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
      +accounts: ?$ReadOnlyArray<?{|
        +address: string,
        +balances: {|
          +eth: string,
          +mft: string,
        |},
      |}>,
    |}>,
  |},
  +$refType: ContactsView_wallets$ref,
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
  "name": "ContactsView_wallets",
  "type": "Wallets",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "userID",
      "type": "String!",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "ethWallets",
      "storageKey": null,
      "args": [
        {
          "kind": "Variable",
          "name": "userID",
          "variableName": "userID",
          "type": "String!"
        }
      ],
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
(node/*: any*/).hash = '2d187c3c397369731758e0ab1cb5e2d5';
module.exports = node;
