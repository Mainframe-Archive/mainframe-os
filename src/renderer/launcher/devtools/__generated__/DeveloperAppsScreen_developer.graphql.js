/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type AppItem_ownApp$ref = any;
type CreateAppModal_developer$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type DeveloperAppsScreen_developer$ref: FragmentReference;
export type DeveloperAppsScreen_developer = {|
  +apps: $ReadOnlyArray<{|
    +id: string,
    +$fragmentRefs: AppItem_ownApp$ref,
  |}>,
  +$fragmentRefs: CreateAppModal_developer$ref,
  +$refType: DeveloperAppsScreen_developer$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "DeveloperAppsScreen_developer",
  "type": "OwnDeveloper",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "CreateAppModal_developer",
      "args": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "apps",
      "storageKey": null,
      "args": null,
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
          "name": "id",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '1dbb6ff0c835252b015c2a7a09b77dc1';
module.exports = node;
