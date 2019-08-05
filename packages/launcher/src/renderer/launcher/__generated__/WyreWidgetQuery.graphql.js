/**
 * @flow
 * @relayHash f6794b2c7e83017e119753ea9e4d51da
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type WyreWidget_user$ref = any;
export type WyreWidgetQueryVariables = {||};
export type WyreWidgetQueryResponse = {|
  +user: {|
    +$fragmentRefs: WyreWidget_user$ref
  |}
|};
export type WyreWidgetQuery = {|
  variables: WyreWidgetQueryVariables,
  response: WyreWidgetQueryResponse,
|};
*/


/*
query WyreWidgetQuery {
  user: viewer {
    ...WyreWidget_user
    id
  }
}

fragment WyreWidget_user on User {
  profile {
    ethAddress
  }
  ethWallets {
    hd {
      name
      localID
      accounts {
        address
        balances {
          eth
          mft
        }
      }
      id
    }
    ledger {
      name
      localID
      accounts {
        address
        balances {
          eth
          mft
        }
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
  },
  v0
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "WyreWidgetQuery",
  "id": null,
  "text": "query WyreWidgetQuery {\n  user: viewer {\n    ...WyreWidget_user\n    id\n  }\n}\n\nfragment WyreWidget_user on User {\n  profile {\n    ethAddress\n  }\n  ethWallets {\n    hd {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n    ledger {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "WyreWidgetQuery",
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
            "name": "WyreWidget_user",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "WyreWidgetQuery",
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
          },
          v0
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '84c512cdc7cd99618552c9061876f1f7';
module.exports = node;
