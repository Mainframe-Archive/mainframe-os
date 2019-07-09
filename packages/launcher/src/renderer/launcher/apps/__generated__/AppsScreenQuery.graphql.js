/**
 * @flow
 * @relayHash b41ab240c064a38683c1e22fdaa5e8fd
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AppsScreen_user$ref = any;
export type AppsScreenQueryVariables = {||};
export type AppsScreenQueryResponse = {|
  +user: {|
    +$fragmentRefs: AppsScreen_user$ref
  |}
|};
export type AppsScreenQuery = {|
  variables: AppsScreenQueryVariables,
  response: AppsScreenQueryResponse,
|};
*/


/*
query AppsScreenQuery {
  user: viewer {
    ...AppsScreen_user
    id
  }
}

fragment AppsScreen_user on User {
  id
  apps {
    localID
    appVersion {
      app {
        publicID
        id
      }
      manifest {
        profile {
          name
        }
        permissions {
          optional {
            CONTACT_COMMUNICATION
            CONTACT_LIST
            ETHEREUM_TRANSACTION
            WEB_REQUEST
          }
          required {
            CONTACT_COMMUNICATION
            CONTACT_LIST
            ETHEREUM_TRANSACTION
            WEB_REQUEST
          }
        }
      }
      id
    }
    update {
      toVersion {
        installationState
        manifest {
          version
        }
        id
      }
      permissionsChanged
    }
    settings {
      permissionsChecked
      permissionsGrants {
        CONTACT_COMMUNICATION
        CONTACT_LIST
        ETHEREUM_TRANSACTION
        WEB_REQUEST {
          granted
          denied
        }
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
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "CONTACT_COMMUNICATION",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "CONTACT_LIST",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "ETHEREUM_TRANSACTION",
  "args": null,
  "storageKey": null
},
v4 = [
  v1,
  v2,
  v3,
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "WEB_REQUEST",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "AppsScreenQuery",
  "id": null,
  "text": "query AppsScreenQuery {\n  user: viewer {\n    ...AppsScreen_user\n    id\n  }\n}\n\nfragment AppsScreen_user on User {\n  id\n  apps {\n    localID\n    appVersion {\n      app {\n        publicID\n        id\n      }\n      manifest {\n        profile {\n          name\n        }\n        permissions {\n          optional {\n            CONTACT_COMMUNICATION\n            CONTACT_LIST\n            ETHEREUM_TRANSACTION\n            WEB_REQUEST\n          }\n          required {\n            CONTACT_COMMUNICATION\n            CONTACT_LIST\n            ETHEREUM_TRANSACTION\n            WEB_REQUEST\n          }\n        }\n      }\n      id\n    }\n    update {\n      toVersion {\n        installationState\n        manifest {\n          version\n        }\n        id\n      }\n      permissionsChanged\n    }\n    settings {\n      permissionsChecked\n      permissionsGrants {\n        CONTACT_COMMUNICATION\n        CONTACT_LIST\n        ETHEREUM_TRANSACTION\n        WEB_REQUEST {\n          granted\n          denied\n        }\n      }\n      id\n    }\n    id\n  }\n}\n",
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
        "alias": "user",
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "AppsScreen_user",
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
        "alias": "user",
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          v0,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "apps",
            "storageKey": null,
            "args": null,
            "concreteType": "UserAppVersion",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "localID",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "appVersion",
                "storageKey": null,
                "args": null,
                "concreteType": "AppVersion",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "app",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "App",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "publicID",
                        "args": null,
                        "storageKey": null
                      },
                      v0
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "manifest",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AppManifest",
                    "plural": false,
                    "selections": [
                      {
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
                          }
                        ]
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
                            "selections": v4
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "required",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "AppPermissionDefinitions",
                            "plural": false,
                            "selections": v4
                          }
                        ]
                      }
                    ]
                  },
                  v0
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "update",
                "storageKey": null,
                "args": null,
                "concreteType": "AppUpdate",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "toVersion",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AppVersion",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "installationState",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "manifest",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "AppManifest",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "version",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      v0
                    ]
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "permissionsChanged",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "settings",
                "storageKey": null,
                "args": null,
                "concreteType": "UserAppSettings",
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
                    "name": "permissionsGrants",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AppPermissions",
                    "plural": false,
                    "selections": [
                      v1,
                      v2,
                      v3,
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
                  },
                  v0
                ]
              },
              v0
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'f84fe15c468a4aab8a45f8c9184d77a4';
module.exports = node;
