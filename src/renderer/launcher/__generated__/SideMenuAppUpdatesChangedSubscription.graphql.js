/**
 * @flow
 * @relayHash 3f99f6f7b172ab43cd5350456e4cb775
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type SideMenuAppUpdatesChangedSubscriptionVariables = {||};
export type SideMenuAppUpdatesChangedSubscriptionResponse = {|
  +appUpdatesChanged: {|
    +appUpdatesCount: number
  |}
|};
export type SideMenuAppUpdatesChangedSubscription = {|
  variables: SideMenuAppUpdatesChangedSubscriptionVariables,
  response: SideMenuAppUpdatesChangedSubscriptionResponse,
|};
*/


/*
subscription SideMenuAppUpdatesChangedSubscription {
  appUpdatesChanged {
    appUpdatesCount
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "appUpdatesChanged",
    "storageKey": null,
    "args": null,
    "concreteType": "AppUpdatesPayload",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "appUpdatesCount",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "SideMenuAppUpdatesChangedSubscription",
  "id": null,
  "text": "subscription SideMenuAppUpdatesChangedSubscription {\n  appUpdatesChanged {\n    appUpdatesCount\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "SideMenuAppUpdatesChangedSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": v0
  },
  "operation": {
    "kind": "Operation",
    "name": "SideMenuAppUpdatesChangedSubscription",
    "argumentDefinitions": [],
    "selections": v0
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '72eba2192a17a1f94f79a52da1596ef5';
module.exports = node;
