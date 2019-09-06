/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type CreateAppModal_developer$ref: FragmentReference;
declare export opaque type CreateAppModal_developer$fragmentType: CreateAppModal_developer$ref;
export type CreateAppModal_developer = {|
  +localID: string,
  +$refType: CreateAppModal_developer$ref,
|};
export type CreateAppModal_developer$data = CreateAppModal_developer;
export type CreateAppModal_developer$key = {
  +$data?: CreateAppModal_developer$data,
  +$fragmentRefs: CreateAppModal_developer$ref,
};
*/


const node/*: ReaderFragment*/ = {
  "kind": "Fragment",
  "name": "CreateAppModal_developer",
  "type": "OwnDeveloper",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "localID",
      "args": null,
      "storageKey": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '2ecfe9018e21bbfbb923b33de06a860c';
module.exports = node;
