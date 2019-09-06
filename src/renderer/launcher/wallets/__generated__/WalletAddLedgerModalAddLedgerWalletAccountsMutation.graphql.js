/**
 * @flow
 * @relayHash d06f697b2f0c2816e4b1d489daebe3dd
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type WalletsScreen_user$ref = any;
export type AddLedgerWalletAccountsInput = {|
  indexes?: ?$ReadOnlyArray<?number>,
  name: string,
  userID?: ?string,
  setAsDefault?: ?boolean,
  legacyPath?: ?boolean,
  clientMutationId?: ?string,
|};
export type WalletAddLedgerModalAddLedgerWalletAccountsMutationVariables = {|
  input: AddLedgerWalletAccountsInput
|};
export type WalletAddLedgerModalAddLedgerWalletAccountsMutationResponse = {|
  +addLedgerWalletAccounts: ?{|
    +ledgerWallet: ?{|
      +accounts: $ReadOnlyArray<{|
        +address: string
      |}>
    |},
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
    ledgerWallet {
      accounts {
        address
      }
      id
    }
    viewer {
      ...WalletsScreen_user
      id
    }
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
    "variableName": "input"
  }
],
v2 = {
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
  (v2/*: any*/),
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
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "ledgerWallet",
            "storageKey": null,
            "args": null,
            "concreteType": "EthLedgerWallet",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ]
          },
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
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "ledgerWallet",
            "storageKey": null,
            "args": null,
            "concreteType": "EthLedgerWallet",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
            ]
          },
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
    "text": "mutation WalletAddLedgerModalAddLedgerWalletAccountsMutation(\n  $input: AddLedgerWalletAccountsInput!\n) {\n  addLedgerWalletAccounts(input: $input) {\n    ledgerWallet {\n      accounts {\n        address\n      }\n      id\n    }\n    viewer {\n      ...WalletsScreen_user\n      id\n    }\n  }\n}\n\nfragment WalletsScreen_user on User {\n  profile {\n    ethAddress\n  }\n  ethWallets {\n    hd {\n      name\n      localID\n      accounts {\n        address\n      }\n      id\n    }\n    ledger {\n      name\n      localID\n      accounts {\n        address\n      }\n      id\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'aa98428d5f5b0277b31d54085af8a743';
module.exports = node;
