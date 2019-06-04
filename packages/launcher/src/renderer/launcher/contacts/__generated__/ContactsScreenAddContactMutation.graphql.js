/**
 * @flow
 * @relayHash 565a91a975158903e3a549444dc648cc
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type ContactsScreen_user$ref = any;
type InviteContactModal_contact$ref = any;
export type AddContactInput = {
  publicID: string,
  aliasName?: ?string,
  sendInvite?: ?boolean,
  clientMutationId?: ?string,
};
export type ContactsScreenAddContactMutationVariables = {|
  input: AddContactInput
|};
export type ContactsScreenAddContactMutationResponse = {|
  +addContact: ?{|
    +contact: ?{|
      +$fragmentRefs: InviteContactModal_contact$ref
    |},
    +viewer: {|
      +$fragmentRefs: ContactsScreen_user$ref
    |},
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
) {
  addContact(input: $input) {
    contact {
      ...InviteContactModal_contact
      id
    }
    viewer {
      ...ContactsScreen_user
      id
    }
  }
}

fragment InviteContactModal_contact on Contact {
  localID
  peerID
  publicID
  connectionState
  invite {
    ethNetwork
    inviteTX
    stakeState
    stakeAmount
    reclaimedStakeTX
  }
  profile {
    name
    ethAddress
  }
}

fragment ContactsScreen_user on User {
  localID
  publicID
  profile {
    name
    ethAddress
  }
  contactRequests {
    localID
    publicID
    localPeerID
    profile {
      name
      ethAddress
    }
    connectionState
    ethNetwork
    stakeAmount
    receivedAddress
    id
  }
  contacts {
    localID
    peerID
    publicID
    connectionState
    invite {
      ethNetwork
      inviteTX
      stakeState
      stakeAmount
      reclaimedStakeTX
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
  "name": "localID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "publicID",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "connectionState",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "ethNetwork",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "stakeAmount",
  "args": null,
  "storageKey": null
},
v7 = [
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
],
v8 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "profile",
  "storageKey": null,
  "args": null,
  "concreteType": "GenericProfile",
  "plural": false,
  "selections": v7
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v10 = [
  v2,
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "peerID",
    "args": null,
    "storageKey": null
  },
  v3,
  v4,
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "invite",
    "storageKey": null,
    "args": null,
    "concreteType": "ContactInviteData",
    "plural": false,
    "selections": [
      v5,
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "inviteTX",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "stakeState",
        "args": null,
        "storageKey": null
      },
      v6,
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "reclaimedStakeTX",
        "args": null,
        "storageKey": null
      }
    ]
  },
  v8,
  v9
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "ContactsScreenAddContactMutation",
  "id": null,
  "text": "mutation ContactsScreenAddContactMutation(\n  $input: AddContactInput!\n) {\n  addContact(input: $input) {\n    contact {\n      ...InviteContactModal_contact\n      id\n    }\n    viewer {\n      ...ContactsScreen_user\n      id\n    }\n  }\n}\n\nfragment InviteContactModal_contact on Contact {\n  localID\n  peerID\n  publicID\n  connectionState\n  invite {\n    ethNetwork\n    inviteTX\n    stakeState\n    stakeAmount\n    reclaimedStakeTX\n  }\n  profile {\n    name\n    ethAddress\n  }\n}\n\nfragment ContactsScreen_user on User {\n  localID\n  publicID\n  profile {\n    name\n    ethAddress\n  }\n  contactRequests {\n    localID\n    publicID\n    localPeerID\n    profile {\n      name\n      ethAddress\n    }\n    connectionState\n    ethNetwork\n    stakeAmount\n    receivedAddress\n    id\n  }\n  contacts {\n    localID\n    peerID\n    publicID\n    connectionState\n    invite {\n      ethNetwork\n      inviteTX\n      stakeState\n      stakeAmount\n      reclaimedStakeTX\n    }\n    profile {\n      name\n      ethAddress\n    }\n    id\n  }\n}\n",
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
            "concreteType": "User",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "ContactsScreen_user",
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
            "name": "contact",
            "storageKey": null,
            "args": null,
            "concreteType": "Contact",
            "plural": false,
            "selections": v10
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "User",
            "plural": false,
            "selections": [
              v2,
              v3,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "profile",
                "storageKey": null,
                "args": null,
                "concreteType": "NamedProfile",
                "plural": false,
                "selections": v7
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "contactRequests",
                "storageKey": null,
                "args": null,
                "concreteType": "ContactRequest",
                "plural": true,
                "selections": [
                  v2,
                  v3,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "localPeerID",
                    "args": null,
                    "storageKey": null
                  },
                  v8,
                  v4,
                  v5,
                  v6,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "receivedAddress",
                    "args": null,
                    "storageKey": null
                  },
                  v9
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "contacts",
                "storageKey": null,
                "args": null,
                "concreteType": "Contact",
                "plural": true,
                "selections": v10
              },
              v9
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '783f30393c80fef02966e627d3060f77';
module.exports = node;
