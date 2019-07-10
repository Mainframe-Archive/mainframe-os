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
    +webDomains: $ReadOnlyArray<{|
      +domain: string,
      +internal: ?boolean,
      +external: ?boolean,
    |}>
  |},
  +update: ?{|
    +fromVersion: {|
      +manifest: {|
        +profile: {|
          +name: ?string
        |},
        +version: string,
        +webDomains: $ReadOnlyArray<{|
          +domain: string,
          +internal: ?boolean,
          +external: ?boolean,
        |}>,
      |}
    |},
    +toVersion: {|
      +manifest: {|
        +profile: {|
          +name: ?string
        |},
        +version: string,
        +webDomains: $ReadOnlyArray<{|
          +domain: string,
          +internal: ?boolean,
          +external: ?boolean,
        |}>,
      |}
    |},
    +permissionsChanged: boolean,
  |},
  +$refType: AppUpdateModal_userAppVersion$ref,
|};
*/


const node/*: ConcreteFragment*/ = (function(){
var v0 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "webDomains",
  "storageKey": null,
  "args": null,
  "concreteType": "WebDomainDefinition",
  "plural": true,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "domain",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internal",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "external",
      "args": null,
      "storageKey": null
    }
  ]
},
v1 = [
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
        "kind": "ScalarField",
        "alias": null,
        "name": "version",
        "args": null,
        "storageKey": null
      },
      v0
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
        v0
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
          "selections": v1
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "toVersion",
          "storageKey": null,
          "args": null,
          "concreteType": "AppVersion",
          "plural": false,
          "selections": v1
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
(node/*: any*/).hash = 'acafa4f297ba0ec6414ecbe3c2001c06';
module.exports = node;
