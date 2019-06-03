/**
 * @flow
 * @relayHash 62d0490e5b1314cda8ed16ee57927d9c
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
export type AppDetailsScreenUpdateAppDetailsMutationVariables = {|
  input: UpdateAppDetailsInput
|};
export type AppDetailsScreenUpdateAppDetailsMutationResponse = {|
  +updateAppDetails: ?{|
    +viewer: {|
      +id: string
    |}
  |}
|};
export type AppDetailsScreenUpdateAppDetailsMutation = {|
  variables: AppDetailsScreenUpdateAppDetailsMutationVariables,
  response: AppDetailsScreenUpdateAppDetailsMutationResponse,
|};
*/


/*
mutation AppDetailsScreenUpdateAppDetailsMutation(
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
  "name": "AppDetailsScreenUpdateAppDetailsMutation",
  "id": null,
  "text": "mutation AppDetailsScreenUpdateAppDetailsMutation(\n  $input: UpdateAppDetailsInput!\n) {\n  updateAppDetails(input: $input) {\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "AppDetailsScreenUpdateAppDetailsMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "AppDetailsScreenUpdateAppDetailsMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '15533979856aefff661bd9b5c604e4a4';
module.exports = node;
