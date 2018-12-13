/**
 * @flow
 * @relayHash dd14217d8ed22c9fedcc3b81a75e4d87
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AppsScreen_apps$ref = any;
export type AppsScreenQueryVariables = {||};
export type AppsScreenQueryResponse = {|
  +apps: {|
    +$fragmentRefs: AppsScreen_apps$ref
  |}
|};
export type AppsScreenQuery = {|
  variables: AppsScreenQueryVariables,
  response: AppsScreenQueryResponse,
|};
*/


/*
query AppsScreenQuery {
  apps {
    ...AppsScreen_apps
  }
}

fragment AppsScreen_apps on AppsQuery {
  ...AppsView_apps
}

fragment AppsView_apps on AppsQuery {
  installed {
    appID
    name
    manifest {
      permissions {
        optional {
          WEB_REQUEST
          BLOCKCHAIN_SEND
          id
        }
        required {
          WEB_REQUEST
          BLOCKCHAIN_SEND
          id
        }
        id
      }
      id
    }
    users {
      localID
      identity {
        profile {
          name
        }
        id
      }
      settings {
        permissionsSettings {
          permissionsChecked
          grants {
            BLOCKCHAIN_SEND
            WEB_REQUEST
          }
        }
      }
      id
    }
    id
  }
  own {
    appID
    name
    versions {
      version
      permissions {
        optional {
          WEB_REQUEST
          BLOCKCHAIN_SEND
          id
        }
        required {
          WEB_REQUEST
          BLOCKCHAIN_SEND
          id
        }
        id
      }
      id
    }
    users {
      localID
      identity {
        profile {
          name
        }
        id
      }
      id
    }
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "appID",
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
  "name": "WEB_REQUEST",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "BLOCKCHAIN_SEND",
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
  v3,
  v4
],
v6 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "permissions",
  "storageKey": null,
  "args": null,
  "concreteType": "AppRequestedPermissions",
  "plural": false,
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "optional",
      "storageKey": null,
      "args": null,
      "concreteType": "AppPermissionDefinitions",
      "plural": false,
      "selections": v5
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "required",
      "storageKey": null,
      "args": null,
      "concreteType": "AppPermissionDefinitions",
      "plural": false,
      "selections": v5
    },
    v4
  ]
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "identity",
  "storageKey": null,
  "args": null,
  "concreteType": "OwnUserIdentity",
  "plural": false,
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "profile",
      "storageKey": null,
      "args": null,
      "concreteType": "OwnUserProfile",
      "plural": false,
      "selections": [
        v1
      ]
    },
    v4
  ]
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "AppsScreenQuery",
  "id": null,
  "text": "query AppsScreenQuery {\n  apps {\n    ...AppsScreen_apps\n  }\n}\n\nfragment AppsScreen_apps on AppsQuery {\n  ...AppsView_apps\n}\n\nfragment AppsView_apps on AppsQuery {\n  installed {\n    appID\n    name\n    manifest {\n      permissions {\n        optional {\n          WEB_REQUEST\n          BLOCKCHAIN_SEND\n          id\n        }\n        required {\n          WEB_REQUEST\n          BLOCKCHAIN_SEND\n          id\n        }\n        id\n      }\n      id\n    }\n    users {\n      localID\n      identity {\n        profile {\n          name\n        }\n        id\n      }\n      settings {\n        permissionsSettings {\n          permissionsChecked\n          grants {\n            BLOCKCHAIN_SEND\n            WEB_REQUEST\n          }\n        }\n      }\n      id\n    }\n    id\n  }\n  own {\n    appID\n    name\n    versions {\n      version\n      permissions {\n        optional {\n          WEB_REQUEST\n          BLOCKCHAIN_SEND\n          id\n        }\n        required {\n          WEB_REQUEST\n          BLOCKCHAIN_SEND\n          id\n        }\n        id\n      }\n      id\n    }\n    users {\n      localID\n      identity {\n        profile {\n          name\n        }\n        id\n      }\n      id\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "AppsScreenQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "apps",
        "storageKey": null,
        "args": null,
        "concreteType": "AppsQuery",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "AppsScreen_apps",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "AppsScreenQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "apps",
        "storageKey": null,
        "args": null,
        "concreteType": "AppsQuery",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "installed",
            "storageKey": null,
            "args": null,
            "concreteType": "App",
            "plural": true,
            "selections": [
              v0,
              v1,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "manifest",
                "storageKey": null,
                "args": null,
                "concreteType": "AppManifestData",
                "plural": false,
                "selections": [
                  v6,
                  v4
                ]
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
                  v7,
                  v8,
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
                              v3,
                              v2
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
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "own",
            "storageKey": null,
            "args": null,
            "concreteType": "OwnApp",
            "plural": true,
            "selections": [
              v0,
              v1,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "versions",
                "storageKey": null,
                "args": null,
                "concreteType": "AppVersionData",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "version",
                    "args": null,
                    "storageKey": null
                  },
                  v6,
                  v4
                ]
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
                  v7,
                  v8,
                  v4
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
(node/*: any*/).hash = 'b11bdd4edffe95f9605739f7955013ec';
module.exports = node;
