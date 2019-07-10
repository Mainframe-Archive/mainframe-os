/**
 * @flow
 * @relayHash f88a1138ff1850d48de79413cd8d3581
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
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "AppsScreenQuery",
  "id": null,
  "text": "query AppsScreenQuery {\n  user: viewer {\n    ...AppsScreen_user\n    id\n  }\n}\n\nfragment AppsScreen_user on User {\n  id\n  apps {\n    localID\n    appVersion {\n      app {\n        publicID\n        id\n      }\n      manifest {\n        profile {\n          name\n        }\n        webDomains {\n          domain\n          internal\n          external\n        }\n      }\n      id\n    }\n    update {\n      toVersion {\n        installationState\n        manifest {\n          version\n        }\n        id\n      }\n      permissionsChanged\n    }\n    settings {\n      permissionsChecked\n      webDomains {\n        domain\n        internal\n        external\n      }\n      id\n    }\n    id\n  }\n}\n",
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
                      v1
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
                  v1,
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
