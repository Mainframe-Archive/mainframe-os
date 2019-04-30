/**
 * @flow
 * @relayHash ed47c3422af9f9dc5e9d229896573779
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type UpdateProfileInput = {
  userID: string,
  profile: UpdateUserProfileInput,
  privateProfile?: ?boolean,
  clientMutationId?: ?string,
};
export type UpdateUserProfileInput = {
  name?: ?string,
  avatar?: ?string,
  ethAddress?: ?string,
};
export type CreateWalletUpdateProfileMutationVariables = {|
  input: UpdateProfileInput
|};
export type CreateWalletUpdateProfileMutationResponse = {|
  +updateProfile: ?{|
    +viewer: {|
      +id: string
    |}
  |}
|};
export type CreateWalletUpdateProfileMutation = {|
  variables: CreateWalletUpdateProfileMutationVariables,
  response: CreateWalletUpdateProfileMutationResponse,
|};
*/


/*
mutation CreateWalletUpdateProfileMutation(
  $input: UpdateProfileInput!
) {
  updateProfile(input: $input) {
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
    "type": "UpdateProfileInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "updateProfile",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "UpdateProfileInput!"
      }
    ],
    "concreteType": "UpdateProfilePayload",
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
  "name": "CreateWalletUpdateProfileMutation",
  "id": null,
  "text": "mutation CreateWalletUpdateProfileMutation(\n  $input: UpdateProfileInput!\n) {\n  updateProfile(input: $input) {\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "CreateWalletUpdateProfileMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "CreateWalletUpdateProfileMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e0b03a1d957fd09c76a031942c2e56cc';
module.exports = node;
