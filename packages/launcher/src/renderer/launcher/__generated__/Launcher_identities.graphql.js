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
  +ownUsers: ?$ReadOnlyArray<?{|
    +defaultEthAddress: ?string,
    +localID: string,
    +wallets: {|
      +hd: ?$ReadOnlyArray<?{|
        +localID: string
      |}>,
      +ledger: ?$ReadOnlyArray<?{|
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
  "type": "IdentitiesQuery",
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
(node/*: any*/).hash = '58670fd4e8ce47c7290062199c93aeaa';
module.exports = node;
