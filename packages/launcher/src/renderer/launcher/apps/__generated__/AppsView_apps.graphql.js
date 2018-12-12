/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type AppsView_apps$ref: FragmentReference;
export type AppsView_apps = {|
  +installed: ?$ReadOnlyArray<?{|
    +appID: string,
    +name: string,
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
    +users: ?$ReadOnlyArray<?{|
      +localID: string,
      +identity: {|
        +profile: ?{|
          +name: string
        |}
      |},
      +settings: {|
        +permissionsSettings: {|
          +permissionsChecked: boolean,
          +grants: {|
            +BLOCKCHAIN_SEND: ?boolean,
            +WEB_REQUEST: ?$ReadOnlyArray<?string>,
          |},
        |}
      |},
    |}>,
  |}>,
  +own: ?$ReadOnlyArray<?{|
    +appID: string,
    +name: string,
    +versions: ?$ReadOnlyArray<?{|
      +version: string,
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
    |}>,
    +users: ?$ReadOnlyArray<?{|
      +localID: string,
      +identity: {|
        +profile: ?{|
          +name: string
        |}
      |},
    |}>,
  |}>,
  +$refType: AppsView_apps$ref,
|};
*/


const node/*: ConcreteFragment*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "appID",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "WEB_REQUEST",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "BLOCKCHAIN_SEND",
  "args": null,
  "storageKey": null
},
v4 = [
  v2,
  v3
],
v5 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "permissions",
  "storageKey": null,
  "args": null,
  "concreteType": "AppRequestedPermissions",
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
      "selections": v4
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "required",
      "storageKey": null,
      "args": null,
      "concreteType": "AppPermissionDefinitions",
      "plural": false,
      "selections": v4
    }
  ]
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v7 = {
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
      "concreteType": "OwnUserProfile",
      "plural": false,
      "selections": [
        v1
      ]
    }
  ]
};
return {
  "kind": "Fragment",
  "name": "AppsView_apps",
  "type": "AppsQuery",
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
        v0,
        v1,
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "manifest",
          "storageKey": null,
          "args": null,
          "concreteType": "AppManifestData",
          "plural": false,
          "selections": [
            v5
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
            v6,
            v7,
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
                        v3,
                        v2
                      ]
                    }
                  ]
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
      "name": "own",
      "storageKey": null,
      "args": null,
      "concreteType": "OwnApp",
      "plural": true,
      "selections": [
        v0,
        v1,
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "versions",
          "storageKey": null,
          "args": null,
          "concreteType": "AppVersionData",
          "plural": true,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "version",
              "args": null,
              "storageKey": null
            },
            v5
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
            v6,
            v7
          ]
        }
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = '4b815928bfe9a030a7dcdcbdcf263bf9';
module.exports = node;
