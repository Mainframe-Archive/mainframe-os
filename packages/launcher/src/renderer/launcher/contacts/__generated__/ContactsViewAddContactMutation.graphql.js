/**
 * @flow
 * @relayHash 7580b52e802c9325fab0425c2d82ede6
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type ContactsView_contacts$ref = any;
type InviteContactModal_contact$ref = any;
export type AddContactInput = {
  userID: string,
  publicFeed: string,
  aliasName?: ?string,
  sendInvite?: ?boolean,
  clientMutationId?: ?string,
};
export type ContactsViewAddContactMutationVariables = {|
  input: AddContactInput,
  userID: string,
|};
export type ContactsViewAddContactMutationResponse = {|
  +addContact: ?{|
    +contact: ?{|
      +$fragmentRefs: InviteContactModal_contact$ref
    |},
    +viewer: {|
      +contacts: {|
        +$fragmentRefs: ContactsView_contacts$ref
      |}
    |},
  |}
|};
export type ContactsViewAddContactMutation = {|
  variables: ContactsViewAddContactMutationVariables,
  response: ContactsViewAddContactMutationResponse,
|};
*/


/*
mutation ContactsViewAddContactMutation(
  $input: AddContactInput!
  $userID: String!
) {
  addContact(input: $input) {
    contact {
      ...InviteContactModal_contact
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
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "AddContactInput!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "userID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "AddContactInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = [
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
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "inviteTX",
        "args": null,
        "storageKey": null
      },
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
  v2
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "ContactsViewAddContactMutation",
  "id": null,
  "text": "mutation ContactsViewAddContactMutation(\n  $input: AddContactInput!\n  $userID: String!\n) {\n  addContact(input: $input) {\n    contact {\n      ...InviteContactModal_contact\n      id\n    }\n    viewer {\n      contacts {\n        ...ContactsView_contacts_3iqrP\n      }\n      id\n    }\n  }\n}\n\nfragment InviteContactModal_contact on Contact {\n  peerID\n  localID\n  connectionState\n  publicFeed\n  invite {\n    inviteTX\n    stake {\n      reclaimedTX\n      amount\n      state\n    }\n  }\n  profile {\n    name\n    ethAddress\n  }\n}\n\nfragment ContactsView_contacts_3iqrP on Contacts {\n  userContacts(userID: $userID) {\n    ...InviteContactModal_contact\n    peerID\n    localID\n    connectionState\n    publicFeed\n    invite {\n      inviteTX\n      stake {\n        reclaimedTX\n        amount\n        state\n      }\n    }\n    profile {\n      name\n      ethAddress\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ContactsViewAddContactMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addContact",
        "storageKey": null,
        "args": v1,
        "concreteType": "AddContactPayload",
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
              {
                "kind": "FragmentSpread",
                "name": "InviteContactModal_contact",
                "args": null
              }
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
    "name": "ContactsViewAddContactMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addContact",
        "storageKey": null,
        "args": v1,
        "concreteType": "AddContactPayload",
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
            "selections": v3
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
                    "selections": v3
                  }
                ]
              },
              v2
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e3b88ea88e87b7fcdd26adf016b8ebb7';
module.exports = node;
