/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type AppItem_installedApp$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type AppsView_apps$ref: FragmentReference;
export type AppsView_apps = {|
  +installed: $ReadOnlyArray<{|
    +localID: string,
    +mfid: string,
    +$fragmentRefs: AppItem_installedApp$ref,
  |}>,
  +$refType: AppsView_apps$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "AppsView_apps",
  "type": "Apps",
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
        {
          "kind": "FragmentSpread",
          "name": "AppItem_installedApp",
          "args": null
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '7661eb0f3d5284a8cabcc6505a72449f';
module.exports = node;
