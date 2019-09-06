/**
 * @flow
 * @relayHash 5969a8db23b683a6ca34f485fb5c6daa
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type WalletsScreen_user$ref = any;
export type WalletsScreenQueryVariables = {||};
export type WalletsScreenQueryResponse = {|
  +user: {|
    +$fragmentRefs: WalletsScreen_user$ref
  |}
|};
export type WalletsScreenQuery = {|
  variables: WalletsScreenQueryVariables,
  response: WalletsScreenQueryResponse,
|};
*/


/*
query WalletsScreenQuery {
  user: viewer {
    ...WalletsScreen_user
    id
  }
}

fragment WalletsScreen_user on User {
  profile {
    ethAddress
  }
  ethWallets {
    hd {
      name
      localID
      accounts {
        address
      }
      id
    }
    ledger {
      name
      localID
      accounts {
        address
      }
      id
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = [
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
      }
    ]
  },
  (v0/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "WalletsScreenQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "user",
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "WalletsScreen_user",
            "args": null
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
        "alias": "user",
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
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
                "selections": (v1/*: any*/)
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "ledger",
                "storageKey": null,
                "args": null,
                "concreteType": "EthLedgerWallet",
                "plural": true,
                "selections": (v1/*: any*/)
              }
            ]
          },
          (v0/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "WalletsScreenQuery",
    "id": null,
    "text": "query WalletsScreenQuery {\n  user: viewer {\n    ...WalletsScreen_user\n    id\n  }\n}\n\nfragment WalletsScreen_user on User {\n  profile {\n    ethAddress\n  }\n  ethWallets {\n    hd {\n      name\n      localID\n      accounts {\n        address\n      }\n      id\n    }\n    ledger {\n      name\n      localID\n      accounts {\n        address\n      }\n      id\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'c060d8d1cb888d8e662a7f85253e5a72';
module.exports = node;
