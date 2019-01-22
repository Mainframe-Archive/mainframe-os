/**
 * @flow
 * @relayHash 2a0273cc9810651cb0ede96caec7d6e0
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ContactsScreenContactChangedSubscriptionVariables = {||};
export type ContactsScreenContactChangedSubscriptionResponse = {|
  +contactChanged: {|
    +profile: {|
      +name: string
    |}
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
    profile {
      name
    }
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "profile",
  "storageKey": null,
  "args": null,
  "concreteType": "NamedProfile",
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
  "text": "subscription ContactsScreenContactChangedSubscription {\n  contactChanged {\n    profile {\n      name\n    }\n    id\n  }\n}\n",
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
          v0
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
(node/*: any*/).hash = '485f47046c724f51c1f3820de3f6460f';
module.exports = node;
