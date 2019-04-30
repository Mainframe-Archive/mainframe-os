/**
 * @flow
 * @relayHash 5bf33dbdfaf58c9d5f001e48111dd5af
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type WalletsView_user$ref = any;
export type AddLedgerWalletAccountsInput = {
  indexes?: ?$ReadOnlyArray<?number>,
  name: string,
  userID?: ?string,
  clientMutationId?: ?string,
};
export type WalletAddLedgerModalAddLedgerWalletAccountsMutationVariables = {|
  input: AddLedgerWalletAccountsInput
|};
export type WalletAddLedgerModalAddLedgerWalletAccountsMutationResponse = {|
  +addLedgerWalletAccounts: ?{|
    +addresses: ?$ReadOnlyArray<?string>,
    +viewer: {|
      +$fragmentRefs: WalletsView_user$ref
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
) {
  addLedgerWalletAccounts(input: $input) {
    addresses
    viewer {
      ...WalletsView_user
      id
    }
  }
}

fragment WalletsView_user on User {
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
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "AddLedgerWalletAccountsInput!",
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
  v3
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "WalletAddLedgerModalAddLedgerWalletAccountsMutation",
  "id": null,
  "text": "mutation WalletAddLedgerModalAddLedgerWalletAccountsMutation(\n  $input: AddLedgerWalletAccountsInput!\n) {\n  addLedgerWalletAccounts(input: $input) {\n    addresses\n    viewer {\n      ...WalletsView_user\n      id\n    }\n  }\n}\n\nfragment WalletsView_user on User {\n  ethWallets {\n    hd {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n    ledger {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "WalletAddLedgerModalAddLedgerWalletAccountsMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addLedgerWalletAccounts",
        "storageKey": null,
        "args": v1,
        "concreteType": "AddLedgerWalletAccountsPayload",
        "plural": false,
        "selections": [
          v2,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "User",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "WalletsView_user",
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
    "name": "WalletAddLedgerModalAddLedgerWalletAccountsMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addLedgerWalletAccounts",
        "storageKey": null,
        "args": v1,
        "concreteType": "AddLedgerWalletAccountsPayload",
        "plural": false,
        "selections": [
          v2,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "User",
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
                    "selections": v4
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "ledger",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "EthLedgerWallet",
                    "plural": true,
                    "selections": v4
                  }
                ]
              },
              v3
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '37b6ad3dbcab24e4acd524dd98abcca1';
module.exports = node;
