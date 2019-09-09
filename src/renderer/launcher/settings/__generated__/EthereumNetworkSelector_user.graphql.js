/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type EthereumNetworkSelector_user$ref: FragmentReference;
declare export opaque type EthereumNetworkSelector_user$fragmentType: EthereumNetworkSelector_user$ref;
export type EthereumNetworkSelector_user = {|
  +ethURL: string,
  +$refType: EthereumNetworkSelector_user$ref,
|};
export type EthereumNetworkSelector_user$data = EthereumNetworkSelector_user;
export type EthereumNetworkSelector_user$key = {
  +$data?: EthereumNetworkSelector_user$data,
  +$fragmentRefs: EthereumNetworkSelector_user$ref,
};
*/


const node/*: ReaderFragment*/ = {
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
