/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type AppItem_installedApp$ref = any;
type AppItem_ownApp$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type AppsView_apps$ref: FragmentReference;
export type AppsView_apps = {|
  +installed: ?$ReadOnlyArray<?{|
    +localID: string,
    +$fragmentRefs: AppItem_installedApp$ref,
  |}>,
  +own: ?$ReadOnlyArray<?{|
    +localID: string,
    +$fragmentRefs: AppItem_ownApp$ref,
  |}>,
  +$refType: AppsView_apps$ref,
|};
*/


const node/*: ConcreteFragment*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "AppsView_apps",
  "type": "AppsQuery",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "installed",
      "storageKey": null,
      "args": null,
      "concreteType": "App",
      "plural": true,
      "selections": [
        v0,
        {
          "kind": "FragmentSpread",
          "name": "AppItem_installedApp",
          "args": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "own",
      "storageKey": null,
      "args": null,
      "concreteType": "OwnApp",
      "plural": true,
      "selections": [
        v0,
        {
          "kind": "FragmentSpread",
          "name": "AppItem_ownApp",
          "args": null
        }
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = 'b7e985623e76c700c85962aa2cfc8991';
module.exports = node;
