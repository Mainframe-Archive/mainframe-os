/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type AppsView_user$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type AppsScreen_user$ref: FragmentReference;
export type AppsScreen_user = {|
  +$fragmentRefs: AppsView_user$ref,
  +$refType: AppsScreen_user$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "AppsScreen_user",
  "type": "User",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "AppsView_user",
      "args": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = 'db635a585f8c1f354a9d1588c5875ca2';
module.exports = node;
