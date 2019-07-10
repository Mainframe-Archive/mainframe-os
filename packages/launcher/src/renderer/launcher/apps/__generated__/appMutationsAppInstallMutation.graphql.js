/**
 * @flow
 * @relayHash b41ed5ea5fa055a76a142c417b262e1d
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AppInstallMutationInput = {
  userID: string,
  appVersionID: string,
  webDomains: $ReadOnlyArray<WebDomainDefinitionInput>,
  clientMutationId?: ?string,
};
export type WebDomainDefinitionInput = {
  domain: string,
  internal?: ?boolean,
  external?: ?boolean,
};
export type appMutationsAppInstallMutationVariables = {|
  input: AppInstallMutationInput
|};
export type appMutationsAppInstallMutationResponse = {|
  +installApp: ?{|
    +appVersion: ?{|
      +id: string,
      +localID: string,
      +manifest: {|
        +profile: {|
          +name: ?string
        |}
      |},
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
    appVersion {
      id
      localID
      manifest {
        profile {
          name
        }
      }
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
        "name": "appVersion",
        "storageKey": null,
        "args": null,
        "concreteType": "AppVersion",
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
            "kind": "LinkedField",
            "alias": null,
            "name": "manifest",
            "storageKey": null,
            "args": null,
            "concreteType": "AppManifest",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "profile",
                "storageKey": null,
                "args": null,
                "concreteType": "GenericProfile",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "name",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
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
  "text": "mutation appMutationsAppInstallMutation(\n  $input: AppInstallMutationInput!\n) {\n  installApp(input: $input) {\n    appVersion {\n      id\n      localID\n      manifest {\n        profile {\n          name\n        }\n      }\n    }\n    viewer {\n      id\n    }\n  }\n}\n",
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
(node/*: any*/).hash = 'b2e57fa1712e73a15c0e1651ce63b1d9';
module.exports = node;
