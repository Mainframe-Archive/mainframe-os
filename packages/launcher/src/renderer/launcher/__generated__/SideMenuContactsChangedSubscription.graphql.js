/**
 * @flow
 * @relayHash e22a839021d602a5981ce3e19f27c73b
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type SideMenuContactsChangedSubscriptionVariables = {|
  userID: string
|};
export type SideMenuContactsChangedSubscriptionResponse = {|
  +contactsChanged: {|
    +viewer: {|
      +contacts: {|
        +invitesCount: number
      |}
    |}
  |}
|};
export type SideMenuContactsChangedSubscription = {|
  variables: SideMenuContactsChangedSubscriptionVariables,
  response: SideMenuContactsChangedSubscriptionResponse,
|};
*/


/*
subscription SideMenuContactsChangedSubscription(
  $userID: String!
) {
  contactsChanged {
    viewer {
      contacts {
        invitesCount(userID: $userID)
      }
      id
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "userID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "contacts",
  "storageKey": null,
  "args": null,
  "concreteType": "Contacts",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "invitesCount",
      "args": [
        {
          "kind": "Variable",
          "name": "userID",
          "variableName": "userID",
          "type": "String!"
        }
      ],
      "storageKey": null
    }
  ]
};
return {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "SideMenuContactsChangedSubscription",
  "id": null,
  "text": "subscription SideMenuContactsChangedSubscription(\n  $userID: String!\n) {\n  contactsChanged {\n    viewer {\n      contacts {\n        invitesCount(userID: $userID)\n      }\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "SideMenuContactsChangedSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
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
            "concreteType": "Viewer",
            "plural": false,
            "selections": [
              v1
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SideMenuContactsChangedSubscription",
    "argumentDefinitions": v0,
    "selections": [
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
            "concreteType": "Viewer",
            "plural": false,
            "selections": [
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
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '091a216ce99908530a9eca1b3749a4a5';
module.exports = node;
