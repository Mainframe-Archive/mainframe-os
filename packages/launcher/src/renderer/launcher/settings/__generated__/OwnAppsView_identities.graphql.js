/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type OwnAppsView_identities$ref: FragmentReference;
export type OwnAppsView_identities = {|
  +ownDevelopers: $ReadOnlyArray<{|
    +localID: string
  |}>,
  +$refType: OwnAppsView_identities$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "OwnAppsView_identities",
  "type": "Identities",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "ownDevelopers",
      "storageKey": null,
      "args": null,
      "concreteType": "OwnDeveloperIdentity",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "localID",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '0bf3b3581573e2c9706b857292e81496';
module.exports = node;
