/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type WalletsView_wallets$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type WalletsScreen_wallets$ref: FragmentReference;
export type WalletsScreen_wallets = {|
  +$fragmentRefs: WalletsView_wallets$ref,
  +$refType: WalletsScreen_wallets$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "WalletsScreen_wallets",
  "type": "WalletsQuery",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "WalletsView_wallets",
      "args": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '70571484ea10632e22ecf7ed13d758ef';
module.exports = node;
