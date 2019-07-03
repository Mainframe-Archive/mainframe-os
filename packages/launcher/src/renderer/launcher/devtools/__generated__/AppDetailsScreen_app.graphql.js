/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type AppDetailsScreen_app$ref: FragmentReference;
export type AppDetailsScreen_app = {|
  +localID: string,
  +publicID: string,
  +profile: {|
    +name: string
  |},
  +contentsPath: string,
  +developer: {|
    +localID: string,
    +profile: {|
      +name: string
    |},
  |},
  +inProgressVersion: ?{|
    +version: string,
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
  +latestPublishedVersion: ?{|
    +version: string
  |},
  +viewerOwnAppID: string,
  +$refType: AppDetailsScreen_app$ref,
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
  "kind": "LinkedField",
  "alias": null,
  "name": "profile",
  "storageKey": null,
  "args": null,
  "concreteType": "NamedProfile",
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
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "version",
  "args": null,
  "storageKey": null
},
v3 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "CONTACT_COMMUNICATION",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "CONTACT_LIST",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "ETHEREUM_TRANSACTION",
    "args": null,
    "storageKey": null
  },
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
  "name": "AppDetailsScreen_app",
  "type": "OwnApp",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    v0,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "publicID",
      "args": null,
      "storageKey": null
    },
    v1,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "contentsPath",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "developer",
      "storageKey": null,
      "args": null,
      "concreteType": "OwnDeveloper",
      "plural": false,
      "selections": [
        v0,
        v1
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "inProgressVersion",
      "storageKey": null,
      "args": null,
      "concreteType": "OwnAppVersion",
      "plural": false,
      "selections": [
        v2,
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
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "latestPublishedVersion",
      "storageKey": null,
      "args": null,
      "concreteType": "OwnAppVersion",
      "plural": false,
      "selections": [
        v2
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "viewerOwnAppID",
      "args": null,
      "storageKey": null
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = '7d3885712fa2ec0adf3f11a56a46a505';
module.exports = node;
