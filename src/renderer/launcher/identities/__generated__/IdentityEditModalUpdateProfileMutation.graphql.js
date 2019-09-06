/**
 * @flow
 * @relayHash f4756e27425fcac0479dc011eb452d30
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type UpdateProfileInput = {|
  profile: UpdateUserProfileInput,
  privateProfile?: ?boolean,
  clientMutationId?: ?string,
|};
export type UpdateUserProfileInput = {|
  name?: ?string,
  avatar?: ?string,
  ethAddress?: ?string,
|};
export type IdentityEditModalUpdateProfileMutationVariables = {|
  input: UpdateProfileInput
|};
export type IdentityEditModalUpdateProfileMutationResponse = {|
  +updateProfile: ?{|
    +viewer: {|
      +id: string
    |}
  |}
|};
export type IdentityEditModalUpdateProfileMutation = {|
  variables: IdentityEditModalUpdateProfileMutationVariables,
  response: IdentityEditModalUpdateProfileMutationResponse,
|};
*/


/*
mutation IdentityEditModalUpdateProfileMutation(
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
        "variableName": "input"
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
  "fragment": {
    "kind": "Fragment",
    "name": "IdentityEditModalUpdateProfileMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "IdentityEditModalUpdateProfileMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "IdentityEditModalUpdateProfileMutation",
    "id": null,
    "text": "mutation IdentityEditModalUpdateProfileMutation(\n  $input: UpdateProfileInput!\n) {\n  updateProfile(input: $input) {\n    viewer {\n      id\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '1ad4a02bcc972976d348fdc7730af718';
module.exports = node;
