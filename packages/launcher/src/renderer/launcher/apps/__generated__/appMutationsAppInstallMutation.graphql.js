/**
 * @flow
 * @relayHash 8cf83f262e8736adff8129c0ceb8916b
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AppInstallMutationInput = {
  userID: string,
  manifest: AppManifestInput,
  permissionsSettings: AppPermissionsSettingsInput,
  clientMutationId?: ?string,
};
export type AppManifestInput = {
  id: string,
  name: string,
  version: string,
  contentsHash: string,
  updateHash: string,
  permissions: AppPermissionsRequirementsInput,
  author: ManifestAuthorInput,
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
export type ManifestAuthorInput = {
  id: string,
  name: string,
};
export type AppPermissionsSettingsInput = {
  permissionsChecked: boolean,
  grants: PermissionGrantsInput,
};
export type PermissionGrantsInput = {
  BLOCKCHAIN_SEND?: ?boolean,
  COMMS_CONTACT?: ?boolean,
  CONTACTS_READ?: ?boolean,
  WEB_REQUEST: WebRequestGrantInput,
};
export type WebRequestGrantInput = {
  granted?: ?$ReadOnlyArray<?string>,
  denied?: ?$ReadOnlyArray<?string>,
};
export type appMutationsAppInstallMutationVariables = {|
  input: AppInstallMutationInput
|};
export type appMutationsAppInstallMutationResponse = {|
  +installApp: ?{|
    +app: ?{|
      +id: string,
      +localID: string,
      +name: string,
    |},
    +viewer: {|
      +id: string
    |},
  |}
|};
export type appMutationsAppInstallMutation = {|
  variables: appMutationsAppInstallMutationVariables,
  response: appMutationsAppInstallMutationResponse,
|};
*/


/*
mutation appMutationsAppInstallMutation(
  $input: AppInstallMutationInput!
) {
  installApp(input: $input) {
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
    "type": "AppInstallMutationInput!",
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
    "name": "installApp",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "AppInstallMutationInput!"
      }
    ],
    "concreteType": "AppInstallMutationPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "app",
        "storageKey": null,
        "args": null,
        "concreteType": "App",
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
  "name": "appMutationsAppInstallMutation",
  "id": null,
  "text": "mutation appMutationsAppInstallMutation(\n  $input: AppInstallMutationInput!\n) {\n  installApp(input: $input) {\n    app {\n      id\n      localID\n      name\n    }\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "appMutationsAppInstallMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v2
  },
  "operation": {
    "kind": "Operation",
    "name": "appMutationsAppInstallMutation",
    "argumentDefinitions": v0,
    "selections": v2
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'f2089f790ece1c7536eab515580beb80';
module.exports = node;
