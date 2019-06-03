/**
 * @flow
 * @relayHash b1697cd56b6b9ee0f616b348e9071515
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type SetAppPermissionsRequirementsInput = {
  appID: string,
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
export type AppDetailsScreenSetAppPermissionsRequirementsMutationVariables = {|
  input: SetAppPermissionsRequirementsInput
|};
export type AppDetailsScreenSetAppPermissionsRequirementsMutationResponse = {|
  +setAppPermissionsRequirements: ?{|
    +viewer: {|
      +id: string
    |}
  |}
|};
export type AppDetailsScreenSetAppPermissionsRequirementsMutation = {|
  variables: AppDetailsScreenSetAppPermissionsRequirementsMutationVariables,
  response: AppDetailsScreenSetAppPermissionsRequirementsMutationResponse,
|};
*/


/*
mutation AppDetailsScreenSetAppPermissionsRequirementsMutation(
  $input: SetAppPermissionsRequirementsInput!
) {
  setAppPermissionsRequirements(input: $input) {
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
    "type": "SetAppPermissionsRequirementsInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "setAppPermissionsRequirements",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "SetAppPermissionsRequirementsInput!"
      }
    ],
    "concreteType": "SetAppPermissionsRequirementsPayload",
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
  "name": "AppDetailsScreenSetAppPermissionsRequirementsMutation",
  "id": null,
  "text": "mutation AppDetailsScreenSetAppPermissionsRequirementsMutation(\n  $input: SetAppPermissionsRequirementsInput!\n) {\n  setAppPermissionsRequirements(input: $input) {\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "AppDetailsScreenSetAppPermissionsRequirementsMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "AppDetailsScreenSetAppPermissionsRequirementsMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'dbb543babecf7a5f21fdfd7ec4de85dc';
module.exports = node;
