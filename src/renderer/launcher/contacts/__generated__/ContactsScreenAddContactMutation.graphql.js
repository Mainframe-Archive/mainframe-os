/**
 * @flow
 * @relayHash 0d44a8af6d128d90e177a2100150b55e
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type ContactsScreen_user$ref = any;
type InviteContactModal_contactInvite$ref = any;
export type AddContactInput = {|
  publicID: string,
  aliasName?: ?string,
  clientMutationId?: ?string,
|};
export type ContactsScreenAddContactMutationVariables = {|
  input: AddContactInput
|};
export type ContactsScreenAddContactMutationResponse = {|
  +addContact: ?{|
    +contact: ?{|
      +localID: string,
      +publicID: string,
      +profile: {|
        +name: ?string,
        +ethAddress: ?string,
      |},
      +invite: ?{|
        +$fragmentRefs: InviteContactModal_contactInvite$ref
      |},
    |},
    +viewer: {|
      +$fragmentRefs: ContactsScreen_user$ref
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
      localID
      publicID
      profile {
        name
        ethAddress
      }
      invite {
        ...InviteContactModal_contactInvite
      }
      id
    }
    viewer {
      ...ContactsScreen_user
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
    "variableName": "input"
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
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "ethAddress",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "profile",
  "storageKey": null,
  "args": null,
  "concreteType": "GenericProfile",
  "plural": false,
  "selections": [
    (v4/*: any*/),
    (v5/*: any*/)
  ]
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
  "kind": "LinkedField",
  "alias": null,
  "name": "invite",
  "storageKey": null,
  "args": null,
  "concreteType": "ContactInvite",
  "plural": false,
  "selections": [
    (v7/*: any*/),
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
    (v8/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "reclaimedStakeTX",
      "args": null,
      "storageKey": null
    }
  ]
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "peerID",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "connectionState",
  "args": null,
  "storageKey": null
},
v13 = [
  (v4/*: any*/),
  (v2/*: any*/),
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
  (v10/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ContactsScreenAddContactMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addContact",
        "storageKey": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/),
              (v3/*: any*/),
              (v6/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "invite",
                "storageKey": null,
                "args": null,
                "concreteType": "ContactInvite",
                "plural": false,
                "selections": [
                  {
                    "kind": "FragmentSpread",
                    "name": "InviteContactModal_contactInvite",
                    "args": null
                  }
                ]
              }
            ]
          },
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
    "name": "ContactsScreenAddContactMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "addContact",
        "storageKey": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/),
              (v3/*: any*/),
              (v6/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/)
            ]
          },
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
                  (v5/*: any*/),
                  (v4/*: any*/)
                ]
              },
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "contactRequests",
                "storageKey": null,
                "args": null,
                "concreteType": "ContactRequest",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v11/*: any*/),
                  (v6/*: any*/),
                  (v12/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
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
                  (v10/*: any*/)
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
                  (v2/*: any*/),
                  (v11/*: any*/),
                  (v3/*: any*/),
                  (v12/*: any*/),
                  (v9/*: any*/),
                  (v6/*: any*/),
                  (v10/*: any*/)
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
                    "selections": (v13/*: any*/)
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "ledger",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "EthLedgerWallet",
                    "plural": true,
                    "selections": (v13/*: any*/)
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
  "params": {
    "operationKind": "mutation",
    "name": "ContactsScreenAddContactMutation",
    "id": null,
    "text": "mutation ContactsScreenAddContactMutation(\n  $input: AddContactInput!\n) {\n  addContact(input: $input) {\n    contact {\n      localID\n      publicID\n      profile {\n        name\n        ethAddress\n      }\n      invite {\n        ...InviteContactModal_contactInvite\n      }\n      id\n    }\n    viewer {\n      ...ContactsScreen_user\n      id\n    }\n  }\n}\n\nfragment InviteContactModal_contactInvite on ContactInvite {\n  ethNetwork\n  fromAddress\n  inviteTX\n  stakeState\n  stakeAmount\n  reclaimedStakeTX\n}\n\nfragment ContactsScreen_user on User {\n  ...InviteContactModal_user\n  localID\n  publicID\n  profile {\n    name\n    ethAddress\n  }\n  contactInviteStake\n  contactRequests {\n    localID\n    publicID\n    peerID\n    profile {\n      name\n      ethAddress\n    }\n    connectionState\n    ethNetwork\n    stakeAmount\n    receivedAddress\n    senderAddress\n    id\n  }\n  contacts {\n    localID\n    peerID\n    publicID\n    connectionState\n    invite {\n      ...InviteContactModal_contactInvite\n      ethNetwork\n      fromAddress\n      inviteTX\n      stakeState\n      stakeAmount\n      reclaimedStakeTX\n    }\n    profile {\n      name\n      ethAddress\n    }\n    id\n  }\n  ethWallets {\n    hd {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n    ledger {\n      name\n      localID\n      accounts {\n        address\n        balances {\n          eth\n          mft\n        }\n      }\n      id\n    }\n  }\n}\n\nfragment InviteContactModal_user on User {\n  contactInviteStake\n  profile {\n    ethAddress\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'f2bdc09a3bcce6505d7f5e99e1b9b9b0';
module.exports = node;
