/**
 * @flow
 * @relayHash c0096e9e4bb05afc32b88a9490619b66
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type InviteContactModal_contactInvite$ref = any;
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
        +ethNetwork: string,
        +fromAddress: string,
        +inviteTX: string,
        +stakeState: ContactStakeState,
        +stakeAmount: string,
        +reclaimedStakeTX: ?string,
        +$fragmentRefs: InviteContactModal_contactInvite$ref,
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
        ...InviteContactModal_contactInvite
        ethNetwork
        fromAddress
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
}

fragment InviteContactModal_contactInvite on ContactInvite {
  ethNetwork
  fromAddress
  inviteTX
  stakeState
  stakeAmount
  reclaimedStakeTX
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
  "kind": "ScalarField",
  "alias": null,
  "name": "ethNetwork",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "fromAddress",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "inviteTX",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "stakeState",
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
  "name": "reclaimedStakeTX",
  "args": null,
  "storageKey": null
},
v10 = {
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
              (v0/*: any*/),
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "invite",
                "storageKey": null,
                "args": null,
                "concreteType": "ContactInvite",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  {
                    "kind": "FragmentSpread",
                    "name": "InviteContactModal_contactInvite",
                    "args": null
                  }
                ]
              },
              (v10/*: any*/)
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
              (v0/*: any*/),
              (v1/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "invite",
                "storageKey": null,
                "args": null,
                "concreteType": "ContactInvite",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/)
                ]
              },
              (v10/*: any*/),
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
  },
  "params": {
    "operationKind": "subscription",
    "name": "HomeRouterContactChangedSubscription",
    "id": null,
    "text": "subscription HomeRouterContactChangedSubscription {\n  contactChanged {\n    contact {\n      localID\n      peerID\n      publicID\n      connectionState\n      invite {\n        ...InviteContactModal_contactInvite\n        ethNetwork\n        fromAddress\n        inviteTX\n        stakeState\n        stakeAmount\n        reclaimedStakeTX\n      }\n      profile {\n        name\n        ethAddress\n      }\n      id\n    }\n  }\n}\n\nfragment InviteContactModal_contactInvite on ContactInvite {\n  ethNetwork\n  fromAddress\n  inviteTX\n  stakeState\n  stakeAmount\n  reclaimedStakeTX\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '4292b7b1b0f6f4d2f50a05fa4e573e4d';
module.exports = node;
