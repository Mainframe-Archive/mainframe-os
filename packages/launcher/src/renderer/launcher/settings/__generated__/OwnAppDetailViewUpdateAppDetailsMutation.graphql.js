/**
 * @flow
 * @relayHash 2d8ed7662bed4911d54608a6a73e5d12
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type UpdateAppDetailsInput = {
  appID: string,
  name: string,
  contentsPath: string,
  version: string,
  clientMutationId?: ?string,
};
export type OwnAppDetailViewUpdateAppDetailsMutationVariables = {|
  input: UpdateAppDetailsInput
|};
export type OwnAppDetailViewUpdateAppDetailsMutationResponse = {|
  +updateAppDetails: ?{|
    +viewer: {|
      +id: string
    |}
  |}
|};
export type OwnAppDetailViewUpdateAppDetailsMutation = {|
  variables: OwnAppDetailViewUpdateAppDetailsMutationVariables,
  response: OwnAppDetailViewUpdateAppDetailsMutationResponse,
|};
*/


/*
mutation OwnAppDetailViewUpdateAppDetailsMutation(
  $input: UpdateAppDetailsInput!
) {
  updateAppDetails(input: $input) {
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
    "type": "UpdateAppDetailsInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "updateAppDetails",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "UpdateAppDetailsInput!"
      }
    ],
    "concreteType": "UpdateAppDetailsPayload",
    "plural": false,
    "selections": [
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
  "name": "OwnAppDetailViewUpdateAppDetailsMutation",
  "id": null,
  "text": "mutation OwnAppDetailViewUpdateAppDetailsMutation(\n  $input: UpdateAppDetailsInput!\n) {\n  updateAppDetails(input: $input) {\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "OwnAppDetailViewUpdateAppDetailsMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "OwnAppDetailViewUpdateAppDetailsMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '6d7fc2b8a3a35cc666a287512e778c24';
module.exports = node;
