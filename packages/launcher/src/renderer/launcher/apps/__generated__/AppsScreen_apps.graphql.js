/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type AppsView_apps$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type AppsScreen_apps$ref: FragmentReference;
export type AppsScreen_apps = {|
  +$fragmentRefs: AppsView_apps$ref,
  +$refType: AppsScreen_apps$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "AppsScreen_apps",
  "type": "AppsQuery",
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
(node/*: any*/).hash = 'e2342f3cf34c8589001c99fc64c312e9';
module.exports = node;
