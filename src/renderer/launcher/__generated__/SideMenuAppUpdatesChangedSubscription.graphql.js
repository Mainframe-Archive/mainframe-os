/**
 * @flow
 * @relayHash c0ea4b1e861f3127614ae9368fb05af3
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
  "fragment": {
    "kind": "Fragment",
    "name": "SideMenuAppUpdatesChangedSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "SideMenuAppUpdatesChangedSubscription",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "subscription",
    "name": "SideMenuAppUpdatesChangedSubscription",
    "id": null,
    "text": "subscription SideMenuAppUpdatesChangedSubscription {\n  appUpdatesChanged {\n    appUpdatesCount\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '72eba2192a17a1f94f79a52da1596ef5';
module.exports = node;
