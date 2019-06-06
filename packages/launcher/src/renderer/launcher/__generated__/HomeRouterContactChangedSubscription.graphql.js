/**
 * @flow
 * @relayHash 20299e4b357c3fd169546c08ae96be72
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ContactConnectionState = "CONNECTED" | "DECLINED" | "RECEIVED" | "SENDING_BLOCKCHAIN" | "SENDING_FEED" | "SENT_BLOCKCHAIN" | "SENT_FEED" | "%future added value";
export type ContactStakeState = "RECLAIMED" | "RECLAIMING" | "SEIZED" | "STAKED" | "%future added value";
export type HomeRouterContactChangedSubscriptionVariables = {||};
export type HomeRouterContactChangedSubscriptionResponse = {|
  +contactChanged: {|
    +contact: {|
      +localID: string,
      +peerID: string,
      +publicID: string,
      +connectionState: ContactConnectionState,
      +invite: ?{|
        +ethNetwork: ?string,
        +inviteTX: ?string,
        +stakeAmount: string,
        +stakeState: ContactStakeState,
        +reclaimedStakeTX: ?string,
      |},
      +profile: {|
        +name: ?string,
        +ethAddress: ?string,
      |},
    |}
  |}
|};
export type HomeRouterContactChangedSubscription = {|
  variables: HomeRouterContactChangedSubscriptionVariables,
  response: HomeRouterContactChangedSubscriptionResponse,
|};
*/


/*
subscription HomeRouterContactChangedSubscription {
  contactChanged {
    contact {
      localID
      peerID
      publicID
      connectionState
      invite {
        ethNetwork
        inviteTX
        stakeAmount
        stakeState
        reclaimedStakeTX
      }
      profile {
        name
        ethAddress
      }
      id
    }
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
  "name": "peerID",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "publicID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "connectionState",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "invite",
  "storageKey": null,
  "args": null,
  "concreteType": "ContactInvite",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "stakeAmount",
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
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "reclaimedStakeTX",
      "args": null,
      "storageKey": null
    }
  ]
},
v5 = {
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
};
return {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "HomeRouterContactChangedSubscription",
  "id": null,
  "text": "subscription HomeRouterContactChangedSubscription {\n  contactChanged {\n    contact {\n      localID\n      peerID\n      publicID\n      connectionState\n      invite {\n        ethNetwork\n        inviteTX\n        stakeAmount\n        stakeState\n        reclaimedStakeTX\n      }\n      profile {\n        name\n        ethAddress\n      }\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "HomeRouterContactChangedSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "contactChanged",
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
              v0,
              v1,
              v2,
              v3,
              v4,
              v5
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "HomeRouterContactChangedSubscription",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "contactChanged",
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
              v0,
              v1,
              v2,
              v3,
              v4,
              v5,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'a2be13f359d36542e80eba921f5daab4';
module.exports = node;
