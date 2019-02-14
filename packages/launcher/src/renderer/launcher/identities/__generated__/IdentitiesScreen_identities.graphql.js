/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type IdentitiesView_identities$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type IdentitiesScreen_identities$ref: FragmentReference;
export type IdentitiesScreen_identities = {|
  +$fragmentRefs: IdentitiesView_identities$ref,
  +$refType: IdentitiesScreen_identities$ref,
|};
*/


const node/*: ReaderFragment*/ = {
  "kind": "Fragment",
  "name": "IdentitiesScreen_identities",
  "type": "Identities",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "IdentitiesView_identities",
      "args": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '636dcae4cb62af26f3fc20fa6a477925';
module.exports = node;
