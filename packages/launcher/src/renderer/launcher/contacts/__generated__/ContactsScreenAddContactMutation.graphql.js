/**
 * @flow
 * @relayHash 5669f2db0640cbbd299703ecd912a593
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
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
      +id: string
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
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "viewer",
  "storageKey": null,
  "args": null,
  "concreteType": "User",
  "plural": false,
  "selections": [
    v2
  ]
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "ContactsScreenAddContactMutation",
  "id": null,
  "text": "mutation ContactsScreenAddContactMutation(\n  $input: AddContactInput!\n) {\n  addContact(input: $input) {\n    contact {\n      ...InviteContactModal_contact\n      id\n    }\n    viewer {\n      id\n    }\n  }\n}\n\nfragment InviteContactModal_contact on Contact {\n  localID\n  peerID\n  publicID\n  connectionState\n  invite {\n    inviteTX\n    stake {\n      reclaimedTX\n      amount\n      state\n    }\n  }\n  profile {\n    name\n    ethAddress\n  }\n}\n",
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
          v3
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
            "selections": [
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
                "name": "peerID",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "publicID",
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
          },
          v3
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '6346f3ec1dcaea6760ae6d36a4967ea8';
module.exports = node;
