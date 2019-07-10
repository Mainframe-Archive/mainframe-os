/**
 * @flow
 * @relayHash 3453777916cd187b6e326f4174a77318
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AppUpdateMutationInput = {
  appID: string,
  userID: string,
  webDomains: $ReadOnlyArray<WebDomainDefinitionInput>,
  clientMutationId?: ?string,
};
export type WebDomainDefinitionInput = {
  domain: string,
  internal?: ?boolean,
  external?: ?boolean,
};
export type AppUpdateModalAppUpdateMutationVariables = {|
  input: AppUpdateMutationInput
|};
export type AppUpdateModalAppUpdateMutationResponse = {|
  +updateApp: ?{|
    +viewer: {|
      +id: string
    |}
  |}
|};
export type AppUpdateModalAppUpdateMutation = {|
  variables: AppUpdateModalAppUpdateMutationVariables,
  response: AppUpdateModalAppUpdateMutationResponse,
|};
*/


/*
mutation AppUpdateModalAppUpdateMutation(
  $input: AppUpdateMutationInput!
) {
  updateApp(input: $input) {
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
    "type": "AppUpdateMutationInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "updateApp",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "AppUpdateMutationInput!"
      }
    ],
    "concreteType": "AppUpdateMutationPayload",
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
  "name": "AppUpdateModalAppUpdateMutation",
  "id": null,
  "text": "mutation AppUpdateModalAppUpdateMutation(\n  $input: AppUpdateMutationInput!\n) {\n  updateApp(input: $input) {\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "AppUpdateModalAppUpdateMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "AppUpdateModalAppUpdateMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'dcb3510c252fe1ac0d7e4977fbee0826';
module.exports = node;
