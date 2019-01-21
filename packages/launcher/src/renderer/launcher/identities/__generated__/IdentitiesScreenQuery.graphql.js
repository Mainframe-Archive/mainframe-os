/**
 * @flow
 * @relayHash 5032360b7555f28e0574140a38789532
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type IdentitiesScreen_identities$ref = any;
export type IdentitiesScreenQueryVariables = {||};
export type IdentitiesScreenQueryResponse = {|
  +viewer: {|
    +identities: {|
      +$fragmentRefs: IdentitiesScreen_identities$ref
    |}
  |}
|};
export type IdentitiesScreenQuery = {|
  variables: IdentitiesScreenQueryVariables,
  response: IdentitiesScreenQueryResponse,
|};
*/


/*
query IdentitiesScreenQuery {
  viewer {
    identities {
      ...IdentitiesScreen_identities
    }
    id
  }
}

fragment IdentitiesScreen_identities on IdentitiesQuery {
  ...IdentitiesView_identities
}

fragment IdentitiesView_identities on IdentitiesQuery {
  ownUsers {
    localID
    feedHash
    profile {
      name
    }
    wallets {
      localID
      accounts
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
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v1 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "IdentitiesScreenQuery",
  "id": null,
  "text": "query IdentitiesScreenQuery {\n  viewer {\n    identities {\n      ...IdentitiesScreen_identities\n    }\n    id\n  }\n}\n\nfragment IdentitiesScreen_identities on IdentitiesQuery {\n  ...IdentitiesView_identities\n}\n\nfragment IdentitiesView_identities on IdentitiesQuery {\n  ownUsers {\n    localID\n    feedHash\n    profile {\n      name\n    }\n    wallets {\n      localID\n      accounts\n    }\n    apps {\n      localID\n      manifest {\n        name\n      }\n      users {\n        settings {\n          permissionsSettings {\n            permissionsChecked\n            grants {\n              BLOCKCHAIN_SEND\n            }\n          }\n        }\n        id\n      }\n      id\n    }\n    id\n  }\n  ownDevelopers {\n    localID\n    profile {\n      name\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "IdentitiesScreenQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
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
            "concreteType": "IdentitiesQuery",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "IdentitiesScreen_identities",
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
    "name": "IdentitiesScreenQuery",
    "argumentDefinitions": [],
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
            "concreteType": "IdentitiesQuery",
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
                  v0,
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
                    "concreteType": "OwnUserProfile",
                    "plural": false,
                    "selections": v1
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "wallets",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "UserWalletType",
                    "plural": true,
                    "selections": [
                      v0,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "accounts",
                        "args": null,
                        "storageKey": null
                      }
                    ]
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
                      v0,
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "manifest",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "AppManifestData",
                        "plural": false,
                        "selections": v1
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
                          v2
                        ]
                      },
                      v2
                    ]
                  },
                  v2
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
                  v0,
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "profile",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "OwnDeveloperProfile",
                    "plural": false,
                    "selections": v1
                  },
                  v2
                ]
              }
            ]
          },
          v2
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '2857eb4b1910aab25f5af1dcc054e75b';
module.exports = node;
