/**
 * @flow
 * @relayHash 4d07bda1318a50edd01388b8a6402143
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type WalletsView_wallets$ref = any;
export type AddLedgerWalletAccountInput = {
  index: number,
  name: string,
  userID?: ?string,
  clientMutationId?: ?string,
};
export type WalletAddLedgerModalAddLedgerWalletAccountMutationVariables = {|
  input: AddLedgerWalletAccountInput,
  userID: string,
|};
export type WalletAddLedgerModalAddLedgerWalletAccountMutationResponse = {|
  +addLedgerWalletAccount: ?{|
    +viewer: {|
      +wallets: {|
        +$fragmentRefs: WalletsView_wallets$ref
      |}
    |}
  |}
|};
export type WalletAddLedgerModalAddLedgerWalletAccountMutation = {|
  variables: WalletAddLedgerModalAddLedgerWalletAccountMutationVariables,
  response: WalletAddLedgerModalAddLedgerWalletAccountMutationResponse,
|};
*/


/*
mutation WalletAddLedgerModalAddLedgerWalletAccountMutation(
  $input: AddLedgerWalletAccountInput!
  $userID: String!
) {
  addLedgerWalletAccount(input: $input) {
    viewer {
      wallets {
        ...WalletsView_wallets_3iqrP
      }
      id
    }
  }
}

fragment WalletsView_wallets_3iqrP on WalletsQuery {
  ethWallets(userID: $userID) {
    hd {
      localID
      accounts {
        name
        address
        balances {
          eth
          mft
        }
      }
      id
    }
    ledger {
      localID
      accounts {
        name
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
    "name": "input",
    "type": "AddLedgerWalletAccountInput!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "userID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "AddLedgerWalletAccountInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = [
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
    "concreteType": "NamedWalletAccountType",
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
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "balances",
        "storageKey": null,
        "args": null,
        "concreteType": "WalletBalancesType",
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
  v2
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "WalletAddLedgerModalAddLedgerWalletAccountMutation",
  "id": null,
  "text": "mutation WalletAddLedgerModalAddLedgerWalletAccountMutation(\n  $input: AddLedgerWalletAccountInput!\n  $userID: String!\n) {\n  addLedgerWalletAccount(input: $input) {\n    viewer {\n      wallets {\n        ...WalletsView_wallets_3iqrP\n      }\n      id\n    }\n  }\n}\n\nfragment WalletsView_wallets_3iqrP on WalletsQuery {\n  ethWallets(userID: $userID) {\n    hd {\n      localID\n      accounts {\n        name\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n    ledger {\n      localID\n      accounts {\n        name\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "WalletAddLedgerModalAddLedgerWalletAccountMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addLedgerWalletAccount",
        "storageKey": null,
        "args": v1,
        "concreteType": "AddLedgerWalletAccountPayload",
        "plural": false,
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
                    "name": "WalletsView_wallets",
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
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "WalletAddLedgerModalAddLedgerWalletAccountMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addLedgerWalletAccount",
        "storageKey": null,
        "args": v1,
        "concreteType": "AddLedgerWalletAccountPayload",
        "plural": false,
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
                        "selections": v3
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "ledger",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "EthLedgerWallet",
                        "plural": true,
                        "selections": v3
                      }
                    ]
                  }
                ]
              },
              v2
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '2795fecf3d4353c2fdec562bcb9b8ea0';
module.exports = node;
