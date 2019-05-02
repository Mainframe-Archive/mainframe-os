/**
 * @flow
 * @relayHash 10372384878098d84535ce9a33b63a68
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type WalletsScreen_user$ref = any;
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
      +$fragmentRefs: WalletsScreen_user$ref
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
      ...WalletsScreen_user
      id
    }
  }
}

fragment WalletsScreen_user on User {
  defaultEthAddress
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
  "text": "mutation WalletAddLedgerModalAddLedgerWalletAccountsMutation(\n  $input: AddLedgerWalletAccountsInput!\n) {\n  addLedgerWalletAccounts(input: $input) {\n    addresses\n    viewer {\n      ...WalletsScreen_user\n      id\n    }\n  }\n}\n\nfragment WalletsScreen_user on User {\n  defaultEthAddress\n  ethWallets {\n    hd {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n    ledger {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n  }\n}\n",
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
                "name": "WalletsScreen_user",
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
                "kind": "ScalarField",
                "alias": null,
                "name": "defaultEthAddress",
                "args": null,
                "storageKey": null
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
(node/*: any*/).hash = '2aa9edb0d76805b649c25fa60c02c3b0';
module.exports = node;
