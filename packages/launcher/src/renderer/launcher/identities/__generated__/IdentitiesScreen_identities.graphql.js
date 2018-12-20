/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type IdentitiesView_identities$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type IdentitiesScreen_identities$ref: FragmentReference;
export type IdentitiesScreen_identities = {|
  +$fragmentRefs: IdentitiesView_identities$ref,
  +$refType: IdentitiesScreen_identities$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "IdentitiesScreen_identities",
  "type": "IdentitiesQuery",
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
(node/*: any*/).hash = '3c803c7e306a17d3f84a52eb37b4f956';
module.exports = node;
