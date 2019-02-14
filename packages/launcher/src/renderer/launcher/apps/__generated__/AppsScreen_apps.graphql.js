/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type AppsView_apps$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type AppsScreen_apps$ref: FragmentReference;
export type AppsScreen_apps = {|
  +$fragmentRefs: AppsView_apps$ref,
  +$refType: AppsScreen_apps$ref,
|};
*/


const node/*: ReaderFragment*/ = {
  "kind": "Fragment",
  "name": "AppsScreen_apps",
  "type": "Apps",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "AppsView_apps",
      "args": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '190ab832e765e8fdce0578811f0cb737';
module.exports = node;
