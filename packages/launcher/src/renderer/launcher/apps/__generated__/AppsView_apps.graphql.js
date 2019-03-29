/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type AppItem_installedApp$ref = any;
type AppUpdateModal_app$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type AppsView_apps$ref: FragmentReference;
export type AppsView_apps = {|
  +installed: $ReadOnlyArray<{|
    +localID: string,
    +mfid: string,
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
      |}
    |},
    +name: string,
    +users: $ReadOnlyArray<{|
      +localID: string,
      +identity: {|
        +profile: {|
          +name: string
        |}
      |},
      +settings: {|
        +permissionsSettings: {|
          +permissionsChecked: boolean,
          +grants: {|
            +BLOCKCHAIN_SEND: ?boolean,
            +WEB_REQUEST: {|
              +granted: $ReadOnlyArray<string>,
              +denied: $ReadOnlyArray<string>,
            |},
          |},
        |}
      |},
    |}>,
    +$fragmentRefs: AppItem_installedApp$ref & AppUpdateModal_app$ref,
  |}>,
  +$refType: AppsView_apps$ref,
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
  "name": "BLOCKCHAIN_SEND",
  "args": null,
  "storageKey": null
},
v2 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "WEB_REQUEST",
    "args": null,
    "storageKey": null
  },
  v1
],
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "AppsView_apps",
  "type": "Apps",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "installed",
      "storageKey": null,
      "args": null,
      "concreteType": "App",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "AppItem_installedApp",
          "args": null
        },
        {
          "kind": "FragmentSpread",
          "name": "AppUpdateModal_app",
          "args": null
        },
        v0,
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "mfid",
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
                  "selections": v2
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "required",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "AppPermissionDefinitions",
                  "plural": false,
                  "selections": v2
                }
              ]
            }
          ]
        },
        v3,
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
              "name": "identity",
              "storageKey": null,
              "args": null,
              "concreteType": "OwnUserIdentity",
              "plural": false,
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "profile",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "NamedProfile",
                  "plural": false,
                  "selections": [
                    v3
                  ]
                }
              ]
            },
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
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "permissionsChecked",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "grants",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "AppPermissions",
                      "plural": false,
                      "selections": [
                        v1,
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
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = '207b4da4256dd78fadc7cf521c3ff9f2';
module.exports = node;
