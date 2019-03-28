/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type AppUpdateModal_app$ref: FragmentReference;
export type AppUpdateModal_app = {|
  +localID: string,
  +mfid: string,
  +name: string,
  +manifest: {|
    +version: string
  |},
  +update: ?{|
    +manifest: {|
      +permissions: {|
        +optional: {|
          +WEB_REQUEST: ?$ReadOnlyArray<?string>,
          +BLOCKCHAIN_SEND: ?boolean,
        |},
        +required: {|
          +WEB_REQUEST: ?$ReadOnlyArray<?string>,
          +BLOCKCHAIN_SEND: ?boolean,
        |},
      |},
      +version: string,
    |},
    +permissionsChanged: boolean,
  |},
  +users: $ReadOnlyArray<{|
    +localID: string,
    +settings: {|
      +permissionsSettings: {|
        +grants: {|
          +BLOCKCHAIN_SEND: ?boolean,
          +WEB_REQUEST: {|
            +granted: $ReadOnlyArray<string>,
            +denied: $ReadOnlyArray<string>,
          |},
        |}
      |}
    |},
  |}>,
  +$refType: AppUpdateModal_app$ref,
|};
*/


const node/*: ConcreteFragment*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "version",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "BLOCKCHAIN_SEND",
  "args": null,
  "storageKey": null
},
v3 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "WEB_REQUEST",
    "args": null,
    "storageKey": null
  },
  v2
];
return {
  "kind": "Fragment",
  "name": "AppUpdateModal_app",
  "type": "App",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    v0,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "mfid",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "manifest",
      "storageKey": null,
      "args": null,
      "concreteType": "AppManifestData",
      "plural": false,
      "selections": [
        v1
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "update",
      "storageKey": null,
      "args": null,
      "concreteType": "AppUpdateData",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "manifest",
          "storageKey": null,
          "args": null,
          "concreteType": "AppManifestData",
          "plural": false,
          "selections": [
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
            },
            v1
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
      "name": "users",
      "storageKey": null,
      "args": null,
      "concreteType": "AppUser",
      "plural": true,
      "selections": [
        v0,
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "settings",
          "storageKey": null,
          "args": null,
          "concreteType": "AppUserSettings",
          "plural": false,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "permissionsSettings",
              "storageKey": null,
              "args": null,
              "concreteType": "AppPermissionsSettings",
              "plural": false,
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "grants",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "AppPermissions",
                  "plural": false,
                  "selections": [
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
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = 'fe6b6569666232747b6ba6e163eb2fcf';
module.exports = node;
