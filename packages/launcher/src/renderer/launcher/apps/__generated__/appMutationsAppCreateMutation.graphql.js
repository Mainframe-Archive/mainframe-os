/**
 * @flow
 * @relayHash b7a618e6fa805ca0639fafc909fb2b4f
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AppCreateMutationInput = {
  name: string,
  contentsPath: string,
  version: string,
  developerID: string,
  permissionsRequirements: AppPermissionsRequirementsInput,
  clientMutationId?: ?string,
};
export type AppPermissionsRequirementsInput = {
  optional: AppPermissionDefinitionsInput,
  required: AppPermissionDefinitionsInput,
};
export type AppPermissionDefinitionsInput = {
  BLOCKCHAIN_SEND?: ?boolean,
  COMMS_CONTACT?: ?boolean,
  CONTACTS_READ?: ?boolean,
  WEB_REQUEST?: ?$ReadOnlyArray<?string>,
};
export type appMutationsAppCreateMutationVariables = {|
  input: AppCreateMutationInput
|};
export type appMutationsAppCreateMutationResponse = {|
  +createApp: ?{|
    +app: {|
      +id: string,
      +localID: string,
      +name: string,
    |},
    +viewer: {|
      +id: string
    |},
  |}
|};
export type appMutationsAppCreateMutation = {|
  variables: appMutationsAppCreateMutationVariables,
  response: appMutationsAppCreateMutationResponse,
|};
*/


/*
mutation appMutationsAppCreateMutation(
  $input: AppCreateMutationInput!
) {
  createApp(input: $input) {
    app {
      id
      localID
      name
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
    "type": "AppCreateMutationInput!",
    "defaultValue": null
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "createApp",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "AppCreateMutationInput!"
      }
    ],
    "concreteType": "AppCreateMutationPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "app",
        "storageKey": null,
        "args": null,
        "concreteType": "OwnApp",
        "plural": false,
        "selections": [
          v1,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "localID",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "name",
            "args": null,
            "storageKey": null
          }
        ]
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          v1
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "appMutationsAppCreateMutation",
  "id": null,
  "text": "mutation appMutationsAppCreateMutation(\n  $input: AppCreateMutationInput!\n) {\n  createApp(input: $input) {\n    app {\n      id\n      localID\n      name\n    }\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "appMutationsAppCreateMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v2
  },
  "operation": {
    "kind": "Operation",
    "name": "appMutationsAppCreateMutation",
    "argumentDefinitions": v0,
    "selections": v2
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '696f03d52699bf99cef81bc01010c3df';
module.exports = node;
