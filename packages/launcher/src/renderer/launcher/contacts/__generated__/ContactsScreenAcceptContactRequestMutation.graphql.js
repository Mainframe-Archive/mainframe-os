/**
 * @flow
 * @relayHash 6d1b57642e56db548e95580232252deb
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type ContactsScreen_user$ref = any;
export type AcceptContactRequestInput = {
  peerID: string,
  userID: string,
  clientMutationId?: ?string,
};
export type ContactsScreenAcceptContactRequestMutationVariables = {|
  input: AcceptContactRequestInput
|};
export type ContactsScreenAcceptContactRequestMutationResponse = {|
  +acceptContactRequest: ?{|
    +viewer: {|
      +$fragmentRefs: ContactsScreen_user$ref
    |}
  |}
|};
export type ContactsScreenAcceptContactRequestMutation = {|
  variables: ContactsScreenAcceptContactRequestMutationVariables,
  response: ContactsScreenAcceptContactRequestMutationResponse,
|};
*/


/*
mutation ContactsScreenAcceptContactRequestMutation(
  $input: AcceptContactRequestInput!
) {
  acceptContactRequest(input: $input) {
    viewer {
      ...ContactsScreen_user
      id
    }
  }
}

fragment ContactsScreen_user on User {
  localID
  publicID
  profile {
    name
    ethAddress
  }
  contacts {
    localID
    peerID
    publicID
    connectionState
    invite {
      ethNetwork
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
    "type": "AcceptContactRequestInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "AcceptContactRequestInput!"
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
v4 = [
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
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "ContactsScreenAcceptContactRequestMutation",
  "id": null,
  "text": "mutation ContactsScreenAcceptContactRequestMutation(\n  $input: AcceptContactRequestInput!\n) {\n  acceptContactRequest(input: $input) {\n    viewer {\n      ...ContactsScreen_user\n      id\n    }\n  }\n}\n\nfragment ContactsScreen_user on User {\n  localID\n  publicID\n  profile {\n    name\n    ethAddress\n  }\n  contacts {\n    localID\n    peerID\n    publicID\n    connectionState\n    invite {\n      ethNetwork\n      inviteTX\n      stake {\n        reclaimedTX\n        amount\n        state\n      }\n    }\n    profile {\n      name\n      ethAddress\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ContactsScreenAcceptContactRequestMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "acceptContactRequest",
        "storageKey": null,
        "args": v1,
        "concreteType": "AcceptContactRequestPayload",
        "plural": false,
        "selections": [
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
    "name": "ContactsScreenAcceptContactRequestMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "acceptContactRequest",
        "storageKey": null,
        "args": v1,
        "concreteType": "AcceptContactRequestPayload",
        "plural": false,
        "selections": [
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
                "selections": v4
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "contacts",
                "storageKey": null,
                "args": null,
                "concreteType": "Contact",
                "plural": true,
                "selections": [
                  v2,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "peerID",
                    "args": null,
                    "storageKey": null
                  },
                  v3,
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
                        "name": "ethNetwork",
                        "args": null,
                        "storageKey": null
                      },
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
                    "selections": v4
                  },
                  v5
                ]
              },
              v5
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'a6db6194915111a57bb87cdabbc087aa';
module.exports = node;
