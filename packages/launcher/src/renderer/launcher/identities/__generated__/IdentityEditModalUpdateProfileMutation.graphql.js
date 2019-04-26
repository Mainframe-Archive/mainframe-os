/**
 * @flow
 * @relayHash f1f46f018bfbaa482d3ffd2261ac19c2
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type IdentitiesView_identities$ref = any;
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
export type IdentityEditModalUpdateProfileMutationVariables = {|
  input: UpdateProfileInput
|};
export type IdentityEditModalUpdateProfileMutationResponse = {|
  +updateProfile: ?{|
    +viewer: {|
      +identities: {|
        +$fragmentRefs: Launcher_identities$ref & IdentitiesView_identities$ref
      |}
    |}
  |}
|};
export type IdentityEditModalUpdateProfileMutation = {|
  variables: IdentityEditModalUpdateProfileMutationVariables,
  response: IdentityEditModalUpdateProfileMutationResponse,
|};
*/


/*
mutation IdentityEditModalUpdateProfileMutation(
  $input: UpdateProfileInput!
) {
  updateProfile(input: $input) {
    viewer {
      identities {
        ...Launcher_identities
        ...IdentitiesView_identities
      }
      id
    }
  }
}

fragment Launcher_identities on Identities {
  ownUsers {
    defaultEthAddress
    localID
    feedHash
    profile {
      name
      ethAddress
    }
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

fragment IdentitiesView_identities on Identities {
  ownUsers {
    ...IdentityEditModal_ownUserIdentity
    localID
    feedHash
    profile {
      name
    }
    apps {
      localID
      manifest {
        name
      }
      users {
        settings {
          permissionsSettings {
            permissionsChecked
            grants {
              BLOCKCHAIN_SEND
            }
          }
        }
        id
      }
      id
    }
    id
  }
  ownDevelopers {
    localID
    profile {
      name
    }
    id
  }
}

fragment IdentityEditModal_ownUserIdentity on OwnUserIdentity {
  localID
  feedHash
  privateProfile
  profile {
    name
    avatar
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
  "name": "name",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v5 = [
  v2,
  v4
],
v6 = [
  v3
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "IdentityEditModalUpdateProfileMutation",
  "id": null,
  "text": "mutation IdentityEditModalUpdateProfileMutation(\n  $input: UpdateProfileInput!\n) {\n  updateProfile(input: $input) {\n    viewer {\n      identities {\n        ...Launcher_identities\n        ...IdentitiesView_identities\n      }\n      id\n    }\n  }\n}\n\nfragment Launcher_identities on Identities {\n  ownUsers {\n    defaultEthAddress\n    localID\n    feedHash\n    profile {\n      name\n      ethAddress\n    }\n    wallets {\n      hd {\n        localID\n        id\n      }\n      ledger {\n        localID\n        id\n      }\n    }\n    id\n  }\n}\n\nfragment IdentitiesView_identities on Identities {\n  ownUsers {\n    ...IdentityEditModal_ownUserIdentity\n    localID\n    feedHash\n    profile {\n      name\n    }\n    apps {\n      localID\n      manifest {\n        name\n      }\n      users {\n        settings {\n          permissionsSettings {\n            permissionsChecked\n            grants {\n              BLOCKCHAIN_SEND\n            }\n          }\n        }\n        id\n      }\n      id\n    }\n    id\n  }\n  ownDevelopers {\n    localID\n    profile {\n      name\n    }\n    id\n  }\n}\n\nfragment IdentityEditModal_ownUserIdentity on OwnUserIdentity {\n  localID\n  feedHash\n  privateProfile\n  profile {\n    name\n    avatar\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "IdentityEditModalUpdateProfileMutation",
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
                  },
                  {
                    "kind": "FragmentSpread",
                    "name": "IdentitiesView_identities",
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
    "name": "IdentityEditModalUpdateProfileMutation",
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
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "feedHash",
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
                          v3,
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "ethAddress",
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
                            "selections": v5
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "ledger",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "EthLedgerWallet",
                            "plural": true,
                            "selections": v5
                          }
                        ]
                      },
                      v4,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "privateProfile",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "apps",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "App",
                        "plural": true,
                        "selections": [
                          v2,
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "manifest",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "AppManifestData",
                            "plural": false,
                            "selections": v6
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "users",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "AppUser",
                            "plural": true,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "settings",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "AppUserSettings",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "permissionsSettings",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "AppPermissionsSettings",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "name": "permissionsChecked",
                                        "args": null,
                                        "storageKey": null
                                      },
                                      {
                                        "kind": "LinkedField",
                                        "alias": null,
                                        "name": "grants",
                                        "storageKey": null,
                                        "args": null,
                                        "concreteType": "AppPermissions",
                                        "plural": false,
                                        "selections": [
                                          {
                                            "kind": "ScalarField",
                                            "alias": null,
                                            "name": "BLOCKCHAIN_SEND",
                                            "args": null,
                                            "storageKey": null
                                          }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              },
                              v4
                            ]
                          },
                          v4
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "ownDevelopers",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "OwnDeveloperIdentity",
                    "plural": true,
                    "selections": [
                      v2,
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "profile",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "NamedProfile",
                        "plural": false,
                        "selections": v6
                      },
                      v4
                    ]
                  }
                ]
              },
              v4
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'c7880c858d5f3a6a140c64d50176489d';
module.exports = node;
