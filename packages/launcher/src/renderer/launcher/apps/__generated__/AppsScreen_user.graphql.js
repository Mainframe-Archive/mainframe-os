/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type AppItem_appVersion$ref = any;
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
      +installationState: AppInstallationState,
      +manifest: {|
        +profile: {|
          +name: ?string
        |},
        +webDomains: $ReadOnlyArray<{|
          +domain: string,
          +internal: ?boolean,
          +external: ?boolean,
        |}>,
      |},
      +$fragmentRefs: AppItem_appVersion$ref,
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
      +webDomains: $ReadOnlyArray<{|
        +domain: string,
        +internal: ?boolean,
        +external: ?boolean,
      |}>,
    |},
  |}>,
  +$refType: AppsScreen_user$ref,
|};
*/


const node/*: ConcreteFragment*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "installationState",
  "args": null,
  "storageKey": null
},
v1 = {
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
};
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
              "kind": "FragmentSpread",
              "name": "AppItem_appVersion",
              "args": null
            },
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
            v0,
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
                v1
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
                v0,
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
            v1
          ]
        }
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = '235f2f7b2f027a465753568a012fa68b';
module.exports = node;
