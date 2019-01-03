/**
 * @flow
 * @relayHash ebaff95b2b959cf2fd651f82ce43c285
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type WalletsView_wallets$ref = any;
export type AddHDWalletAccountInput = {
  walletID: string,
  index: number,
  name: string,
  clientMutationId?: ?string,
};
export type WalletsViewAddHDWalletAccountMutationVariables = {|
  input: AddHDWalletAccountInput
|};
export type WalletsViewAddHDWalletAccountMutationResponse = {|
  +addHDWalletAccount: ?{|
    +address: string,
    +viewer: {|
      +wallets: {|
        +$fragmentRefs: WalletsView_wallets$ref
      |}
    |},
  |}
|};
export type WalletsViewAddHDWalletAccountMutation = {|
  variables: WalletsViewAddHDWalletAccountMutationVariables,
  response: WalletsViewAddHDWalletAccountMutationResponse,
|};
*/


/*
mutation WalletsViewAddHDWalletAccountMutation(
  $input: AddHDWalletAccountInput!
) {
  addHDWalletAccount(input: $input) {
    address
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
    "type": "AddHDWalletAccountInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "AddHDWalletAccountInput!"
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
      v2
    ]
  },
  v3
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "WalletsViewAddHDWalletAccountMutation",
  "id": null,
  "text": "mutation WalletsViewAddHDWalletAccountMutation(\n  $input: AddHDWalletAccountInput!\n) {\n  addHDWalletAccount(input: $input) {\n    address\n    viewer {\n      wallets {\n        ...WalletsView_wallets\n      }\n      id\n    }\n  }\n}\n\nfragment WalletsView_wallets on WalletsQuery {\n  ethWallets {\n    hd {\n      localID\n      accounts {\n        name\n        address\n      }\n      id\n    }\n    ledger {\n      localID\n      accounts {\n        name\n        address\n      }\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "WalletsViewAddHDWalletAccountMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addHDWalletAccount",
        "storageKey": null,
        "args": v1,
        "concreteType": "AddHDWalletAccountPayload",
        "plural": false,
        "selections": [
          v2,
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
    "name": "WalletsViewAddHDWalletAccountMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addHDWalletAccount",
        "storageKey": null,
        "args": v1,
        "concreteType": "AddHDWalletAccountPayload",
        "plural": false,
        "selections": [
          v2,
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
(node/*: any*/).hash = '787d206bf98f734e6f9cd5fec1af651a';
module.exports = node;
