/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type ContactsView_identities$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type ContactsScreen_identities$ref: FragmentReference;
export type ContactsScreen_identities = {|
  +$fragmentRefs: ContactsView_identities$ref,
  +$refType: ContactsScreen_identities$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "ContactsScreen_identities",
  "type": "Identities",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "ContactsView_identities",
      "args": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '46bcf1378df83012427dd01d1427ec66';
module.exports = node;
