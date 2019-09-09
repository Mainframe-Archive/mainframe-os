/**
 * @flow
 * @relayHash f07dcd290664a7bceba70b8f718d471b
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type SystemUpdateStatus = "CHECKING" | "ERROR" | "IDLE" | "NO_UPDATE" | "UPDATE_AVAILABLE" | "UPDATE_DOWNLOADED" | "UPDATE_DOWNLOADING" | "%future added value";
export type HomeRouterSystemUpdateChangedSubscriptionVariables = {||};
export type HomeRouterSystemUpdateChangedSubscriptionResponse = {|
  +systemUpdateChanged: {|
    +systemUpdate: {|
      +status: SystemUpdateStatus
    |}
  |}
|};
export type HomeRouterSystemUpdateChangedSubscription = {|
  variables: HomeRouterSystemUpdateChangedSubscriptionVariables,
  response: HomeRouterSystemUpdateChangedSubscriptionResponse,
|};
*/


/*
subscription HomeRouterSystemUpdateChangedSubscription {
  systemUpdateChanged {
    systemUpdate {
      status
      id
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "status",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "HomeRouterSystemUpdateChangedSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "systemUpdateChanged",
        "storageKey": null,
        "args": null,
        "concreteType": "SystemUpdateChangedPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "systemUpdate",
            "storageKey": null,
            "args": null,
            "concreteType": "SystemUpdate",
            "plural": false,
            "selections": [
              (v0/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "HomeRouterSystemUpdateChangedSubscription",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "systemUpdateChanged",
        "storageKey": null,
        "args": null,
        "concreteType": "SystemUpdateChangedPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "systemUpdate",
            "storageKey": null,
            "args": null,
            "concreteType": "SystemUpdate",
            "plural": false,
            "selections": [
              (v0/*: any*/),
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
      }
    ]
  },
  "params": {
    "operationKind": "subscription",
    "name": "HomeRouterSystemUpdateChangedSubscription",
    "id": null,
    "text": "subscription HomeRouterSystemUpdateChangedSubscription {\n  systemUpdateChanged {\n    systemUpdate {\n      status\n      id\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'ce6a54f0dc8f263e9824730d1f0dbb8e';
module.exports = node;
