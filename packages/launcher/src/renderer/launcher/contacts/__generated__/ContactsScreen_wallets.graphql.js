/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type ContactsView_wallets$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type ContactsScreen_wallets$ref: FragmentReference;
export type ContactsScreen_wallets = {|
  +$fragmentRefs: ContactsView_wallets$ref,
  +$refType: ContactsScreen_wallets$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "ContactsScreen_wallets",
  "type": "Wallets",
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
      "name": "ContactsView_wallets",
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
(node/*: any*/).hash = 'bd8d4a791ed0c3785c08b14a09128690';
module.exports = node;
