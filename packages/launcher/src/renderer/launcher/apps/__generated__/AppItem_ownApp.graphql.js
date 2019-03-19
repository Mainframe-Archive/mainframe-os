/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type AppItem_ownApp$ref: FragmentReference;
export type AppItem_ownApp = {|
  +mfid: string,
  +localID: string,
  +name: string,
  +developer: {|
    +id: ?string,
    +name: ?string,
  |},
  +versions: $ReadOnlyArray<{|
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
  +users: $ReadOnlyArray<{|
    +localID: string,
    +identity: {|
      +profile: {|
        +name: string
      |}
    |},
  |}>,
  +$refType: AppItem_ownApp$ref,
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
  "name": "name",
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
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "BLOCKCHAIN_SEND",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "AppItem_ownApp",
  "type": "OwnApp",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "mfid",
      "args": null,
      "storageKey": null
    },
    v0,
    v1,
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
        v1
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
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "version",
          "args": null,
          "storageKey": null
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
                v1
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
(node/*: any*/).hash = 'c84c3ce8b985baca40e1282ee4e29fe7';
module.exports = node;
