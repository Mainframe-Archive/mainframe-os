/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type AppItem_ownApp$ref = any;
type CreateAppModal_developer$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type DeveloperAppsScreen_developer$ref: FragmentReference;
declare export opaque type DeveloperAppsScreen_developer$fragmentType: DeveloperAppsScreen_developer$ref;
export type DeveloperAppsScreen_developer = {|
  +apps: $ReadOnlyArray<{|
    +id: string,
    +$fragmentRefs: AppItem_ownApp$ref,
  |}>,
  +$fragmentRefs: CreateAppModal_developer$ref,
  +$refType: DeveloperAppsScreen_developer$ref,
|};
export type DeveloperAppsScreen_developer$data = DeveloperAppsScreen_developer;
export type DeveloperAppsScreen_developer$key = {
  +$data?: DeveloperAppsScreen_developer$data,
  +$fragmentRefs: DeveloperAppsScreen_developer$ref,
};
*/


const node/*: ReaderFragment*/ = {
  "kind": "Fragment",
  "name": "DeveloperAppsScreen_developer",
  "type": "OwnDeveloper",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "FragmentSpread",
          "name": "AppItem_ownApp",
          "args": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "CreateAppModal_developer",
      "args": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '1dbb6ff0c835252b015c2a7a09b77dc1';
module.exports = node;
