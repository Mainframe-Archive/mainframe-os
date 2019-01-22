/**
 * @flow
 * @relayHash c30ad28ceb51b94d5543e99b7a0aa829
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AppsScreen_apps$ref = any;
export type AppsScreenQueryVariables = {||};
export type AppsScreenQueryResponse = {|
  +viewer: {|
    +apps: {|
      +$fragmentRefs: AppsScreen_apps$ref
    |}
  |}
|};
export type AppsScreenQuery = {|
  variables: AppsScreenQueryVariables,
  response: AppsScreenQueryResponse,
|};
*/


/*
query AppsScreenQuery {
  viewer {
    apps {
      ...AppsScreen_apps
    }
    id
  }
}

fragment AppsScreen_apps on AppsQuery {
  ...AppsView_apps
}

fragment AppsView_apps on AppsQuery {
  installed {
    localID
    ...AppItem_installedApp
    id
  }
  own {
    localID
    ...AppItem_ownApp
    id
  }
}

fragment AppItem_installedApp on App {
  localID
  name
  manifest {
    permissions {
      optional {
        WEB_REQUEST
        BLOCKCHAIN_SEND
      }
      required {
        WEB_REQUEST
        BLOCKCHAIN_SEND
      }
    }
    author {
      id
      name
    }
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
          WEB_REQUEST {
            granted
            denied
          }
        }
      }
    }
    id
  }
}

fragment AppItem_ownApp on OwnApp {
  localID
  name
  developer {
    id
    name
  }
  versions {
    version
    permissions {
      optional {
        WEB_REQUEST
        BLOCKCHAIN_SEND
      }
      required {
        WEB_REQUEST
        BLOCKCHAIN_SEND
      }
    }
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
  "name": "name",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "BLOCKCHAIN_SEND",
  "args": null,
  "storageKey": null
},
v3 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "WEB_REQUEST",
    "args": null,
    "storageKey": null
  },
  v2
],
v4 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "permissions",
  "storageKey": null,
  "args": null,
  "concreteType": "AppPermissionsRequirements",
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
      "selections": v3
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "required",
      "storageKey": null,
      "args": null,
      "concreteType": "AppPermissionDefinitions",
      "plural": false,
      "selections": v3
    }
  ]
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v6 = [
  v5,
  v1
],
v7 = {
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
    v5
  ]
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "AppsScreenQuery",
  "id": null,
  "text": "query AppsScreenQuery {\n  viewer {\n    apps {\n      ...AppsScreen_apps\n    }\n    id\n  }\n}\n\nfragment AppsScreen_apps on AppsQuery {\n  ...AppsView_apps\n}\n\nfragment AppsView_apps on AppsQuery {\n  installed {\n    localID\n    ...AppItem_installedApp\n    id\n  }\n  own {\n    localID\n    ...AppItem_ownApp\n    id\n  }\n}\n\nfragment AppItem_installedApp on App {\n  localID\n  name\n  manifest {\n    permissions {\n      optional {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n      required {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n    }\n    author {\n      id\n      name\n    }\n  }\n  users {\n    localID\n    identity {\n      profile {\n        name\n      }\n      id\n    }\n    settings {\n      permissionsSettings {\n        permissionsChecked\n        grants {\n          BLOCKCHAIN_SEND\n          WEB_REQUEST {\n            granted\n            denied\n          }\n        }\n      }\n    }\n    id\n  }\n}\n\nfragment AppItem_ownApp on OwnApp {\n  localID\n  name\n  developer {\n    id\n    name\n  }\n  versions {\n    version\n    permissions {\n      optional {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n      required {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n    }\n  }\n  users {\n    localID\n    identity {\n      profile {\n        name\n      }\n      id\n    }\n    id\n  }\n}\n",
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
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
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
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
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
                      v4,
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "author",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "AppAuthor",
                        "plural": false,
                        "selections": v6
                      }
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
                      v0,
                      v7,
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
                                  v2,
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "WEB_REQUEST",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "WebRequestGrants",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "name": "granted",
                                        "args": null,
                                        "storageKey": null
                                      },
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "name": "denied",
                                        "args": null,
                                        "storageKey": null
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      v5
                    ]
                  },
                  v5
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
                    "name": "developer",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AppAuthor",
                    "plural": false,
                    "selections": v6
                  },
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
                      v0,
                      v7,
                      v5
                    ]
                  },
                  v5
                ]
              }
            ]
          },
          v5
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '210fbe1af5e37e7da7b7d4f11f7be256';
module.exports = node;
