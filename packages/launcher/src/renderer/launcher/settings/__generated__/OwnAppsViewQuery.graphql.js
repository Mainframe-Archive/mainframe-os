/**
 * @flow
 * @relayHash 77e14bf9f83c2e184152e357b6ba1c35
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type OwnAppsView_apps$ref = any;
export type OwnAppsViewQueryVariables = {||};
export type OwnAppsViewQueryResponse = {|
  +viewer: {|
    +apps: {|
      +$fragmentRefs: OwnAppsView_apps$ref
    |}
  |}
|};
export type OwnAppsViewQuery = {|
  variables: OwnAppsViewQueryVariables,
  response: OwnAppsViewQueryResponse,
|};
*/


/*
query OwnAppsViewQuery {
  viewer {
    apps {
      ...OwnAppsView_apps
    }
    id
  }
}

fragment OwnAppsView_apps on Apps {
  own {
    localID
    name
    ...AppItem_ownApp
    ...OwnAppDetailView_ownApp
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

fragment OwnAppDetailView_ownApp on OwnApp {
  localID
  name
  contentsPath
  developer {
    id
    name
  }
  versions {
    version
    publicationState
    contentsURI
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
  "name": "id",
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
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "BLOCKCHAIN_SEND",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "OwnAppsViewQuery",
  "id": null,
  "text": "query OwnAppsViewQuery {\n  viewer {\n    apps {\n      ...OwnAppsView_apps\n    }\n    id\n  }\n}\n\nfragment OwnAppsView_apps on Apps {\n  own {\n    localID\n    name\n    ...AppItem_ownApp\n    ...OwnAppDetailView_ownApp\n    id\n  }\n}\n\nfragment AppItem_ownApp on OwnApp {\n  localID\n  name\n  developer {\n    id\n    name\n  }\n  versions {\n    version\n    permissions {\n      optional {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n      required {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n    }\n  }\n  users {\n    localID\n    identity {\n      profile {\n        name\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment OwnAppDetailView_ownApp on OwnApp {\n  localID\n  name\n  contentsPath\n  developer {\n    id\n    name\n  }\n  versions {\n    version\n    publicationState\n    contentsURI\n    permissions {\n      optional {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n      required {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n    }\n  }\n  users {\n    localID\n    identity {\n      profile {\n        name\n      }\n      id\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "OwnAppsViewQuery",
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
            "concreteType": "Apps",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "OwnAppsView_apps",
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
    "name": "OwnAppsViewQuery",
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
            "concreteType": "Apps",
            "plural": false,
            "selections": [
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
                    "selections": [
                      v2,
                      v1
                    ]
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
                      {
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
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "publicationState",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "contentsURI",
                        "args": null,
                        "storageKey": null
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
                      {
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
                            "concreteType": "NamedProfile",
                            "plural": false,
                            "selections": [
                              v1
                            ]
                          },
                          v2
                        ]
                      },
                      v2
                    ]
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "contentsPath",
                    "args": null,
                    "storageKey": null
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
(node/*: any*/).hash = 'ac5508ec9d96e5b260512dc5f3871aa3';
module.exports = node;
