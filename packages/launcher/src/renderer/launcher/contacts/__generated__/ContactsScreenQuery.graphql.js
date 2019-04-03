/**
 * @flow
 * @relayHash c2b2745c6be4895aa3315fc69662967a
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type ContactsScreen_contacts$ref = any;
type ContactsScreen_identities$ref = any;
export type ContactsScreenQueryVariables = {|
  userID: string
|};
export type ContactsScreenQueryResponse = {|
  +viewer: {|
    +contacts: {|
      +$fragmentRefs: ContactsScreen_contacts$ref
    |},
    +identities: {|
      +$fragmentRefs: ContactsScreen_identities$ref
    |},
  |}
|};
export type ContactsScreenQuery = {|
  variables: ContactsScreenQueryVariables,
  response: ContactsScreenQueryResponse,
|};
*/


/*
query ContactsScreenQuery(
  $userID: String!
) {
  viewer {
    contacts {
      ...ContactsScreen_contacts_3iqrP
    }
    identities {
      ...ContactsScreen_identities
    }
    id
  }
}

fragment ContactsScreen_contacts_3iqrP on Contacts {
  ...ContactsView_contacts_3iqrP
}

fragment ContactsScreen_identities on Identities {
  ...ContactsView_identities
}

fragment ContactsView_identities on Identities {
  ownUsers {
    localID
    feedHash
    profile {
      name
    }
    id
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
    "name": "userID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
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
  "operationKind": "query",
  "name": "ContactsScreenQuery",
  "id": null,
  "text": "query ContactsScreenQuery(\n  $userID: String!\n) {\n  viewer {\n    contacts {\n      ...ContactsScreen_contacts_3iqrP\n    }\n    identities {\n      ...ContactsScreen_identities\n    }\n    id\n  }\n}\n\nfragment ContactsScreen_contacts_3iqrP on Contacts {\n  ...ContactsView_contacts_3iqrP\n}\n\nfragment ContactsScreen_identities on Identities {\n  ...ContactsView_identities\n}\n\nfragment ContactsView_identities on Identities {\n  ownUsers {\n    localID\n    feedHash\n    profile {\n      name\n    }\n    id\n  }\n}\n\nfragment ContactsView_contacts_3iqrP on Contacts {\n  userContacts(userID: $userID) {\n    peerID\n    localID\n    connectionState\n    publicFeed\n    invite {\n      inviteTX\n      stake {\n        reclaimedTX\n        amount\n        state\n      }\n    }\n    profile {\n      name\n      ethAddress\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ContactsScreenQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
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
                "name": "ContactsScreen_contacts",
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
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "identities",
            "storageKey": null,
            "args": null,
            "concreteType": "Identities",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "ContactsScreen_identities",
                "args": null
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ContactsScreenQuery",
    "argumentDefinitions": v0,
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
                  v1,
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
                      v2,
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
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "identities",
            "storageKey": null,
            "args": null,
            "concreteType": "Identities",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "ownUsers",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnUserIdentity",
                "plural": true,
                "selections": [
                  v1,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "feedHash",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "profile",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "NamedProfile",
                    "plural": false,
                    "selections": [
                      v2
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
};
})();
// prettier-ignore
(node/*: any*/).hash = 'db5c292554eafb381157cc09b1fd2012';
module.exports = node;
