/**
 * @flow
 * @relayHash 08bcfe6d632d896e3cd6d9dfc92b1121
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type WalletsView_wallets$ref = any;
export type AddLedgerWalletAccountsInput = {|
  indexes?: ?$ReadOnlyArray<?number>,
  name: string,
  userID?: ?string,
  clientMutationId?: ?string,
|};
export type WalletAddLedgerModalAddLedgerWalletAccountsMutationVariables = {|
  input: AddLedgerWalletAccountsInput,
  userID: string,
|};
export type WalletAddLedgerModalAddLedgerWalletAccountsMutationResponse = {|
  +addLedgerWalletAccounts: ?{|
    +addresses: ?$ReadOnlyArray<?string>,
    +viewer: {|
      +wallets: {|
        +$fragmentRefs: WalletsView_wallets$ref
      |}
    |},
  |}
|};
export type WalletAddLedgerModalAddLedgerWalletAccountsMutation = {|
  variables: WalletAddLedgerModalAddLedgerWalletAccountsMutationVariables,
  response: WalletAddLedgerModalAddLedgerWalletAccountsMutationResponse,
|};
*/


/*
mutation WalletAddLedgerModalAddLedgerWalletAccountsMutation(
  $input: AddLedgerWalletAccountsInput!
  $userID: String!
) {
  addLedgerWalletAccounts(input: $input) {
    addresses
    viewer {
      wallets {
        ...WalletsView_wallets_3iqrP
      }
      id
    }
  }
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
    "name": "input",
    "type": "AddLedgerWalletAccountsInput!",
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
    "type": "AddLedgerWalletAccountsInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "addresses",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = [
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
  (v3/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "WalletAddLedgerModalAddLedgerWalletAccountsMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addLedgerWalletAccounts",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "AddLedgerWalletAccountsPayload",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
    "name": "WalletAddLedgerModalAddLedgerWalletAccountsMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addLedgerWalletAccounts",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "AddLedgerWalletAccountsPayload",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
                        "selections": (v4/*: any*/)
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "ledger",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "EthLedgerWallet",
                        "plural": true,
                        "selections": (v4/*: any*/)
                      }
                    ]
                  }
                ]
              },
              (v3/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "WalletAddLedgerModalAddLedgerWalletAccountsMutation",
    "id": null,
    "text": "mutation WalletAddLedgerModalAddLedgerWalletAccountsMutation(\n  $input: AddLedgerWalletAccountsInput!\n  $userID: String!\n) {\n  addLedgerWalletAccounts(input: $input) {\n    addresses\n    viewer {\n      wallets {\n        ...WalletsView_wallets_3iqrP\n      }\n      id\n    }\n  }\n}\n\nfragment WalletsView_wallets_3iqrP on Wallets {\n  ethWallets(userID: $userID) {\n    hd {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n    ledger {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '6aa469bb1cc0401c1c6beb4e4883b304';
module.exports = node;
