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
    +webDomains: $ReadOnlyArray<{|
      +domain: string,
      +internal: ?boolean,
      +external: ?boolean,
    |}>,
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
};
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
(node/*: any*/).hash = 'e83439a21c57d5d7c7a0eb5b7005c38c';
module.exports = node;
