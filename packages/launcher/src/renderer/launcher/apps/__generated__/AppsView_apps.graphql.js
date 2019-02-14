/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type AppItem_installedApp$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type AppsView_apps$ref: FragmentReference;
export type AppsView_apps = {|
  +installed: ?$ReadOnlyArray<?{|
    +localID: string,
    +$fragmentRefs: AppItem_installedApp$ref,
  |}>,
  +$refType: AppsView_apps$ref,
|};
*/


const node/*: ReaderFragment*/ = {
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
          "kind": "FragmentSpread",
          "name": "AppItem_installedApp",
          "args": null
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '4dbdd4cea318032ed805878c5d991fb2';
module.exports = node;
