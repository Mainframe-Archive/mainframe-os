/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type SettingsScreen_settings$ref: FragmentReference;
export type SettingsScreen_settings = {|
  +ethereumUrl: string,
  +$refType: SettingsScreen_settings$ref,
|};
*/


const node/*: ReaderFragment*/ = {
  "kind": "Fragment",
  "name": "SettingsScreen_settings",
  "type": "Settings",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "ethereumUrl",
      "args": null,
      "storageKey": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = 'd921d10e4e298115da9cd62a37028c2d';
module.exports = node;
