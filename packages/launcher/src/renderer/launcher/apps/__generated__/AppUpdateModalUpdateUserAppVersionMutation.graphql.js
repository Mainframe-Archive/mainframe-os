/**
 * @flow
 * @relayHash 89b81bf398a7728ba0866578eed46c7e
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type UpdateUserAppVersionMutationInput = {
  userAppVersionID: string,
  webDomains: $ReadOnlyArray<WebDomainDefinitionInput>,
  clientMutationId?: ?string,
};
export type WebDomainDefinitionInput = {
  domain: string,
  internal?: ?boolean,
  external?: ?boolean,
};
export type AppUpdateModalUpdateUserAppVersionMutationVariables = {|
  input: UpdateUserAppVersionMutationInput
|};
export type AppUpdateModalUpdateUserAppVersionMutationResponse = {|
  +updateUserAppVersion: ?{|
    +viewer: {|
      +id: string
    |}
  |}
|};
export type AppUpdateModalUpdateUserAppVersionMutation = {|
  variables: AppUpdateModalUpdateUserAppVersionMutationVariables,
  response: AppUpdateModalUpdateUserAppVersionMutationResponse,
|};
*/


/*
mutation AppUpdateModalUpdateUserAppVersionMutation(
  $input: UpdateUserAppVersionMutationInput!
) {
  updateUserAppVersion(input: $input) {
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
    "type": "UpdateUserAppVersionMutationInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "updateUserAppVersion",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "UpdateUserAppVersionMutationInput!"
      }
    ],
    "concreteType": "UpdateUserAppVersionMutationPayload",
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
  "name": "AppUpdateModalUpdateUserAppVersionMutation",
  "id": null,
  "text": "mutation AppUpdateModalUpdateUserAppVersionMutation(\n  $input: UpdateUserAppVersionMutationInput!\n) {\n  updateUserAppVersion(input: $input) {\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "AppUpdateModalUpdateUserAppVersionMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "AppUpdateModalUpdateUserAppVersionMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '49e6bbdcf7e3b2fd881f3cf4df9dff4b';
module.exports = node;
