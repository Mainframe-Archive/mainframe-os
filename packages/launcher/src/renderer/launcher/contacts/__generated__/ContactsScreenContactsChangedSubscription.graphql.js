/**
 * @flow
 * @relayHash 682e18fef4058979756e6e79175b84ec
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ContactsScreenContactsChangedSubscriptionVariables = {||};
export type ContactsScreenContactsChangedSubscriptionResponse = {|
  +contactsChanged: {|
    +viewer: {|
      +id: string
    |}
  |}
|};
export type ContactsScreenContactsChangedSubscription = {|
  variables: ContactsScreenContactsChangedSubscriptionVariables,
  response: ContactsScreenContactsChangedSubscriptionResponse,
|};
*/


/*
subscription ContactsScreenContactsChangedSubscription {
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
  "name": "ContactsScreenContactsChangedSubscription",
  "id": null,
  "text": "subscription ContactsScreenContactsChangedSubscription {\n  contactsChanged {\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ContactsScreenContactsChangedSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": v0
  },
  "operation": {
    "kind": "Operation",
    "name": "ContactsScreenContactsChangedSubscription",
    "argumentDefinitions": [],
    "selections": v0
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '3d975d9d6774f4046e8ca5ea226419dd';
module.exports = node;
