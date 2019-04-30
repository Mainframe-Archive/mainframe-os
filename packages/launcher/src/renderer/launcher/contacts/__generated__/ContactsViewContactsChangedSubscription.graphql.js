/**
 * @flow
 * @relayHash 7d7980f0117ce5e4217bf2388e62b0de
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ContactsViewContactsChangedSubscriptionVariables = {||};
export type ContactsViewContactsChangedSubscriptionResponse = {|
  +contactsChanged: {|
    +viewer: {|
      +id: string
    |}
  |}
|};
export type ContactsViewContactsChangedSubscription = {|
  variables: ContactsViewContactsChangedSubscriptionVariables,
  response: ContactsViewContactsChangedSubscriptionResponse,
|};
*/


/*
subscription ContactsViewContactsChangedSubscription {
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
  "name": "ContactsViewContactsChangedSubscription",
  "id": null,
  "text": "subscription ContactsViewContactsChangedSubscription {\n  contactsChanged {\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ContactsViewContactsChangedSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": v0
  },
  "operation": {
    "kind": "Operation",
    "name": "ContactsViewContactsChangedSubscription",
    "argumentDefinitions": [],
    "selections": v0
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '5fb1c250e7c4f2fe64250faed757563c';
module.exports = node;
