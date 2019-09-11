/**
 * @flow
 * @relayHash bb5895d90400d815bc6fbd13fcdddd04
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type HomeRouterContactRequestsChangedSubscriptionVariables = {||};
export type HomeRouterContactRequestsChangedSubscriptionResponse = {|
  +contactRequestsChanged: {|
    +viewer: {|
      +contactRequests: $ReadOnlyArray<{|
        +localID: string
      |}>
    |}
  |}
|};
export type HomeRouterContactRequestsChangedSubscription = {|
  variables: HomeRouterContactRequestsChangedSubscriptionVariables,
  response: HomeRouterContactRequestsChangedSubscriptionResponse,
|};
*/


/*
subscription HomeRouterContactRequestsChangedSubscription {
  contactRequestsChanged {
    viewer {
      contactRequests {
        localID
        id
      }
      id
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "HomeRouterContactRequestsChangedSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "contactRequestsChanged",
        "storageKey": null,
        "args": null,
        "concreteType": "ContactRequestsChangedPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "User",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "contactRequests",
                "storageKey": null,
                "args": null,
                "concreteType": "ContactRequest",
                "plural": true,
                "selections": [
                  (v0/*: any*/)
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "HomeRouterContactRequestsChangedSubscription",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "contactRequestsChanged",
        "storageKey": null,
        "args": null,
        "concreteType": "ContactRequestsChangedPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "User",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "contactRequests",
                "storageKey": null,
                "args": null,
                "concreteType": "ContactRequest",
                "plural": true,
                "selections": [
                  (v0/*: any*/),
                  (v1/*: any*/)
                ]
              },
              (v1/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "subscription",
    "name": "HomeRouterContactRequestsChangedSubscription",
    "id": null,
    "text": "subscription HomeRouterContactRequestsChangedSubscription {\n  contactRequestsChanged {\n    viewer {\n      contactRequests {\n        localID\n        id\n      }\n      id\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '9d1fd801d24cbd8c3c66ceef0401761f';
module.exports = node;
