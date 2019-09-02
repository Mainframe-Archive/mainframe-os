/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
export type AppInstallationState = "DONE" | "DOWNLOADING" | "FAILED" | "PENDING" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type AppItem_appVersion$ref: FragmentReference;
export type AppItem_appVersion = {|
  +localID: string,
  +installationState: AppInstallationState,
  +app: {|
    +publicID: string
  |},
  +developer: {|
    +localID: string,
    +profile: {|
      +name: ?string
    |},
  |},
  +manifest: {|
    +profile: {|
      +name: ?string
    |}
  |},
  +update: ?{|
    +id: string
  |},
  +$refType: AppItem_appVersion$ref,
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
};
return {
  "kind": "Fragment",
  "name": "AppItem_appVersion",
  "type": "AppVersion",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    v0,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "installationState",
      "args": null,
      "storageKey": null
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
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "developer",
      "storageKey": null,
      "args": null,
      "concreteType": "Developer",
      "plural": false,
      "selections": [
        v0,
        v1
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "manifest",
      "storageKey": null,
      "args": null,
      "concreteType": "AppManifest",
      "plural": false,
      "selections": [
        v1
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "update",
      "storageKey": null,
      "args": null,
      "concreteType": "AppVersion",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = 'aadcb5d5f57caa91b6a5475057c64490';
module.exports = node;
