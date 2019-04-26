/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type Launcher_identities$ref: FragmentReference;
export type Launcher_identities = {|
  +ownUsers: $ReadOnlyArray<{|
    +defaultEthAddress: ?string,
    +localID: string,
    +feedHash: ?string,
    +profile: {|
      +name: string,
      +ethAddress: ?string,
    |},
    +wallets: {|
      +hd: $ReadOnlyArray<{|
        +localID: string
      |}>,
      +ledger: $ReadOnlyArray<{|
        +localID: string
      |}>,
    |},
  |}>,
  +$refType: Launcher_identities$ref,
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
v1 = [
  v0
];
return {
  "kind": "Fragment",
  "name": "Launcher_identities",
  "type": "Identities",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "ownUsers",
      "storageKey": null,
      "args": null,
      "concreteType": "OwnUserIdentity",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "defaultEthAddress",
          "args": null,
          "storageKey": null
        },
        v0,
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "feedHash",
          "args": null,
          "storageKey": null
        },
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
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "wallets",
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
              "selections": v1
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "ledger",
              "storageKey": null,
              "args": null,
              "concreteType": "EthLedgerWallet",
              "plural": true,
              "selections": v1
            }
          ]
        }
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = '9e57560542bfc36c2f6ca9a9fbd50678';
module.exports = node;
