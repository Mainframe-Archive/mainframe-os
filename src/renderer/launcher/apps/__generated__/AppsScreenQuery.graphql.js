/**
 * @flow
 * @relayHash 690e9f630fe2acba9b4b51fa8e5108c8
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
    ...AppUpdateModal_userAppVersion
    localID
    appVersion {
      ...AppItem_appVersion
      app {
        publicID
        id
      }
      installationState
      manifest {
        profile {
          name
        }
        webDomains {
          domain
          internal
          external
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
      webDomains {
        domain
        internal
        external
      }
      id
    }
    id
  }
}

fragment AppUpdateModal_userAppVersion on UserAppVersion {
  localID
  settings {
    webDomains {
      domain
      internal
      external
    }
    id
  }
  update {
    fromVersion {
      manifest {
        profile {
          name
        }
        version
        webDomains {
          domain
          internal
          external
        }
      }
      id
    }
    toVersion {
      publicID
      manifest {
        profile {
          name
        }
        version
        webDomains {
          domain
          internal
          external
        }
      }
      id
    }
    permissionsChanged
  }
}

fragment AppItem_appVersion on AppVersion {
  localID
  installationState
  app {
    publicID
    id
  }
  developer {
    localID
    profile {
      name
    }
    id
  }
  manifest {
    profile {
      name
    }
  }
  update {
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
  "name": "localID",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "webDomains",
  "storageKey": null,
  "args": null,
  "concreteType": "WebDomainDefinition",
  "plural": true,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "domain",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internal",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "external",
      "args": null,
      "storageKey": null
    }
  ]
},
v3 = {
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
v4 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "manifest",
  "storageKey": null,
  "args": null,
  "concreteType": "AppManifest",
  "plural": false,
  "selections": [
    v3,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "version",
      "args": null,
      "storageKey": null
    },
    v2
  ]
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
  "name": "installationState",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "AppsScreenQuery",
  "id": null,
  "text": "query AppsScreenQuery {\n  user: viewer {\n    ...AppsScreen_user\n    id\n  }\n}\n\nfragment AppsScreen_user on User {\n  id\n  apps {\n    ...AppUpdateModal_userAppVersion\n    localID\n    appVersion {\n      ...AppItem_appVersion\n      app {\n        publicID\n        id\n      }\n      installationState\n      manifest {\n        profile {\n          name\n        }\n        webDomains {\n          domain\n          internal\n          external\n        }\n      }\n      id\n    }\n    update {\n      toVersion {\n        installationState\n        manifest {\n          version\n        }\n        id\n      }\n      permissionsChanged\n    }\n    settings {\n      permissionsChecked\n      webDomains {\n        domain\n        internal\n        external\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment AppUpdateModal_userAppVersion on UserAppVersion {\n  localID\n  settings {\n    webDomains {\n      domain\n      internal\n      external\n    }\n    id\n  }\n  update {\n    fromVersion {\n      manifest {\n        profile {\n          name\n        }\n        version\n        webDomains {\n          domain\n          internal\n          external\n        }\n      }\n      id\n    }\n    toVersion {\n      publicID\n      manifest {\n        profile {\n          name\n        }\n        version\n        webDomains {\n          domain\n          internal\n          external\n        }\n      }\n      id\n    }\n    permissionsChanged\n  }\n}\n\nfragment AppItem_appVersion on AppVersion {\n  localID\n  installationState\n  app {\n    publicID\n    id\n  }\n  developer {\n    localID\n    profile {\n      name\n    }\n    id\n  }\n  manifest {\n    profile {\n      name\n    }\n  }\n  update {\n    id\n  }\n}\n",
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
              v1,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "settings",
                "storageKey": null,
                "args": null,
                "concreteType": "UserAppSettings",
                "plural": false,
                "selections": [
                  v2,
                  v0,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "permissionsChecked",
                    "args": null,
                    "storageKey": null
                  }
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
                    "name": "fromVersion",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AppVersion",
                    "plural": false,
                    "selections": [
                      v4,
                      v0
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "toVersion",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AppVersion",
                    "plural": false,
                    "selections": [
                      v5,
                      v4,
                      v0,
                      v6
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
                "name": "appVersion",
                "storageKey": null,
                "args": null,
                "concreteType": "AppVersion",
                "plural": false,
                "selections": [
                  v1,
                  v6,
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "app",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "App",
                    "plural": false,
                    "selections": [
                      v5,
                      v0
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "developer",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Developer",
                    "plural": false,
                    "selections": [
                      v1,
                      v3,
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
                      v3,
                      v2
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "update",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AppVersion",
                    "plural": false,
                    "selections": [
                      v0
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
