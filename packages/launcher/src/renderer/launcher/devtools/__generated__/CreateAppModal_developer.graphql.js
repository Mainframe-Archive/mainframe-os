/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type CreateAppModal_developer$ref: FragmentReference;
export type CreateAppModal_developer = {|
  +localID: string,
  +$refType: CreateAppModal_developer$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
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
