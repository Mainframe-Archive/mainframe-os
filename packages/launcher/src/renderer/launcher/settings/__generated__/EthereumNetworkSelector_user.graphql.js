/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type EthereumNetworkSelector_user$ref: FragmentReference;
export type EthereumNetworkSelector_user = {|
  +ethURL: string,
  +$refType: EthereumNetworkSelector_user$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "EthereumNetworkSelector_user",
  "type": "User",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "ethURL",
      "args": null,
      "storageKey": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '197660eb4321faed11f3316017a1b5aa';
module.exports = node;
