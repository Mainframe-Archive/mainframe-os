/**
 * @flow
 * @relayHash 32865f378599cbdd0a0086c71dab0568
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type CreateDeveloperIdentityInput = {
  profile: UserProfileInput,
  clientMutationId?: ?string,
};
export type UserProfileInput = {
  name: string,
  avatar?: ?string,
};
export type IdentitySelectorViewCreateDeveloperIdentityMutationVariables = {|
  input: CreateDeveloperIdentityInput
|};
export type IdentitySelectorViewCreateDeveloperIdentityMutationResponse = {|
  +createDeveloperIdentity: ?{|
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
export type IdentitySelectorViewCreateDeveloperIdentityMutation = {|
  variables: IdentitySelectorViewCreateDeveloperIdentityMutationVariables,
  response: IdentitySelectorViewCreateDeveloperIdentityMutationResponse,
|};
*/


/*
mutation IdentitySelectorViewCreateDeveloperIdentityMutation(
  $input: CreateDeveloperIdentityInput!
) {
  createDeveloperIdentity(input: $input) {
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
    "type": "CreateDeveloperIdentityInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "CreateDeveloperIdentityInput!"
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
  "name": "IdentitySelectorViewCreateDeveloperIdentityMutation",
  "id": null,
  "text": "mutation IdentitySelectorViewCreateDeveloperIdentityMutation(\n  $input: CreateDeveloperIdentityInput!\n) {\n  createDeveloperIdentity(input: $input) {\n    user {\n      localID\n      profile {\n        name\n      }\n      id\n    }\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "IdentitySelectorViewCreateDeveloperIdentityMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createDeveloperIdentity",
        "storageKey": null,
        "args": v1,
        "concreteType": "CreateDeveloperIdentityPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "user",
            "storageKey": null,
            "args": null,
            "concreteType": "OwnDeveloperIdentity",
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
    "name": "IdentitySelectorViewCreateDeveloperIdentityMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createDeveloperIdentity",
        "storageKey": null,
        "args": v1,
        "concreteType": "CreateDeveloperIdentityPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "user",
            "storageKey": null,
            "args": null,
            "concreteType": "OwnDeveloperIdentity",
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
(node/*: any*/).hash = '0aab8be8eb69ee15eb24e66a777f3367';
module.exports = node;
