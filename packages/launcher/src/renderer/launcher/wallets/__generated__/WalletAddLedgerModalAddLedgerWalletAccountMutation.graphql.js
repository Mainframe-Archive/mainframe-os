/**
 * @flow
 * @relayHash d0c196ee30e9f5d3a6c9ac15c30a3b8d
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type WalletsView_wallets$ref = any;
export type AddLedgerWalletAccountInput = {
  index: number,
  name: string,
  clientMutationId?: ?string,
};
export type WalletAddLedgerModalAddLedgerWalletAccountMutationVariables = {|
  input: AddLedgerWalletAccountInput
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
) {
  addLedgerWalletAccount(input: $input) {
    viewer {
      wallets {
        ...WalletsView_wallets
      }
      id
    }
  }
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
      accounts {
        name
        address
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
  "text": "mutation WalletAddLedgerModalAddLedgerWalletAccountMutation(\n  $input: AddLedgerWalletAccountInput!\n) {\n  addLedgerWalletAccount(input: $input) {\n    viewer {\n      wallets {\n        ...WalletsView_wallets\n      }\n      id\n    }\n  }\n}\n\nfragment WalletsView_wallets on WalletsQuery {\n  ethWallets {\n    hd {\n      localID\n      accounts {\n        name\n        address\n      }\n      id\n    }\n    ledger {\n      localID\n      accounts {\n        name\n        address\n      }\n      id\n    }\n  }\n}\n",
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
                    "args": null
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
(node/*: any*/).hash = 'e43edfcbb21ba9c62f0b0006ca0b58c8';
module.exports = node;
