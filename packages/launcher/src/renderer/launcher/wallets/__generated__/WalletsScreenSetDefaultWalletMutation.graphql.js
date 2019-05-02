/**
 * @flow
 * @relayHash 5057ebf008bf26eb9fd6769104311dfb
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type WalletsScreen_user$ref = any;
export type SetDefaultWalletInput = {
  userID: string,
  address: string,
  clientMutationId?: ?string,
};
export type WalletsScreenSetDefaultWalletMutationVariables = {|
  input: SetDefaultWalletInput
|};
export type WalletsScreenSetDefaultWalletMutationResponse = {|
  +setDefaultWallet: ?{|
    +viewer: {|
      +$fragmentRefs: WalletsScreen_user$ref
    |}
  |}
|};
export type WalletsScreenSetDefaultWalletMutation = {|
  variables: WalletsScreenSetDefaultWalletMutationVariables,
  response: WalletsScreenSetDefaultWalletMutationResponse,
|};
*/


/*
mutation WalletsScreenSetDefaultWalletMutation(
  $input: SetDefaultWalletInput!
) {
  setDefaultWallet(input: $input) {
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
    "type": "SetDefaultWalletInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "SetDefaultWalletInput!"
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
  v2
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "WalletsScreenSetDefaultWalletMutation",
  "id": null,
  "text": "mutation WalletsScreenSetDefaultWalletMutation(\n  $input: SetDefaultWalletInput!\n) {\n  setDefaultWallet(input: $input) {\n    viewer {\n      ...WalletsScreen_user\n      id\n    }\n  }\n}\n\nfragment WalletsScreen_user on User {\n  defaultEthAddress\n  ethWallets {\n    hd {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n    ledger {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "WalletsScreenSetDefaultWalletMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "setDefaultWallet",
        "storageKey": null,
        "args": v1,
        "concreteType": "SetDefaultWalletPayload",
        "plural": false,
        "selections": [
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
    "name": "WalletsScreenSetDefaultWalletMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "setDefaultWallet",
        "storageKey": null,
        "args": v1,
        "concreteType": "SetDefaultWalletPayload",
        "plural": false,
        "selections": [
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
(node/*: any*/).hash = '6cffe7af2acfaaaea35583a327299584';
module.exports = node;
