/**
 * @flow
 * @relayHash 1aacf9fb84df79086571e381cabed0de
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type ContactsView_contacts$ref = any;
export type AddContactInput = {
  userID: string,
  profile: UserProfileInput,
  publicFeed: string,
  clientMutationId?: ?string,
};
export type UserProfileInput = {
  name: string,
  avatar?: ?string,
};
export type ContactsScreenAddContactMutationVariables = {|
  input: AddContactInput,
  userID: string,
|};
export type ContactsScreenAddContactMutationResponse = {|
  +addContact: ?{|
    +viewer: {|
      +contacts: {|
        +$fragmentRefs: ContactsView_contacts$ref
      |}
    |}
  |}
|};
export type ContactsScreenAddContactMutation = {|
  variables: ContactsScreenAddContactMutationVariables,
  response: ContactsScreenAddContactMutationResponse,
|};
*/


/*
mutation ContactsScreenAddContactMutation(
  $input: AddContactInput!
  $userID: String!
) {
  addContact(input: $input) {
    viewer {
      contacts {
        ...ContactsView_contacts_3iqrP
      }
      id
    }
  }
}

fragment ContactsView_contacts_3iqrP on ContactsQuery {
  userContacts(userID: $userID) {
    peerID
    localID
    connectionState
    profile {
      name
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
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "ContactsScreenAddContactMutation",
  "id": null,
  "text": "mutation ContactsScreenAddContactMutation(\n  $input: AddContactInput!\n  $userID: String!\n) {\n  addContact(input: $input) {\n    viewer {\n      contacts {\n        ...ContactsView_contacts_3iqrP\n      }\n      id\n    }\n  }\n}\n\nfragment ContactsView_contacts_3iqrP on ContactsQuery {\n  userContacts(userID: $userID) {\n    peerID\n    localID\n    connectionState\n    profile {\n      name\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ContactsScreenAddContactMutation",
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
                "concreteType": "ContactsQuery",
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
    "name": "ContactsScreenAddContactMutation",
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
                "concreteType": "ContactsQuery",
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
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "profile",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "ContactProfile",
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
                      },
                      v2
                    ]
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
(node/*: any*/).hash = '3a9a38f2f460d1afabb073765e0f84f4';
module.exports = node;
