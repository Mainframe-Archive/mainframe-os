/**
 * @flow
 * @relayHash cea2796a2e568f29142994c3996f4b1d
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type WalletsScreen_wallets$ref = any;
export type WalletsScreenQueryVariables = {||};
export type WalletsScreenQueryResponse = {|
  +viewer: {|
    +wallets: {|
      +$fragmentRefs: WalletsScreen_wallets$ref
    |}
  |}
|};
export type WalletsScreenQuery = {|
  variables: WalletsScreenQueryVariables,
  response: WalletsScreenQueryResponse,
|};
*/


/*
query WalletsScreenQuery {
  viewer {
    wallets {
      ...WalletsScreen_wallets
    }
    id
  }
}

fragment WalletsScreen_wallets on WalletsQuery {
  ...WalletsView_wallets
}

fragment WalletsView_wallets on WalletsQuery {
  ethWallets {
    hd {
      localID
      accounts {
        name
        address
      }
      id
    }
    ledger {
      localID
      accounts
      id
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
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
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "WalletsScreenQuery",
  "id": null,
  "text": "query WalletsScreenQuery {\n  viewer {\n    wallets {\n      ...WalletsScreen_wallets\n    }\n    id\n  }\n}\n\nfragment WalletsScreen_wallets on WalletsQuery {\n  ...WalletsView_wallets\n}\n\nfragment WalletsView_wallets on WalletsQuery {\n  ethWallets {\n    hd {\n      localID\n      accounts {\n        name\n        address\n      }\n      id\n    }\n    ledger {\n      localID\n      accounts\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "WalletsScreenQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "wallets",
            "storageKey": null,
            "args": null,
            "concreteType": "WalletsQuery",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "WalletsScreen_wallets",
                "args": null
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "WalletsScreenQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "wallets",
            "storageKey": null,
            "args": null,
            "concreteType": "WalletsQuery",
            "plural": false,
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
                      },
                      v1
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
                      },
                      v1
                    ]
                  }
                ]
              }
            ]
          },
          v1
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '1a1f91aaade03eac2745af8c9d5ff097';
module.exports = node;
