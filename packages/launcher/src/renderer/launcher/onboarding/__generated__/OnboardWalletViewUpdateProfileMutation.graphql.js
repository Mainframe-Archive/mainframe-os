/**
 * @flow
 * @relayHash c5220cc02fd1b0d1a4f22bc3169d35f1
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Launcher_identities$ref = any;
export type UpdateProfileInput = {
  userID: string,
  profile: UpdateUserProfileInput,
  privateProfile?: ?boolean,
  clientMutationId?: ?string,
};
export type UpdateUserProfileInput = {
  name?: ?string,
  avatar?: ?string,
  ethAddress?: ?string,
};
export type OnboardWalletViewUpdateProfileMutationVariables = {|
  input: UpdateProfileInput
|};
export type OnboardWalletViewUpdateProfileMutationResponse = {|
  +updateProfile: ?{|
    +viewer: {|
      +identities: {|
        +$fragmentRefs: Launcher_identities$ref
      |}
    |}
  |}
|};
export type OnboardWalletViewUpdateProfileMutation = {|
  variables: OnboardWalletViewUpdateProfileMutationVariables,
  response: OnboardWalletViewUpdateProfileMutationResponse,
|};
*/


/*
mutation OnboardWalletViewUpdateProfileMutation(
  $input: UpdateProfileInput!
) {
  updateProfile(input: $input) {
    viewer {
      identities {
        ...Launcher_identities
      }
      id
    }
  }
}

fragment Launcher_identities on Identities {
  ownUsers {
    defaultEthAddress
    localID
    wallets {
      hd {
        localID
        id
      }
      ledger {
        localID
        id
      }
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
    "type": "UpdateProfileInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "UpdateProfileInput!"
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
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = [
  v2,
  v3
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "OnboardWalletViewUpdateProfileMutation",
  "id": null,
  "text": "mutation OnboardWalletViewUpdateProfileMutation(\n  $input: UpdateProfileInput!\n) {\n  updateProfile(input: $input) {\n    viewer {\n      identities {\n        ...Launcher_identities\n      }\n      id\n    }\n  }\n}\n\nfragment Launcher_identities on Identities {\n  ownUsers {\n    defaultEthAddress\n    localID\n    wallets {\n      hd {\n        localID\n        id\n      }\n      ledger {\n        localID\n        id\n      }\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "OnboardWalletViewUpdateProfileMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateProfile",
        "storageKey": null,
        "args": v1,
        "concreteType": "UpdateProfilePayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "Viewer",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "identities",
                "storageKey": null,
                "args": null,
                "concreteType": "Identities",
                "plural": false,
                "selections": [
                  {
                    "kind": "FragmentSpread",
                    "name": "Launcher_identities",
                    "args": null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "OnboardWalletViewUpdateProfileMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateProfile",
        "storageKey": null,
        "args": v1,
        "concreteType": "UpdateProfilePayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "Viewer",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "identities",
                "storageKey": null,
                "args": null,
                "concreteType": "Identities",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "ownUsers",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "OwnUserIdentity",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "defaultEthAddress",
                        "args": null,
                        "storageKey": null
                      },
                      v2,
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "wallets",
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
                            "selections": v4
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "ledger",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "EthLedgerWallet",
                            "plural": true,
                            "selections": v4
                          }
                        ]
                      },
                      v3
                    ]
                  }
                ]
              },
              v3
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '6a0738c1daaa89a3f0a1de099e400c8c';
module.exports = node;
