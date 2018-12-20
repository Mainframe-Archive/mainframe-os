/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type WalletsView_wallets$ref: FragmentReference;
export type WalletsView_wallets = {|
  +ethWallets: {|
    +hd: ?$ReadOnlyArray<?{|
      +localID: string,
      +accounts: ?$ReadOnlyArray<?{|
        +name: string,
        +address: string,
      |}>,
    |}>,
    +ledger: ?$ReadOnlyArray<?{|
      +localID: string,
      +accounts: ?$ReadOnlyArray<?string>,
    |}>,
  |},
  +$refType: WalletsView_wallets$ref,
|};
*/


const node/*: ConcreteFragment*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "WalletsView_wallets",
  "type": "WalletsQuery",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
          "selections": [
            v0,
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "accounts",
              "storageKey": null,
              "args": null,
              "concreteType": "HDWalletAccountType",
              "plural": true,
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
                  "name": "address",
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
          "name": "ledger",
          "storageKey": null,
          "args": null,
          "concreteType": "EthLedgerWallet",
          "plural": true,
          "selections": [
            v0,
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "accounts",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = '282fd6dcc06f9f8e1d6bac84498ad343';
module.exports = node;
