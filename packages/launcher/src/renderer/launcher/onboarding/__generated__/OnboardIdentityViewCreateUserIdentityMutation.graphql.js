/**
 * @flow
 * @relayHash 778d42a475cd8cc8076fc7ae0473401a
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Launcher_identities$ref = any;
export type CreateUserIdentityInput = {
  profile: UserProfileInput,
  private?: ?boolean,
  clientMutationId?: ?string,
};
export type UserProfileInput = {
  name: string,
  avatar?: ?string,
};
export type OnboardIdentityViewCreateUserIdentityMutationVariables = {|
  input: CreateUserIdentityInput
|};
export type OnboardIdentityViewCreateUserIdentityMutationResponse = {|
  +createUserIdentity: ?{|
    +user: ?{|
      +localID: string,
      +profile: {|
        +name: string
      |},
    |},
    +viewer: {|
      +identities: {|
        +ownUsers: $ReadOnlyArray<{|
          +defaultEthAddress: ?string,
          +localID: string,
        |}>,
        +$fragmentRefs: Launcher_identities$ref,
      |}
    |},
  |}
|};
export type OnboardIdentityViewCreateUserIdentityMutation = {|
  variables: OnboardIdentityViewCreateUserIdentityMutationVariables,
  response: OnboardIdentityViewCreateUserIdentityMutationResponse,
|};
*/


/*
mutation OnboardIdentityViewCreateUserIdentityMutation(
  $input: CreateUserIdentityInput!
) {
  createUserIdentity(input: $input) {
    user {
      localID
      profile {
        name
      }
      id
    }
    viewer {
      identities {
        ownUsers {
          defaultEthAddress
          localID
          id
        }
        ...Launcher_identities
      }
      id
    }
  }
}

fragment Launcher_identities on Identities {
  ownUsers {
    defaultEthAddress
    localID
    profile {
      name
      ethAddress
    }
    wallets {
      hd {
        localID
        id
      }
      ledger {
        localID
        id
      }
    }
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "CreateUserIdentityInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "CreateUserIdentityInput!"
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
  "name": "name",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "profile",
  "storageKey": null,
  "args": null,
  "concreteType": "NamedProfile",
  "plural": false,
  "selections": [
    v3
  ]
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "defaultEthAddress",
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
  v2,
  v6
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "OnboardIdentityViewCreateUserIdentityMutation",
  "id": null,
  "text": "mutation OnboardIdentityViewCreateUserIdentityMutation(\n  $input: CreateUserIdentityInput!\n) {\n  createUserIdentity(input: $input) {\n    user {\n      localID\n      profile {\n        name\n      }\n      id\n    }\n    viewer {\n      identities {\n        ownUsers {\n          defaultEthAddress\n          localID\n          id\n        }\n        ...Launcher_identities\n      }\n      id\n    }\n  }\n}\n\nfragment Launcher_identities on Identities {\n  ownUsers {\n    defaultEthAddress\n    localID\n    profile {\n      name\n      ethAddress\n    }\n    wallets {\n      hd {\n        localID\n        id\n      }\n      ledger {\n        localID\n        id\n      }\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "OnboardIdentityViewCreateUserIdentityMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createUserIdentity",
        "storageKey": null,
        "args": v1,
        "concreteType": "CreateUserIdentityPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "user",
            "storageKey": null,
            "args": null,
            "concreteType": "OwnUserIdentity",
            "plural": false,
            "selections": [
              v2,
              v4
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
                "concreteType": "Identities",
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
                      v5,
                      v2
                    ]
                  },
                  {
                    "kind": "FragmentSpread",
                    "name": "Launcher_identities",
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
    "name": "OnboardIdentityViewCreateUserIdentityMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createUserIdentity",
        "storageKey": null,
        "args": v1,
        "concreteType": "CreateUserIdentityPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "user",
            "storageKey": null,
            "args": null,
            "concreteType": "OwnUserIdentity",
            "plural": false,
            "selections": [
              v2,
              v4,
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
                "concreteType": "Identities",
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
                      v5,
                      v2,
                      v6,
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "profile",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "NamedProfile",
                        "plural": false,
                        "selections": [
                          v3,
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
                        "name": "wallets",
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
(node/*: any*/).hash = 'b086d6ff662cb276384a48d5083599fb';
module.exports = node;
