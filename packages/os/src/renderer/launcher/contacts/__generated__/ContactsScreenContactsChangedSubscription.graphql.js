/**
 * @flow
 * @relayHash ed1c55f6af733c888d04c0cadef9074e
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type ContactsScreen_user$ref = any;
export type ContactsScreenContactsChangedSubscriptionVariables = {||};
export type ContactsScreenContactsChangedSubscriptionResponse = {|
  +contactsChanged: {|
    +viewer: {|
      +$fragmentRefs: ContactsScreen_user$ref
    |}
  |}
|};
export type ContactsScreenContactsChangedSubscription = {|
  variables: ContactsScreenContactsChangedSubscriptionVariables,
  response: ContactsScreenContactsChangedSubscriptionResponse,
|};
*/


/*
subscription ContactsScreenContactsChangedSubscription {
  contactsChanged {
    viewer {
      ...ContactsScreen_user
      id
    }
  }
}

fragment ContactsScreen_user on User {
  ...InviteContactModal_user
  localID
  publicID
  profile {
    name
    ethAddress
  }
  contactInviteStake
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
    senderAddress
    id
  }
  contacts {
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
  ethWallets {
    hd {
      name
      localID
      accounts {
        address
        balances {
          eth
          mft
        }
      }
      id
    }
    ledger {
      name
      localID
      accounts {
        address
        balances {
          eth
          mft
        }
      }
      id
    }
  }
}

fragment InviteContactModal_user on User {
  contactInviteStake
  profile {
    ethAddress
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
  "name": "ethAddress",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
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
  "name": "peerID",
  "args": null,
  "storageKey": null
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
    v1,
    v0
  ]
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
},
v10 = [
  v1,
  v2,
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "accounts",
    "storageKey": null,
    "args": null,
    "concreteType": "WalletAccount",
    "plural": true,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "address",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "balances",
        "storageKey": null,
        "args": null,
        "concreteType": "WalletBalances",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "eth",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "mft",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  v9
];
return {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "ContactsScreenContactsChangedSubscription",
  "id": null,
  "text": "subscription ContactsScreenContactsChangedSubscription {\n  contactsChanged {\n    viewer {\n      ...ContactsScreen_user\n      id\n    }\n  }\n}\n\nfragment ContactsScreen_user on User {\n  ...InviteContactModal_user\n  localID\n  publicID\n  profile {\n    name\n    ethAddress\n  }\n  contactInviteStake\n  contactRequests {\n    localID\n    publicID\n    peerID\n    profile {\n      name\n      ethAddress\n    }\n    connectionState\n    ethNetwork\n    stakeAmount\n    receivedAddress\n    senderAddress\n    id\n  }\n  contacts {\n    localID\n    peerID\n    publicID\n    connectionState\n    invite {\n      ...InviteContactModal_contactInvite\n      ethNetwork\n      fromAddress\n      inviteTX\n      stakeState\n      stakeAmount\n      reclaimedStakeTX\n    }\n    profile {\n      name\n      ethAddress\n    }\n    id\n  }\n  ethWallets {\n    hd {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n    ledger {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n  }\n}\n\nfragment InviteContactModal_user on User {\n  contactInviteStake\n  profile {\n    ethAddress\n  }\n}\n\nfragment InviteContactModal_contactInvite on ContactInvite {\n  ethNetwork\n  fromAddress\n  inviteTX\n  stakeState\n  stakeAmount\n  reclaimedStakeTX\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ContactsScreenContactsChangedSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "contactsChanged",
        "storageKey": null,
        "args": null,
        "concreteType": "ContactChangedPayload",
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
    "name": "ContactsScreenContactsChangedSubscription",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "contactsChanged",
        "storageKey": null,
        "args": null,
        "concreteType": "ContactChangedPayload",
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
                "kind": "ScalarField",
                "alias": null,
                "name": "contactInviteStake",
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
                  v0,
                  v1
                ]
              },
              v2,
              v3,
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
                  v4,
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
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "senderAddress",
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
                  v4,
                  v3,
                  v6,
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "invite",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ContactInvite",
                    "plural": false,
                    "selections": [
                      v7,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "fromAddress",
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
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "ethWallets",
                "storageKey": null,
                "args": null,
                "concreteType": "EthWallets",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "hd",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "EthHDWallet",
                    "plural": true,
                    "selections": v10
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "ledger",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "EthLedgerWallet",
                    "plural": true,
                    "selections": v10
                  }
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
(node/*: any*/).hash = '845b92fa62df43c4fa6ae57b58e8ff86';
module.exports = node;
