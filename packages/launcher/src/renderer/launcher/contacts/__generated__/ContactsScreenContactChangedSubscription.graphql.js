/**
 * @flow
 * @relayHash b8088b4dd07bcf92a14c04a4b97075c8
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ContactConnection = "CONNECTED" | "SENT" | "%future added value";
export type ContactsScreenContactChangedSubscriptionVariables = {||};
export type ContactsScreenContactChangedSubscriptionResponse = {|
  +contactChanged: {|
    +connectionState: ContactConnection,
    +profile: {|
      +name: ?string
    |},
  |}
|};
export type ContactsScreenContactChangedSubscription = {|
  variables: ContactsScreenContactChangedSubscriptionVariables,
  response: ContactsScreenContactChangedSubscriptionResponse,
|};
*/


/*
subscription ContactsScreenContactChangedSubscription {
  contactChanged {
    connectionState
    profile {
      name
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
    }
  ]
};
return {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "ContactsScreenContactChangedSubscription",
  "id": null,
  "text": "subscription ContactsScreenContactChangedSubscription {\n  contactChanged {\n    connectionState\n    profile {\n      name\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ContactsScreenContactChangedSubscription",
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
          v0,
          v1
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ContactsScreenContactChangedSubscription",
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
          v0,
          v1,
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
};
})();
// prettier-ignore
(node/*: any*/).hash = '660677dabb02eb8278fb4d58b2625308';
module.exports = node;
