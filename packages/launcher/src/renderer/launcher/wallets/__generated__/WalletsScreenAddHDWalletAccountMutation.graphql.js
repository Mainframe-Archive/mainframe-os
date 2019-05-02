/**
 * @flow
 * @relayHash 52d53cf7e74170dbfb30ba196ec540a2
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type WalletsScreen_user$ref = any;
export type AddHDWalletAccountInput = {
  walletID: string,
  index: number,
  clientMutationId?: ?string,
};
export type WalletsScreenAddHDWalletAccountMutationVariables = {|
  input: AddHDWalletAccountInput
|};
export type WalletsScreenAddHDWalletAccountMutationResponse = {|
  +addHDWalletAccount: ?{|
    +address: string,
    +viewer: {|
      +$fragmentRefs: WalletsScreen_user$ref
    |},
  |}
|};
export type WalletsScreenAddHDWalletAccountMutation = {|
  variables: WalletsScreenAddHDWalletAccountMutationVariables,
  response: WalletsScreenAddHDWalletAccountMutationResponse,
|};
*/


/*
mutation WalletsScreenAddHDWalletAccountMutation(
  $input: AddHDWalletAccountInput!
) {
  addHDWalletAccount(input: $input) {
    address
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
  v3
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "WalletsScreenAddHDWalletAccountMutation",
  "id": null,
  "text": "mutation WalletsScreenAddHDWalletAccountMutation(\n  $input: AddHDWalletAccountInput!\n) {\n  addHDWalletAccount(input: $input) {\n    address\n    viewer {\n      ...WalletsScreen_user\n      id\n    }\n  }\n}\n\nfragment WalletsScreen_user on User {\n  defaultEthAddress\n  ethWallets {\n    hd {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n    ledger {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "WalletsScreenAddHDWalletAccountMutation",
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
    "name": "WalletsScreenAddHDWalletAccountMutation",
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
(node/*: any*/).hash = '14cdef8774ae3800f7e3fb2998dc300b';
module.exports = node;
