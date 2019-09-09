/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
export type SystemUpdateStatus = "CHECKING" | "ERROR" | "IDLE" | "NO_UPDATE" | "UPDATE_AVAILABLE" | "UPDATE_DOWNLOADED" | "UPDATE_DOWNLOADING" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type SystemUpdateItem_systemUpdate$ref: FragmentReference;
declare export opaque type SystemUpdateItem_systemUpdate$fragmentType: SystemUpdateItem_systemUpdate$ref;
export type SystemUpdateItem_systemUpdate = {|
  +status: SystemUpdateStatus,
  +currentVersion: string,
  +newVersion: ?string,
  +$refType: SystemUpdateItem_systemUpdate$ref,
|};
export type SystemUpdateItem_systemUpdate$data = SystemUpdateItem_systemUpdate;
export type SystemUpdateItem_systemUpdate$key = {
  +$data?: SystemUpdateItem_systemUpdate$data,
  +$fragmentRefs: SystemUpdateItem_systemUpdate$ref,
};
*/


const node/*: ReaderFragment*/ = {
  "kind": "Fragment",
  "name": "SystemUpdateItem_systemUpdate",
  "type": "SystemUpdate",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "status",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "currentVersion",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "newVersion",
      "args": null,
      "storageKey": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = 'aa3c2b7bd4193184dca477bd4550a37e';
module.exports = node;
