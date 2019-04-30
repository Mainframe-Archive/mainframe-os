/**
 * @flow
 * @relayHash da129713cad17ff79920ac902e537a62
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type CreateUserIdentityInput = {
  profile: UserProfileInput,
  private?: ?boolean,
  clientMutationId?: ?string,
};
export type UserProfileInput = {
  name: string,
  avatar?: ?string,
};
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
      +id: string
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
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "viewer",
  "storageKey": null,
  "args": null,
  "concreteType": "User",
  "plural": false,
  "selections": [
    v4
  ]
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "IdentitySelectorViewCreateUserIdentityMutation",
  "id": null,
  "text": "mutation IdentitySelectorViewCreateUserIdentityMutation(\n  $input: CreateUserIdentityInput!\n) {\n  createUserIdentity(input: $input) {\n    user {\n      localID\n      profile {\n        name\n      }\n      id\n    }\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "IdentitySelectorViewCreateUserIdentityMutation",
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
              v3
            ]
          },
          v5
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "IdentitySelectorViewCreateUserIdentityMutation",
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
              v3,
              v4
            ]
          },
          v5
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e373a3c4e1e93f7bb82c75b27c964f39';
module.exports = node;
