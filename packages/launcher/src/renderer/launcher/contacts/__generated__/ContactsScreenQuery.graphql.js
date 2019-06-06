/**
 * @flow
 * @relayHash de5efb3fbd5ede4a401697a316deade3
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type ContactsScreen_user$ref = any;
export type ContactsScreenQueryVariables = {||};
export type ContactsScreenQueryResponse = {|
  +user: {|
    +$fragmentRefs: ContactsScreen_user$ref
  |}
|};
export type ContactsScreenQuery = {|
  variables: ContactsScreenQueryVariables,
  response: ContactsScreenQueryResponse,
|};
*/


/*
query ContactsScreenQuery {
  user: viewer {
    ...ContactsScreen_user
    id
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
    peerID
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
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "publicID",
  "args": null,
  "storageKey": null
},
v2 = [
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
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "peerID",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "profile",
  "storageKey": null,
  "args": null,
  "concreteType": "GenericProfile",
  "plural": false,
  "selections": v2
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "connectionState",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "ethNetwork",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "stakeAmount",
  "args": null,
  "storageKey": null
},
v8 = {
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
  "text": "query ContactsScreenQuery {\n  user: viewer {\n    ...ContactsScreen_user\n    id\n  }\n}\n\nfragment ContactsScreen_user on User {\n  localID\n  publicID\n  profile {\n    name\n    ethAddress\n  }\n  contactRequests {\n    localID\n    publicID\n    peerID\n    profile {\n      name\n      ethAddress\n    }\n    connectionState\n    ethNetwork\n    stakeAmount\n    receivedAddress\n    id\n  }\n  contacts {\n    localID\n    peerID\n    publicID\n    connectionState\n    invite {\n      ethNetwork\n      inviteTX\n      stakeState\n      stakeAmount\n      reclaimedStakeTX\n    }\n    profile {\n      name\n      ethAddress\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ContactsScreenQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "user",
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
  },
  "operation": {
    "kind": "Operation",
    "name": "ContactsScreenQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "user",
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          v0,
          v1,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "profile",
            "storageKey": null,
            "args": null,
            "concreteType": "NamedProfile",
            "plural": false,
            "selections": v2
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
              v0,
              v1,
              v3,
              v4,
              v5,
              v6,
              v7,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "receivedAddress",
                "args": null,
                "storageKey": null
              },
              v8
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
              v0,
              v3,
              v1,
              v5,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "invite",
                "storageKey": null,
                "args": null,
                "concreteType": "ContactInvite",
                "plural": false,
                "selections": [
                  v6,
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
                  v7,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "reclaimedStakeTX",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              v4,
              v8
            ]
          },
          v8
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '24b3d881bc66bf67befc4b23453be34d';
module.exports = node;
