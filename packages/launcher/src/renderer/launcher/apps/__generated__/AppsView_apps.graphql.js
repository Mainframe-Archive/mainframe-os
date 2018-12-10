/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type AppsView_apps$ref: FragmentReference;
export type AppsView_apps = {|
  +installed: ?$ReadOnlyArray<?{|
    +id: string,
    +appID: string,
    +name: string,
    +users: ?$ReadOnlyArray<?{|
      +localId: string,
      +identity: {|
        +profile: ?{|
          +name: string
        |}
      |},
    |}>,
  |}>,
  +own: ?$ReadOnlyArray<?{|
    +id: string,
    +appID: string,
    +name: string,
    +users: ?$ReadOnlyArray<?{|
      +localId: string,
      +identity: {|
        +profile: ?{|
          +name: string
        |}
      |},
    |}>,
  |}>,
  +$refType: AppsView_apps$ref,
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
v1 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "id",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "appID",
    "args": null,
    "storageKey": null
  },
  v0,
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "users",
    "storageKey": null,
    "args": null,
    "concreteType": "AppUser",
    "plural": true,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "localId",
        "args": null,
        "storageKey": null
      },
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
            "concreteType": "OwnUserProfile",
            "plural": false,
            "selections": [
              v0
            ]
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Fragment",
  "name": "AppsView_apps",
  "type": "AppsQuery",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "installed",
      "storageKey": null,
      "args": null,
      "concreteType": "App",
      "plural": true,
      "selections": v1
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "own",
      "storageKey": null,
      "args": null,
      "concreteType": "OwnApp",
      "plural": true,
      "selections": v1
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = '12872efd4bfb86ee3572c1b59977493a';
module.exports = node;
