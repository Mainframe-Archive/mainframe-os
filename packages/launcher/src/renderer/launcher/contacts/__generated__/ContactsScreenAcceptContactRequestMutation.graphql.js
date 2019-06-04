/**
 * @flow
 * @relayHash 947fc9db7f2ea0533451cd9688ed1e49
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type ContactsScreen_user$ref = any;
export type AcceptContactRequestInput = {
  peerID: string,
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
  "kind": "LinkedField",
  "alias": null,
  "name": "profile",
  "storageKey": null,
  "args": null,
  "concreteType": "GenericProfile",
  "plural": false,
  "selections": v4
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "connectionState",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "ethNetwork",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "stakeAmount",
  "args": null,
  "storageKey": null
},
v9 = {
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
  "text": "mutation ContactsScreenAcceptContactRequestMutation(\n  $input: AcceptContactRequestInput!\n) {\n  acceptContactRequest(input: $input) {\n    viewer {\n      ...ContactsScreen_user\n      id\n    }\n  }\n}\n\nfragment ContactsScreen_user on User {\n  localID\n  publicID\n  profile {\n    name\n    ethAddress\n  }\n  contactRequests {\n    localID\n    publicID\n    localPeerID\n    profile {\n      name\n      ethAddress\n    }\n    connectionState\n    ethNetwork\n    stakeAmount\n    receivedAddress\n    id\n  }\n  contacts {\n    localID\n    peerID\n    publicID\n    connectionState\n    invite {\n      ethNetwork\n      inviteTX\n      stakeState\n      stakeAmount\n      reclaimedStakeTX\n    }\n    profile {\n      name\n      ethAddress\n    }\n    id\n  }\n}\n",
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
                  v5,
                  v6,
                  v7,
                  v8,
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
                  v6,
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "invite",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ContactInviteData",
                    "plural": false,
                    "selections": [
                      v7,
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
                      v8,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "reclaimedStakeTX",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  v5,
                  v9
                ]
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
(node/*: any*/).hash = 'a6db6194915111a57bb87cdabbc087aa';
module.exports = node;
