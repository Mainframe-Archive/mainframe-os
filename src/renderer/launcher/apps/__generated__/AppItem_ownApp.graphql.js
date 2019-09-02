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
  +localID: string,
  +publicID: string,
  +developer: {|
    +localID: string,
    +profile: {|
      +name: string
    |},
  |},
  +profile: {|
    +name: string
  |},
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
};
return {
  "kind": "Fragment",
  "name": "AppItem_ownApp",
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
    v1
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e713a67e5c9d8fe2fa75e232bd0c13c9';
module.exports = node;
