/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type SideMenu_contacts$ref: FragmentReference;
export type SideMenu_contacts = {|
  +invitesCount: number,
  +$refType: SideMenu_contacts$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "SideMenu_contacts",
  "type": "Contacts",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "invitesCount",
      "args": [
        {
          "kind": "Variable",
          "name": "userID",
          "variableName": "userID",
          "type": "String!"
        }
      ],
      "storageKey": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = 'eae6b9060734dac66489dffde2ae746a';
module.exports = node;
