/**
 * @flow
 * @relayHash 44a5a71c35bece17b7a2838c25bfc184
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type HomeRouterAppUpdatesChangedSubscriptionVariables = {||};
export type HomeRouterAppUpdatesChangedSubscriptionResponse = {|
  +appUpdatesChanged: {|
    +appUpdatesCount: number
  |}
|};
export type HomeRouterAppUpdatesChangedSubscription = {|
  variables: HomeRouterAppUpdatesChangedSubscriptionVariables,
  response: HomeRouterAppUpdatesChangedSubscriptionResponse,
|};
*/


/*
subscription HomeRouterAppUpdatesChangedSubscription {
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
  "fragment": {
    "kind": "Fragment",
    "name": "HomeRouterAppUpdatesChangedSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "HomeRouterAppUpdatesChangedSubscription",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "subscription",
    "name": "HomeRouterAppUpdatesChangedSubscription",
    "id": null,
    "text": "subscription HomeRouterAppUpdatesChangedSubscription {\n  appUpdatesChanged {\n    appUpdatesCount\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '90ae801cce63122dc5cdc10d1ebfbeeb';
module.exports = node;
