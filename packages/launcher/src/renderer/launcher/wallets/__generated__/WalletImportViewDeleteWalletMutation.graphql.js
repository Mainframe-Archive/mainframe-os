/**
 * @flow
 * @relayHash f3696f2ec1d37d63b1af40ab91ea40b6
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type WalletsView_wallets$ref = any;
export type DeleteWalletInput = {
  walletID: string,
  type: string,
  clientMutationId?: ?string,
};
export type WalletImportViewDeleteWalletMutationVariables = {|
  input: DeleteWalletInput
|};
export type WalletImportViewDeleteWalletMutationResponse = {|
  +deleteWallet: ?{|
    +viewer: {|
      +wallets: {|
        +$fragmentRefs: WalletsView_wallets$ref
      |}
    |}
  |}
|};
export type WalletImportViewDeleteWalletMutation = {|
  variables: WalletImportViewDeleteWalletMutationVariables,
  response: WalletImportViewDeleteWalletMutationResponse,
|};
*/


/*
mutation WalletImportViewDeleteWalletMutation(
  $input: DeleteWalletInput!
) {
  deleteWallet(input: $input) {
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
      accounts
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
    "type": "DeleteWalletInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "DeleteWalletInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "WalletImportViewDeleteWalletMutation",
  "id": null,
  "text": "mutation WalletImportViewDeleteWalletMutation(\n  $input: DeleteWalletInput!\n) {\n  deleteWallet(input: $input) {\n    viewer {\n      wallets {\n        ...WalletsView_wallets\n      }\n      id\n    }\n  }\n}\n\nfragment WalletsView_wallets on WalletsQuery {\n  ethWallets {\n    hd {\n      localID\n      accounts {\n        name\n        address\n      }\n      id\n    }\n    ledger {\n      localID\n      accounts\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "WalletImportViewDeleteWalletMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "deleteWallet",
        "storageKey": null,
        "args": v1,
        "concreteType": "DeleteWalletPayload",
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
    "name": "WalletImportViewDeleteWalletMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "deleteWallet",
        "storageKey": null,
        "args": v1,
        "concreteType": "DeleteWalletPayload",
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
                        "selections": [
                          v2,
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "accounts",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "HDWalletAccountType",
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
                          v3
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "ledger",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "EthLedgerWallet",
                        "plural": true,
                        "selections": [
                          v2,
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "accounts",
                            "args": null,
                            "storageKey": null
                          },
                          v3
                        ]
                      }
                    ]
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
(node/*: any*/).hash = '5f51a4fe5edef6f02e17725d8984afa6';
module.exports = node;
