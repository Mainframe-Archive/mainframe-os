/**
 * @flow
 * @relayHash 5bf24c82ec14a85a8cc3a07df8ef63e1
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Launcher_identities$ref = any;
type WalletsView_wallets$ref = any;
export type SupportedWallets = "ETHEREUM" | "%future added value";
export type ImportHDWalletInput = {
  blockchain: SupportedWallets,
  mnemonic: string,
  name: string,
  userID?: ?string,
  clientMutationId?: ?string,
};
export type WalletImportViewImportHDWalletMutationVariables = {|
  input: ImportHDWalletInput,
  userID: string,
|};
export type WalletImportViewImportHDWalletMutationResponse = {|
  +importHDWallet: ?{|
    +hdWallet: ?{|
      +accounts: ?$ReadOnlyArray<?{|
        +name: string,
        +address: string,
      |}>,
      +localID: string,
    |},
    +viewer: {|
      +identities: {|
        +$fragmentRefs: Launcher_identities$ref
      |},
      +wallets: {|
        +$fragmentRefs: WalletsView_wallets$ref
      |},
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
  $userID: String!
) {
  importHDWallet(input: $input) {
    hdWallet {
      accounts {
        name
        address
      }
      localID
      id
    }
    viewer {
      identities {
        ...Launcher_identities
      }
      wallets {
        ...WalletsView_wallets_3iqrP
      }
      id
    }
  }
}

fragment Launcher_identities on IdentitiesQuery {
  ownUsers {
    defaultEthAddress
    localID
    id
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
    "type": "ImportHDWalletInput!",
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
    "type": "ImportHDWalletInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "address",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "accounts",
  "storageKey": null,
  "args": null,
  "concreteType": "NamedWalletAccountType",
  "plural": true,
  "selections": [
    v2,
    v3
  ]
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v7 = [
  v5,
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "accounts",
    "storageKey": null,
    "args": null,
    "concreteType": "NamedWalletAccountType",
    "plural": true,
    "selections": [
      v2,
      v3,
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
  v6
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "WalletImportViewImportHDWalletMutation",
  "id": null,
  "text": "mutation WalletImportViewImportHDWalletMutation(\n  $input: ImportHDWalletInput!\n  $userID: String!\n) {\n  importHDWallet(input: $input) {\n    hdWallet {\n      accounts {\n        name\n        address\n      }\n      localID\n      id\n    }\n    viewer {\n      identities {\n        ...Launcher_identities\n      }\n      wallets {\n        ...WalletsView_wallets_3iqrP\n      }\n      id\n    }\n  }\n}\n\nfragment Launcher_identities on IdentitiesQuery {\n  ownUsers {\n    defaultEthAddress\n    localID\n    id\n  }\n}\n\nfragment WalletsView_wallets_3iqrP on WalletsQuery {\n  ethWallets(userID: $userID) {\n    hd {\n      localID\n      accounts {\n        name\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n    ledger {\n      localID\n      accounts {\n        name\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n  }\n}\n",
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
            "concreteType": "Viewer",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "identities",
                "storageKey": null,
                "args": null,
                "concreteType": "IdentitiesQuery",
                "plural": false,
                "selections": [
                  {
                    "kind": "FragmentSpread",
                    "name": "Launcher_identities",
                    "args": null
                  }
                ]
              },
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
              v4,
              v5,
              v6
            ]
          },
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
                "name": "identities",
                "storageKey": null,
                "args": null,
                "concreteType": "IdentitiesQuery",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "ownUsers",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "OwnUserIdentity",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "defaultEthAddress",
                        "args": null,
                        "storageKey": null
                      },
                      v5,
                      v6
                    ]
                  }
                ]
              },
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
                        "selections": v7
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "ledger",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "EthLedgerWallet",
                        "plural": true,
                        "selections": v7
                      }
                    ]
                  }
                ]
              },
              v6
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '19088cbac3c83c99a1d14093efd6df3a';
module.exports = node;
