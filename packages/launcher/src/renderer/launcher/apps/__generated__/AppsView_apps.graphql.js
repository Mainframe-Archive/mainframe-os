/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type AppItem_installedApp$ref = any;
type AppItem_ownApp$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type AppsView_apps$ref: FragmentReference;
export type AppsView_apps = {|
  +installed: ?$ReadOnlyArray<?{|
    +$fragmentRefs: AppItem_installedApp$ref
  |}>,
  +own: ?$ReadOnlyArray<?{|
    +$fragmentRefs: AppItem_ownApp$ref
  |}>,
  +$refType: AppsView_apps$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
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
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "AppItem_installedApp",
          "args": null
        }
      ]
    },
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
          "kind": "FragmentSpread",
          "name": "AppItem_ownApp",
          "args": null
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '14b0bdf3c2a460fa11844ddb1c152a77';
module.exports = node;
