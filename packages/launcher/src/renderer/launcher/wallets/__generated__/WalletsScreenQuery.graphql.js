/**
 * @flow
 * @relayHash 2ed95c104d2dd9533bd1b1229efe3289
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type WalletsScreen_wallets$ref = any;
export type WalletsScreenQueryVariables = {|
  userID: string
|};
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
query WalletsScreenQuery(
  $userID: String!
) {
  viewer {
    wallets {
      ...WalletsScreen_wallets_3iqrP
    }
    id
  }
}

fragment WalletsScreen_wallets_3iqrP on Wallets {
  ...WalletsView_wallets_3iqrP
}

fragment WalletsView_wallets_3iqrP on Wallets {
  ethWallets(userID: $userID) {
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
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "userID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
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
  v1
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "WalletsScreenQuery",
  "id": null,
  "text": "query WalletsScreenQuery(\n  $userID: String!\n) {\n  viewer {\n    wallets {\n      ...WalletsScreen_wallets_3iqrP\n    }\n    id\n  }\n}\n\nfragment WalletsScreen_wallets_3iqrP on Wallets {\n  ...WalletsView_wallets_3iqrP\n}\n\nfragment WalletsView_wallets_3iqrP on Wallets {\n  ethWallets(userID: $userID) {\n    hd {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n    ledger {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "WalletsScreenQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
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
            "concreteType": "Wallets",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "WalletsScreen_wallets",
                "args": [
                  {
                    "kind": "Variable",
                    "name": "userID",
                    "variableName": "userID",
                    "type": null
                  }
                ]
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
    "argumentDefinitions": v0,
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
            "concreteType": "Wallets",
            "plural": false,
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
                    "selections": v2
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "ledger",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "EthLedgerWallet",
                    "plural": true,
                    "selections": v2
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
(node/*: any*/).hash = 'b8adb26af05b46397c86a3c5b867ebec';
module.exports = node;
