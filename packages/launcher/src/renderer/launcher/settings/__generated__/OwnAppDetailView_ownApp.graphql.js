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
  +mfid: string,
  +name: string,
  +contentsPath: string,
  +updateFeedHash: string,
  +developer: {|
    +id: ?string,
    +name: ?string,
  |},
  +currentVersionData: {|
    +version: string,
    +versionHash: ?string,
  |},
  +versions: $ReadOnlyArray<{|
    +version: string,
    +versionHash: ?string,
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
  |}>,
  +$refType: OwnAppDetailView_ownApp$ref,
|};
*/


const node/*: ConcreteFragment*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
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
  "name": "versionHash",
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
      "name": "mfid",
      "args": null,
      "storageKey": null
    },
    v0,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "contentsPath",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "updateFeedHash",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "developer",
      "storageKey": null,
      "args": null,
      "concreteType": "AppAuthor",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
          "args": null,
          "storageKey": null
        },
        v0
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "currentVersionData",
      "storageKey": null,
      "args": null,
      "concreteType": "AppVersionData",
      "plural": false,
      "selections": [
        v1,
        v2
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "versions",
      "storageKey": null,
      "args": null,
      "concreteType": "AppVersionData",
      "plural": true,
      "selections": [
        v1,
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
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = '114ea8f34c7705ac2c70128b16fb5624';
module.exports = node;
