/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type OwnAppDetailView_ownApp$ref: FragmentReference;
export type OwnAppDetailView_ownApp = {|
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
        +WEB_REQUEST: ?$ReadOnlyArray<?string>,
        +BLOCKCHAIN_SEND: ?boolean,
        +COMMS_CONTACT: ?boolean,
        +CONTACTS_READ: ?boolean,
      |},
      +required: {|
        +WEB_REQUEST: ?$ReadOnlyArray<?string>,
        +BLOCKCHAIN_SEND: ?boolean,
        +COMMS_CONTACT: ?boolean,
        +CONTACTS_READ: ?boolean,
      |},
    |},
  |},
  +latestPublishedVersion: ?{|
    +version: string
  |},
  +$refType: OwnAppDetailView_ownApp$ref,
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
    "name": "WEB_REQUEST",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "BLOCKCHAIN_SEND",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "COMMS_CONTACT",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "CONTACTS_READ",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "OwnAppDetailView_ownApp",
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
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = 'b9371e6acec0a70370669abcf3ec2967';
module.exports = node;
