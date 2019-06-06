/**
 * @flow
 * @relayHash 0d47870e5458ebf2da6043da1a46f8c3
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ContactConnectionState = "CONNECTED" | "DECLINED" | "RECEIVED" | "SENDING_BLOCKCHAIN" | "SENDING_FEED" | "SENT_BLOCKCHAIN" | "SENT_FEED" | "%future added value";
export type ContactStakeState = "RECLAIMED" | "RECLAIMING" | "SEIZED" | "STAKED" | "%future added value";
export type LauncherContactChangedSubscriptionVariables = {||};
export type LauncherContactChangedSubscriptionResponse = {|
  +contactChanged: {|
    +contact: {|
      +connectionState: ContactConnectionState,
      +profile: {|
        +name: ?string,
        +avatar: ?string,
      |},
      +invite: ?{|
        +ethNetwork: ?string,
        +inviteTX: ?string,
        +stakeState: ContactStakeState,
        +stakeAmount: string,
        +reclaimedStakeTX: ?string,
      |},
    |}
  |}
|};
export type LauncherContactChangedSubscription = {|
  variables: LauncherContactChangedSubscriptionVariables,
  response: LauncherContactChangedSubscriptionResponse,
|};
*/


/*
subscription LauncherContactChangedSubscription {
  contactChanged {
    contact {
      connectionState
      profile {
        name
        avatar
      }
      invite {
        ethNetwork
        inviteTX
        stakeState
        stakeAmount
        reclaimedStakeTX
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
  "name": "connectionState",
  "args": null,
  "storageKey": null
},
v1 = {
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
      "name": "avatar",
      "args": null,
      "storageKey": null
    }
  ]
},
v2 = {
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
      "name": "stakeState",
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
      "name": "reclaimedStakeTX",
      "args": null,
      "storageKey": null
    }
  ]
};
return {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "LauncherContactChangedSubscription",
  "id": null,
  "text": "subscription LauncherContactChangedSubscription {\n  contactChanged {\n    contact {\n      connectionState\n      profile {\n        name\n        avatar\n      }\n      invite {\n        ethNetwork\n        inviteTX\n        stakeState\n        stakeAmount\n        reclaimedStakeTX\n      }\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "LauncherContactChangedSubscription",
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
              v2
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "LauncherContactChangedSubscription",
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
(node/*: any*/).hash = '2142ca9b79594e8b333a249c31840fa8';
module.exports = node;
