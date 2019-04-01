/**
 * @flow
 * @relayHash 7b56aedfc8e0175615bf22bc37bb6db8
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ConnectionState = "CONNECTED" | "DECLINED" | "RECEIVED" | "SENDING" | "SENT" | "%future added value";
export type StakeState = "RECLAIMED" | "RECLAIMING" | "STAKED" | "%future added value";
export type LauncherContactChangedSubscriptionVariables = {||};
export type LauncherContactChangedSubscriptionResponse = {|
  +contactChanged: {|
    +connectionState: ConnectionState,
    +profile: {|
      +name: ?string,
      +avatar: ?string,
    |},
    +invite: ?{|
      +inviteTX: ?string,
      +stake: ?{|
        +reclaimedTX: ?string,
        +amount: ?number,
        +state: ?StakeState,
      |},
    |},
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
    connectionState
    profile {
      name
      avatar
    }
    invite {
      inviteTX
      stake {
        reclaimedTX
        amount
        state
      }
    }
    id
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
};
return {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "LauncherContactChangedSubscription",
  "id": null,
  "text": "subscription LauncherContactChangedSubscription {\n  contactChanged {\n    connectionState\n    profile {\n      name\n      avatar\n    }\n    invite {\n      inviteTX\n      stake {\n        reclaimedTX\n        amount\n        state\n      }\n    }\n    id\n  }\n}\n",
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
        "concreteType": "Contact",
        "plural": false,
        "selections": [
          v0,
          v1,
          v2
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
};
})();
// prettier-ignore
(node/*: any*/).hash = 'de1eb7120dddb8b4b4f169b3984dd09f';
module.exports = node;
