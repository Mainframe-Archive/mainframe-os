/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type AppItem_ownApp$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type OwnAppsView_apps$ref: FragmentReference;
export type OwnAppsView_apps = {|
  +own: ?$ReadOnlyArray<?{|
    +localID: string,
    +name: string,
    +$fragmentRefs: AppItem_ownApp$ref,
  |}>,
  +$refType: OwnAppsView_apps$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "OwnAppsView_apps",
  "type": "Apps",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "own",
      "storageKey": null,
      "args": null,
      "concreteType": "OwnApp",
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
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "FragmentSpread",
          "name": "AppItem_ownApp",
          "args": null
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = 'f5a932332e3cb274ae6e1bdd3d04ebd2';
module.exports = node;
