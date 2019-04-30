/**
 * @flow
 * @relayHash 9f5db1e4fc6799b459ad082e0cc86921
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type SideMenuContactsChangedSubscriptionVariables = {||};
export type SideMenuContactsChangedSubscriptionResponse = {|
  +contactsChanged: {|
    +viewer: {|
      +id: string
    |}
  |}
|};
export type SideMenuContactsChangedSubscription = {|
  variables: SideMenuContactsChangedSubscriptionVariables,
  response: SideMenuContactsChangedSubscriptionResponse,
|};
*/


/*
subscription SideMenuContactsChangedSubscription {
  contactsChanged {
    viewer {
      id
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "contactsChanged",
    "storageKey": null,
    "args": null,
    "concreteType": "ContactChangedPayload",
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
];
return {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "SideMenuContactsChangedSubscription",
  "id": null,
  "text": "subscription SideMenuContactsChangedSubscription {\n  contactsChanged {\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "SideMenuContactsChangedSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": v0
  },
  "operation": {
    "kind": "Operation",
    "name": "SideMenuContactsChangedSubscription",
    "argumentDefinitions": [],
    "selections": v0
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '74c0ab639cd8095b42e87d0d8f3860c6';
module.exports = node;
