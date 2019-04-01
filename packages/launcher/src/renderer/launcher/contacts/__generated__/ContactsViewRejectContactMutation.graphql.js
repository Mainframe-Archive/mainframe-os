/**
 * @flow
 * @relayHash 2ef0e3e88eafc89abe5a6989e8d91587
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type ContactsView_contacts$ref = any;
export type RejectContactInput = {
  peerID: string,
  userID: string,
  clientMutationId?: ?string,
};
export type ContactsViewRejectContactMutationVariables = {|
  input: RejectContactInput,
  userID: string,
|};
export type ContactsViewRejectContactMutationResponse = {|
  +rejectContact: ?{|
    +viewer: {|
      +contacts: {|
        +$fragmentRefs: ContactsView_contacts$ref
      |}
    |}
  |}
|};
export type ContactsViewRejectContactMutation = {|
  variables: ContactsViewRejectContactMutationVariables,
  response: ContactsViewRejectContactMutationResponse,
|};
*/


/*
mutation ContactsViewRejectContactMutation(
  $input: RejectContactInput!
  $userID: String!
) {
  rejectContact(input: $input) {
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
    "type": "RejectContactInput!",
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
    "type": "RejectContactInput!"
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
  "name": "ContactsViewRejectContactMutation",
  "id": null,
  "text": "mutation ContactsViewRejectContactMutation(\n  $input: RejectContactInput!\n  $userID: String!\n) {\n  rejectContact(input: $input) {\n    viewer {\n      contacts {\n        ...ContactsView_contacts_3iqrP\n      }\n      id\n    }\n  }\n}\n\nfragment ContactsView_contacts_3iqrP on Contacts {\n  userContacts(userID: $userID) {\n    peerID\n    localID\n    connectionState\n    publicFeed\n    invite {\n      inviteTX\n      stake {\n        reclaimedTX\n        amount\n        state\n      }\n    }\n    profile {\n      name\n      ethAddress\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ContactsViewRejectContactMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "rejectContact",
        "storageKey": null,
        "args": v1,
        "concreteType": "RejectContactPayload",
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
    "name": "ContactsViewRejectContactMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "rejectContact",
        "storageKey": null,
        "args": v1,
        "concreteType": "RejectContactPayload",
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
(node/*: any*/).hash = 'ebac65f2297f608f002a63521d459694';
module.exports = node;
