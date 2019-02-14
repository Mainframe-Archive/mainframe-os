/**
 * @flow
 * @relayHash b28801f5a0dc771895853fa243be8b5c
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ConnectionState = "CONNECTED" | "SENDING" | "SENT" | "%future added value";
export type LauncherContactChangedSubscriptionVariables = {||};
export type LauncherContactChangedSubscriptionResponse = {|
  +contactChanged: {|
    +connectionState: ConnectionState,
    +profile: {|
      +name: ?string,
      +avatar: ?string,
    |},
  |}
|};
export type LauncherContactChangedSubscription = {|
  variables: LauncherContactChangedSubscriptionVariables,
  response: LauncherContactChangedSubscriptionResponse,
|};
*/


/*
subscription LauncherContactChangedSubscription {
  contactChanged {
    connectionState
    profile {
      name
      avatar
    }
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "connectionState",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "profile",
  "storageKey": null,
  "args": null,
  "concreteType": "GenericProfile",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "avatar",
      "args": null,
      "storageKey": null
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "LauncherContactChangedSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "contactChanged",
        "storageKey": null,
        "args": null,
        "concreteType": "Contact",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "LauncherContactChangedSubscription",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "contactChanged",
        "storageKey": null,
        "args": null,
        "concreteType": "Contact",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
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
  },
  "params": {
    "operationKind": "subscription",
    "name": "LauncherContactChangedSubscription",
    "id": null,
    "text": "subscription LauncherContactChangedSubscription {\n  contactChanged {\n    connectionState\n    profile {\n      name\n      avatar\n    }\n    id\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '39b178e29579a15f96e59416b67e9cf0';
module.exports = node;
