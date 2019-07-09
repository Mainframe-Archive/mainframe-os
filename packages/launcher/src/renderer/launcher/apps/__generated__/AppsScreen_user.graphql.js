/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
export type AppInstallationState = "DONE" | "DOWNLOADING" | "FAILED" | "PENDING" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type AppsScreen_user$ref: FragmentReference;
export type AppsScreen_user = {|
  +id: string,
  +apps: $ReadOnlyArray<{|
    +localID: string,
    +appVersion: {|
      +app: {|
        +publicID: string
      |},
      +manifest: {|
        +profile: {|
          +name: ?string
        |},
        +permissions: {|
          +optional: {|
            +CONTACT_COMMUNICATION: ?boolean,
            +CONTACT_LIST: ?boolean,
            +ETHEREUM_TRANSACTION: ?boolean,
            +WEB_REQUEST: ?$ReadOnlyArray<?string>,
          |},
          +required: {|
            +CONTACT_COMMUNICATION: ?boolean,
            +CONTACT_LIST: ?boolean,
            +ETHEREUM_TRANSACTION: ?boolean,
            +WEB_REQUEST: ?$ReadOnlyArray<?string>,
          |},
        |},
      |},
    |},
    +update: ?{|
      +toVersion: {|
        +installationState: AppInstallationState,
        +manifest: {|
          +version: string
        |},
      |},
      +permissionsChanged: boolean,
    |},
    +settings: {|
      +permissionsChecked: boolean,
      +permissionsGrants: {|
        +CONTACT_COMMUNICATION: ?boolean,
        +CONTACT_LIST: ?boolean,
        +ETHEREUM_TRANSACTION: ?boolean,
        +WEB_REQUEST: {|
          +granted: $ReadOnlyArray<string>,
          +denied: $ReadOnlyArray<string>,
        |},
      |},
    |},
  |}>,
  +$refType: AppsScreen_user$ref,
|};
*/


const node/*: ConcreteFragment*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "CONTACT_COMMUNICATION",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "CONTACT_LIST",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "ETHEREUM_TRANSACTION",
  "args": null,
  "storageKey": null
},
v3 = [
  v0,
  v1,
  v2,
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "WEB_REQUEST",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "AppsScreen_user",
  "type": "User",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "apps",
      "storageKey": null,
      "args": null,
      "concreteType": "UserAppVersion",
      "plural": true,
      "selections": [
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
          "name": "appVersion",
          "storageKey": null,
          "args": null,
          "concreteType": "AppVersion",
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
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "publicID",
                  "args": null,
                  "storageKey": null
                }
              ]
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
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "permissions",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "AppPermissionsRequirements",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "optional",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "AppPermissionDefinitions",
                      "plural": false,
                      "selections": v3
                    },
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "required",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "AppPermissionDefinitions",
                      "plural": false,
                      "selections": v3
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
          "name": "update",
          "storageKey": null,
          "args": null,
          "concreteType": "AppUpdate",
          "plural": false,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "toVersion",
              "storageKey": null,
              "args": null,
              "concreteType": "AppVersion",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "installationState",
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
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "version",
                      "args": null,
                      "storageKey": null
                    }
                  ]
                }
              ]
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "permissionsChanged",
              "args": null,
              "storageKey": null
            }
          ]
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "settings",
          "storageKey": null,
          "args": null,
          "concreteType": "UserAppSettings",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "permissionsChecked",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "permissionsGrants",
              "storageKey": null,
              "args": null,
              "concreteType": "AppPermissions",
              "plural": false,
              "selections": [
                v0,
                v1,
                v2,
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "WEB_REQUEST",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "WebRequestGrants",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "granted",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "denied",
                      "args": null,
                      "storageKey": null
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = '7dffcb6046a3ee3d78f9e411d7f2a8c9';
module.exports = node;
