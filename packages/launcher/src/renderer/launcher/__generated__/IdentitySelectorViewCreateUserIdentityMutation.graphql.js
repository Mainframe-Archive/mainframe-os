/**
 * @flow
 * @relayHash c9302b26804b3c8ae85166dc1f66ae9d
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type CreateUserIdentityInput = {|
  profile: UserProfileInput,
  private?: ?boolean,
  clientMutationId?: ?string,
|};
export type UserProfileInput = {|
  name: string,
  avatar?: ?string,
|};
export type IdentitySelectorViewCreateUserIdentityMutationVariables = {|
  input: CreateUserIdentityInput
|};
export type IdentitySelectorViewCreateUserIdentityMutationResponse = {|
  +createUserIdentity: ?{|
    +user: ?{|
      +localID: string,
      +profile: {|
        +name: string
      |},
    |},
    +viewer: {|
      +identities: {|
        +ownUsers: ?$ReadOnlyArray<?{|
          +profile: {|
            +name: string
          |}
        |}>,
        +ownDevelopers: ?$ReadOnlyArray<?{|
          +profile: {|
            +name: string
          |}
        |}>,
      |}
    |},
  |}
|};
export type IdentitySelectorViewCreateUserIdentityMutation = {|
  variables: IdentitySelectorViewCreateUserIdentityMutationVariables,
  response: IdentitySelectorViewCreateUserIdentityMutationResponse,
|};
*/


/*
mutation IdentitySelectorViewCreateUserIdentityMutation(
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
          profile {
            name
          }
          id
        }
        ownDevelopers {
          profile {
            name
          }
          id
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
      "name": "name",
      "args": null,
      "storageKey": null
    }
  ]
},
v4 = [
  (v3/*: any*/)
],
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v6 = [
  (v3/*: any*/),
  (v5/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "IdentitySelectorViewCreateUserIdentityMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createUserIdentity",
        "storageKey": null,
        "args": (v1/*: any*/),
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
                    "selections": (v4/*: any*/)
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "ownDevelopers",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "OwnDeveloperIdentity",
                    "plural": true,
                    "selections": (v4/*: any*/)
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
    "name": "IdentitySelectorViewCreateUserIdentityMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createUserIdentity",
        "storageKey": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/),
              (v3/*: any*/),
              (v5/*: any*/)
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
                    "selections": (v6/*: any*/)
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "ownDevelopers",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "OwnDeveloperIdentity",
                    "plural": true,
                    "selections": (v6/*: any*/)
                  }
                ]
              },
              (v5/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "IdentitySelectorViewCreateUserIdentityMutation",
    "id": null,
    "text": "mutation IdentitySelectorViewCreateUserIdentityMutation(\n  $input: CreateUserIdentityInput!\n) {\n  createUserIdentity(input: $input) {\n    user {\n      localID\n      profile {\n        name\n      }\n      id\n    }\n    viewer {\n      identities {\n        ownUsers {\n          profile {\n            name\n          }\n          id\n        }\n        ownDevelopers {\n          profile {\n            name\n          }\n          id\n        }\n      }\n      id\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '032729d00eeafaf532be34f9bf56f9d4';
module.exports = node;
