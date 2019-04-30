/**
 * @flow
 * @relayHash d0457c49544cfb660898cdcce78965c1
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
export type CreateDevIdentityViewCreateDeveloperIdentityMutationVariables = {|
  input: CreateDeveloperIdentityInput
|};
export type CreateDevIdentityViewCreateDeveloperIdentityMutationResponse = {|
  +createDeveloperIdentity: ?{|
    +viewer: {|
      +id: string
    |}
  |}
|};
export type CreateDevIdentityViewCreateDeveloperIdentityMutation = {|
  variables: CreateDevIdentityViewCreateDeveloperIdentityMutationVariables,
  response: CreateDevIdentityViewCreateDeveloperIdentityMutationResponse,
|};
*/


/*
mutation CreateDevIdentityViewCreateDeveloperIdentityMutation(
  $input: CreateDeveloperIdentityInput!
) {
  createDeveloperIdentity(input: $input) {
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
    "kind": "LinkedField",
    "alias": null,
    "name": "createDeveloperIdentity",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "CreateDeveloperIdentityInput!"
      }
    ],
    "concreteType": "CreateDeveloperIdentityPayload",
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
            "name": "id",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "CreateDevIdentityViewCreateDeveloperIdentityMutation",
  "id": null,
  "text": "mutation CreateDevIdentityViewCreateDeveloperIdentityMutation(\n  $input: CreateDeveloperIdentityInput!\n) {\n  createDeveloperIdentity(input: $input) {\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "CreateDevIdentityViewCreateDeveloperIdentityMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "CreateDevIdentityViewCreateDeveloperIdentityMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '4d502474c8a7f9d9af835395c77ffad1';
module.exports = node;
