/**
 * @flow
 * @relayHash 25c4010d262d1891e5cae002394247f1
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type WalletsScreen_user$ref = any;
export type SupportedWallets = "ETHEREUM" | "%future added value";
export type ImportHDWalletInput = {
  blockchain: SupportedWallets,
  mnemonic: string,
  name: string,
  clientMutationId?: ?string,
};
export type WalletImportViewImportHDWalletMutationVariables = {|
  input: ImportHDWalletInput
|};
export type WalletImportViewImportHDWalletMutationResponse = {|
  +importHDWallet: ?{|
    +hdWallet: ?{|
      +accounts: $ReadOnlyArray<{|
        +address: string
      |}>,
      +localID: string,
    |},
    +viewer: {|
      +$fragmentRefs: WalletsScreen_user$ref
    |},
  |}
|};
export type WalletImportViewImportHDWalletMutation = {|
  variables: WalletImportViewImportHDWalletMutationVariables,
  response: WalletImportViewImportHDWalletMutationResponse,
|};
*/


/*
mutation WalletImportViewImportHDWalletMutation(
  $input: ImportHDWalletInput!
) {
  importHDWallet(input: $input) {
    hdWallet {
      accounts {
        address
      }
      localID
      id
    }
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
    "type": "ImportHDWalletInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "ImportHDWalletInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "address",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "accounts",
  "storageKey": null,
  "args": null,
  "concreteType": "WalletAccount",
  "plural": true,
  "selections": [
    v2
  ]
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v6 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  },
  v4,
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "accounts",
    "storageKey": null,
    "args": null,
    "concreteType": "WalletAccount",
    "plural": true,
    "selections": [
      v2,
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
  v5
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "WalletImportViewImportHDWalletMutation",
  "id": null,
  "text": "mutation WalletImportViewImportHDWalletMutation(\n  $input: ImportHDWalletInput!\n) {\n  importHDWallet(input: $input) {\n    hdWallet {\n      accounts {\n        address\n      }\n      localID\n      id\n    }\n    viewer {\n      ...WalletsScreen_user\n      id\n    }\n  }\n}\n\nfragment WalletsScreen_user on User {\n  defaultEthAddress\n  ethWallets {\n    hd {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n    ledger {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "WalletImportViewImportHDWalletMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "importHDWallet",
        "storageKey": null,
        "args": v1,
        "concreteType": "ImportHDWalletPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "hdWallet",
            "storageKey": null,
            "args": null,
            "concreteType": "EthHDWallet",
            "plural": false,
            "selections": [
              v3,
              v4
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
    "name": "WalletImportViewImportHDWalletMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "importHDWallet",
        "storageKey": null,
        "args": v1,
        "concreteType": "ImportHDWalletPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "hdWallet",
            "storageKey": null,
            "args": null,
            "concreteType": "EthHDWallet",
            "plural": false,
            "selections": [
              v3,
              v4,
              v5
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
                    "selections": v6
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "ledger",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "EthLedgerWallet",
                    "plural": true,
                    "selections": v6
                  }
                ]
              },
              v5
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '0e48d2b605c3ba8520d7dce119f6a353';
module.exports = node;
