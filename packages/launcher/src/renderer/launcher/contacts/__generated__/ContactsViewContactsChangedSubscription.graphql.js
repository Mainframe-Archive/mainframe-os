/**
 * @flow
 * @relayHash 64ab2674347be35990335e3da76143a5
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type ContactsView_contacts$ref = any;
export type ContactsViewContactsChangedSubscriptionVariables = {|
  userID: string
|};
export type ContactsViewContactsChangedSubscriptionResponse = {|
  +contactsChanged: {|
    +contact: {|
      +invite: ?{|
        +inviteTX: ?string
      |}
    |},
    +viewer: {|
      +contacts: {|
        +$fragmentRefs: ContactsView_contacts$ref
      |}
    |},
  |}
|};
export type ContactsViewContactsChangedSubscription = {|
  variables: ContactsViewContactsChangedSubscriptionVariables,
  response: ContactsViewContactsChangedSubscriptionResponse,
|};
*/


/*
subscription ContactsViewContactsChangedSubscription(
  $userID: String!
) {
  contactsChanged {
    contact {
      invite {
        inviteTX
      }
      id
    }
    viewer {
      contacts {
        ...ContactsView_contacts_3iqrP
      }
      id
    }
  }
}

fragment ContactsView_contacts_3iqrP on Contacts {
  userContacts(userID: $userID) {
    ...InviteContactModal_contact
    peerID
    localID
    connectionState
    publicFeed
    invite {
      inviteTX
      stake {
        reclaimedTX
        amount
        state
      }
    }
    profile {
      name
      ethAddress
    }
    id
  }
}

fragment InviteContactModal_contact on Contact {
  peerID
  localID
  connectionState
  publicFeed
  invite {
    inviteTX
    stake {
      reclaimedTX
      amount
      state
    }
  }
  profile {
    name
    ethAddress
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
  "kind": "ScalarField",
  "alias": null,
  "name": "inviteTX",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "invite",
  "storageKey": null,
  "args": null,
  "concreteType": "ContactInviteData",
  "plural": false,
  "selections": [
    v1
  ]
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "ContactsViewContactsChangedSubscription",
  "id": null,
  "text": "subscription ContactsViewContactsChangedSubscription(\n  $userID: String!\n) {\n  contactsChanged {\n    contact {\n      invite {\n        inviteTX\n      }\n      id\n    }\n    viewer {\n      contacts {\n        ...ContactsView_contacts_3iqrP\n      }\n      id\n    }\n  }\n}\n\nfragment ContactsView_contacts_3iqrP on Contacts {\n  userContacts(userID: $userID) {\n    ...InviteContactModal_contact\n    peerID\n    localID\n    connectionState\n    publicFeed\n    invite {\n      inviteTX\n      stake {\n        reclaimedTX\n        amount\n        state\n      }\n    }\n    profile {\n      name\n      ethAddress\n    }\n    id\n  }\n}\n\nfragment InviteContactModal_contact on Contact {\n  peerID\n  localID\n  connectionState\n  publicFeed\n  invite {\n    inviteTX\n    stake {\n      reclaimedTX\n      amount\n      state\n    }\n  }\n  profile {\n    name\n    ethAddress\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ContactsViewContactsChangedSubscription",
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
            "name": "contact",
            "storageKey": null,
            "args": null,
            "concreteType": "Contact",
            "plural": false,
            "selections": [
              v2
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "Viewer",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "contacts",
                "storageKey": null,
                "args": null,
                "concreteType": "Contacts",
                "plural": false,
                "selections": [
                  {
                    "kind": "FragmentSpread",
                    "name": "ContactsView_contacts",
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "userID",
                        "variableName": "userID",
                        "type": null
                      }
                    ]
                  }
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
    "name": "ContactsViewContactsChangedSubscription",
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
            "name": "contact",
            "storageKey": null,
            "args": null,
            "concreteType": "Contact",
            "plural": false,
            "selections": [
              v2,
              v3
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "Viewer",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "contacts",
                "storageKey": null,
                "args": null,
                "concreteType": "Contacts",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "userContacts",
                    "storageKey": null,
                    "args": [
                      {
                        "kind": "Variable",
                        "name": "userID",
                        "variableName": "userID",
                        "type": "String!"
                      }
                    ],
                    "concreteType": "Contact",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "peerID",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "localID",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "connectionState",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "publicFeed",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "invite",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "ContactInviteData",
                        "plural": false,
                        "selections": [
                          v1,
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "stake",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "InviteStake",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "reclaimedTX",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "amount",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "state",
                                "args": null,
                                "storageKey": null
                              }
                            ]
                          }
                        ]
                      },
                      {
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
                            "name": "ethAddress",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      v3
                    ]
                  }
                ]
              },
              v3
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '1db897ee9168cc4d4c87b310b78976bb';
module.exports = node;
