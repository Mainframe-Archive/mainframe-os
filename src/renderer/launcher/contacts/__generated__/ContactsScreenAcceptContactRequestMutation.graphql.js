/**
 * @flow
 * @relayHash 37ea68ff7a145a6fe9cc46a1da879556
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type ContactsScreen_user$ref = any;
export type AcceptContactRequestInput = {|
  peerID: string,
  clientMutationId?: ?string,
|};
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
    "variableName": "input"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "ethAddress",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "publicID",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "peerID",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "profile",
  "storageKey": null,
  "args": null,
  "concreteType": "GenericProfile",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    (v2/*: any*/)
  ]
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "connectionState",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "ethNetwork",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "stakeAmount",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v12 = [
  (v3/*: any*/),
  (v4/*: any*/),
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
  (v11/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ContactsScreenAcceptContactRequestMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "acceptContactRequest",
        "storageKey": null,
        "args": (v1/*: any*/),
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
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "acceptContactRequest",
        "storageKey": null,
        "args": (v1/*: any*/),
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
                  (v2/*: any*/),
                  (v3/*: any*/)
                ]
              },
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "contactRequests",
                "storageKey": null,
                "args": null,
                "concreteType": "ContactRequest",
                "plural": true,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
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
                  (v11/*: any*/)
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
                  (v4/*: any*/),
                  (v6/*: any*/),
                  (v5/*: any*/),
                  (v8/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "invite",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ContactInvite",
                    "plural": false,
                    "selections": [
                      (v9/*: any*/),
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
                      (v10/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "reclaimedStakeTX",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  (v7/*: any*/),
                  (v11/*: any*/)
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
                    "selections": (v12/*: any*/)
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "ledger",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "EthLedgerWallet",
                    "plural": true,
                    "selections": (v12/*: any*/)
                  }
                ]
              },
              (v11/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "ContactsScreenAcceptContactRequestMutation",
    "id": null,
    "text": "mutation ContactsScreenAcceptContactRequestMutation(\n  $input: AcceptContactRequestInput!\n) {\n  acceptContactRequest(input: $input) {\n    viewer {\n      ...ContactsScreen_user\n      id\n    }\n  }\n}\n\nfragment ContactsScreen_user on User {\n  ...InviteContactModal_user\n  localID\n  publicID\n  profile {\n    name\n    ethAddress\n  }\n  contactInviteStake\n  contactRequests {\n    localID\n    publicID\n    peerID\n    profile {\n      name\n      ethAddress\n    }\n    connectionState\n    ethNetwork\n    stakeAmount\n    receivedAddress\n    senderAddress\n    id\n  }\n  contacts {\n    localID\n    peerID\n    publicID\n    connectionState\n    invite {\n      ...InviteContactModal_contactInvite\n      ethNetwork\n      fromAddress\n      inviteTX\n      stakeState\n      stakeAmount\n      reclaimedStakeTX\n    }\n    profile {\n      name\n      ethAddress\n    }\n    id\n  }\n  ethWallets {\n    hd {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n    ledger {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n  }\n}\n\nfragment InviteContactModal_user on User {\n  contactInviteStake\n  profile {\n    ethAddress\n  }\n}\n\nfragment InviteContactModal_contactInvite on ContactInvite {\n  ethNetwork\n  fromAddress\n  inviteTX\n  stakeState\n  stakeAmount\n  reclaimedStakeTX\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'a6db6194915111a57bb87cdabbc087aa';
module.exports = node;
