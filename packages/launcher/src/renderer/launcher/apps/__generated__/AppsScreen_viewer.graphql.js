/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type AppsView_viewer$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type AppsScreen_viewer$ref: FragmentReference;
export type AppsScreen_viewer = {|
  +$fragmentRefs: AppsView_viewer$ref,
  +$refType: AppsScreen_viewer$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "AppsScreen_viewer",
  "type": "Viewer",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "AppsView_viewer",
      "args": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '575a68c185176ecdc209b30733eb35d3';
module.exports = node;
