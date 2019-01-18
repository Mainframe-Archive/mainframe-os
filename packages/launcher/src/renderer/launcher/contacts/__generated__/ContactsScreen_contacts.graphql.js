/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type ContactsView_contacts$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type ContactsScreen_contacts$ref: FragmentReference;
export type ContactsScreen_contacts = {|
  +$fragmentRefs: ContactsView_contacts$ref,
  +$refType: ContactsScreen_contacts$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "ContactsScreen_contacts",
  "type": "ContactsQuery",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "userID",
      "type": "String!",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "ContactsView_contacts",
      "args": [
        {
          "kind": "Variable",
          "name": "userID",
          "variableName": "userID",
          "type": null
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '165bae5c9c5f21cf5a4854d74ba469fb';
module.exports = node;
