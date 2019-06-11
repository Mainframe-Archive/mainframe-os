/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type AppUpdateModal_userAppVersion$ref: FragmentReference;
export type AppUpdateModal_userAppVersion = {|
  +localID: string,
  +settings: {|
    +permissionsGrants: {|
      +CONTACT_COMMUNICATION: ?boolean,
      +CONTACT_LIST: ?boolean,
      +ETHEREUM_TRANSACTION: ?boolean,
      +WEB_REQUEST: {|
        +granted: $ReadOnlyArray<string>,
        +denied: $ReadOnlyArray<string>,
      |},
    |}
  |},
  +update: ?{|
    +fromVersion: {|
      +manifest: {|
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
        +profile: {|
          +name: ?string
        |},
        +version: string,
      |}
    |},
    +toVersion: {|
      +manifest: {|
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
        +profile: {|
          +name: ?string
        |},
        +version: string,
      |}
    |},
    +permissionsChanged: boolean,
  |},
  +$refType: AppUpdateModal_userAppVersion$ref,
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
],
v4 = [
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
        "kind": "ScalarField",
        "alias": null,
        "name": "version",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Fragment",
  "name": "AppUpdateModal_userAppVersion",
  "type": "UserAppVersion",
  "metadata": null,
  "argumentDefinitions": [],
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
      "name": "settings",
      "storageKey": null,
      "args": null,
      "concreteType": "UserAppSettings",
      "plural": false,
      "selections": [
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
          "name": "fromVersion",
          "storageKey": null,
          "args": null,
          "concreteType": "AppVersion",
          "plural": false,
          "selections": v4
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "toVersion",
          "storageKey": null,
          "args": null,
          "concreteType": "AppVersion",
          "plural": false,
          "selections": v4
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "permissionsChanged",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = 'b893896ab294af772ea6db85e073ce8d';
module.exports = node;
