/**
 * @flow
 * @relayHash a0758461172f7aae806487df1e0e3379
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
export type OwnAppDetailViewSetAppPermissionsRequirementsMutationVariables = {|
  input: SetAppPermissionsRequirementsInput
|};
export type OwnAppDetailViewSetAppPermissionsRequirementsMutationResponse = {|
  +setAppPermissionsRequirements: ?{|
    +viewer: {|
      +id: string
    |}
  |}
|};
export type OwnAppDetailViewSetAppPermissionsRequirementsMutation = {|
  variables: OwnAppDetailViewSetAppPermissionsRequirementsMutationVariables,
  response: OwnAppDetailViewSetAppPermissionsRequirementsMutationResponse,
|};
*/


/*
mutation OwnAppDetailViewSetAppPermissionsRequirementsMutation(
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
  "name": "OwnAppDetailViewSetAppPermissionsRequirementsMutation",
  "id": null,
  "text": "mutation OwnAppDetailViewSetAppPermissionsRequirementsMutation(\n  $input: SetAppPermissionsRequirementsInput!\n) {\n  setAppPermissionsRequirements(input: $input) {\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "OwnAppDetailViewSetAppPermissionsRequirementsMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "OwnAppDetailViewSetAppPermissionsRequirementsMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '67f55540f816680116fc48fd7c9bdb9f';
module.exports = node;
