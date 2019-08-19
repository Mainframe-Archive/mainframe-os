/**
 * @flow
 * @relayHash f119a11d58c49a388c65edabc7d526d9
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type WalletsScreen_user$ref = any;
export type SetProfileWalletInput = {
  address: string,
  clientMutationId?: ?string,
};
export type WalletsScreenSetProfileWalletMutationVariables = {|
  input: SetProfileWalletInput
|};
export type WalletsScreenSetProfileWalletMutationResponse = {|
  +setProfileWallet: ?{|
    +viewer: {|
      +$fragmentRefs: WalletsScreen_user$ref
    |}
  |}
|};
export type WalletsScreenSetProfileWalletMutation = {|
  variables: WalletsScreenSetProfileWalletMutationVariables,
  response: WalletsScreenSetProfileWalletMutationResponse,
|};
*/


/*
mutation WalletsScreenSetProfileWalletMutation(
  $input: SetProfileWalletInput!
) {
  setProfileWallet(input: $input) {
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
    "type": "SetProfileWalletInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "SetProfileWalletInput!"
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
  "name": "WalletsScreenSetProfileWalletMutation",
  "id": null,
  "text": "mutation WalletsScreenSetProfileWalletMutation(\n  $input: SetProfileWalletInput!\n) {\n  setProfileWallet(input: $input) {\n    viewer {\n      ...WalletsScreen_user\n      id\n    }\n  }\n}\n\nfragment WalletsScreen_user on User {\n  profile {\n    ethAddress\n  }\n  ethWallets {\n    hd {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n    ledger {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "WalletsScreenSetProfileWalletMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "setProfileWallet",
        "storageKey": null,
        "args": v1,
        "concreteType": "SetProfileWalletPayload",
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
    "name": "WalletsScreenSetProfileWalletMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "setProfileWallet",
        "storageKey": null,
        "args": v1,
        "concreteType": "SetProfileWalletPayload",
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
(node/*: any*/).hash = 'd598262f41f4b5dd086afdf201a83b66';
module.exports = node;
