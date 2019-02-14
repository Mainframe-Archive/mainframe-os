/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type WalletsView_wallets$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type WalletsScreen_wallets$ref: FragmentReference;
export type WalletsScreen_wallets = {|
  +$fragmentRefs: WalletsView_wallets$ref,
  +$refType: WalletsScreen_wallets$ref,
|};
*/


const node/*: ReaderFragment*/ = {
  "kind": "Fragment",
  "name": "WalletsScreen_wallets",
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
      "name": "WalletsView_wallets",
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
(node/*: any*/).hash = 'f7d69fbf2bbfe9f24d17213aaba27daa';
module.exports = node;
