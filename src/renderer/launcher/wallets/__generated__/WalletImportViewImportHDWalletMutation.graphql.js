/**
 * @flow
 * @relayHash e46b5756dbcb86107a004f2e12398121
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
  setAsDefault?: ?boolean,
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
  "name": "localID",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v5 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  },
  v3,
  v2,
  v4
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "WalletImportViewImportHDWalletMutation",
  "id": null,
  "text": "mutation WalletImportViewImportHDWalletMutation(\n  $input: ImportHDWalletInput!\n) {\n  importHDWallet(input: $input) {\n    hdWallet {\n      accounts {\n        address\n      }\n      localID\n      id\n    }\n    viewer {\n      ...WalletsScreen_user\n      id\n    }\n  }\n}\n\nfragment WalletsScreen_user on User {\n  profile {\n    ethAddress\n  }\n  ethWallets {\n    hd {\n      name\n      localID\n      accounts {\n        address\n      }\n      id\n    }\n    ledger {\n      name\n      localID\n      accounts {\n        address\n      }\n      id\n    }\n  }\n}\n",
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
              v2,
              v3
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
              v2,
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
                    "selections": v5
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "ledger",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "EthLedgerWallet",
                    "plural": true,
                    "selections": v5
                  }
                ]
              },
              v4
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
