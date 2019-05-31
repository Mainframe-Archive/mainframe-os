/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type AppItem_ownApp$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type OwnAppsScreen_devtools$ref: FragmentReference;
export type OwnAppsScreen_devtools = {|
  +apps: $ReadOnlyArray<{|
    +localID: string,
    +$fragmentRefs: AppItem_ownApp$ref,
  |}>,
  +$refType: OwnAppsScreen_devtools$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "OwnAppsScreen_devtools",
  "type": "Devtools",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "developerID",
      "type": "ID",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "apps",
      "storageKey": null,
      "args": [
        {
          "kind": "Variable",
          "name": "developerID",
          "variableName": "developerID",
          "type": "ID"
        }
      ],
      "concreteType": "OwnApp",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "AppItem_ownApp",
          "args": null
        },
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
(node/*: any*/).hash = 'da22d1bf20893b44b94cf618ed31a2b1';
module.exports = node;
