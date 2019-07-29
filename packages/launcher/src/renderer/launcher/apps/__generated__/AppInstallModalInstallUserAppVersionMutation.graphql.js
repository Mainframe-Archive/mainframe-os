/**
 * @flow
 * @relayHash 551a3e47eaf77147a4aec2840a16c632
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AppsScreen_user$ref = any;
export type InstallUserAppVersionMutationInput = {
  appVersionID: string,
  webDomains: $ReadOnlyArray<WebDomainDefinitionInput>,
  clientMutationId?: ?string,
};
export type WebDomainDefinitionInput = {
  domain: string,
  internal?: ?boolean,
  external?: ?boolean,
};
export type AppInstallModalInstallUserAppVersionMutationVariables = {|
  input: InstallUserAppVersionMutationInput
|};
export type AppInstallModalInstallUserAppVersionMutationResponse = {|
  +installUserAppVersion: ?{|
    +viewer: {|
      +$fragmentRefs: AppsScreen_user$ref
    |}
  |}
|};
export type AppInstallModalInstallUserAppVersionMutation = {|
  variables: AppInstallModalInstallUserAppVersionMutationVariables,
  response: AppInstallModalInstallUserAppVersionMutationResponse,
|};
*/


/*
mutation AppInstallModalInstallUserAppVersionMutation(
  $input: InstallUserAppVersionMutationInput!
) {
  installUserAppVersion(input: $input) {
    viewer {
      ...AppsScreen_user
      id
    }
  }
}

fragment AppsScreen_user on User {
  id
  apps {
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
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "InstallUserAppVersionMutationInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "InstallUserAppVersionMutationInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "installationState",
  "args": null,
  "storageKey": null
},
v5 = {
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
v6 = {
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
  "operationKind": "mutation",
  "name": "AppInstallModalInstallUserAppVersionMutation",
  "id": null,
  "text": "mutation AppInstallModalInstallUserAppVersionMutation(\n  $input: InstallUserAppVersionMutationInput!\n) {\n  installUserAppVersion(input: $input) {\n    viewer {\n      ...AppsScreen_user\n      id\n    }\n  }\n}\n\nfragment AppsScreen_user on User {\n  id\n  apps {\n    localID\n    appVersion {\n      ...AppItem_appVersion\n      app {\n        publicID\n        id\n      }\n      installationState\n      manifest {\n        profile {\n          name\n        }\n        webDomains {\n          domain\n          internal\n          external\n        }\n      }\n      id\n    }\n    update {\n      toVersion {\n        installationState\n        manifest {\n          version\n        }\n        id\n      }\n      permissionsChanged\n    }\n    settings {\n      permissionsChecked\n      webDomains {\n        domain\n        internal\n        external\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment AppItem_appVersion on AppVersion {\n  localID\n  installationState\n  app {\n    publicID\n    id\n  }\n  developer {\n    localID\n    profile {\n      name\n    }\n    id\n  }\n  manifest {\n    profile {\n      name\n    }\n  }\n  update {\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "AppInstallModalInstallUserAppVersionMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "installUserAppVersion",
        "storageKey": null,
        "args": v1,
        "concreteType": "InstallUserAppVersionMutationPayload",
        "plural": false,
        "selections": [
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
                "name": "AppsScreen_user",
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
    "name": "AppInstallModalInstallUserAppVersionMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "installUserAppVersion",
        "storageKey": null,
        "args": v1,
        "concreteType": "InstallUserAppVersionMutationPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "User",
            "plural": false,
            "selections": [
              v2,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "apps",
                "storageKey": null,
                "args": null,
                "concreteType": "UserAppVersion",
                "plural": true,
                "selections": [
                  v3,
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "appVersion",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AppVersion",
                    "plural": false,
                    "selections": [
                      v3,
                      v4,
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
                          v2
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
                          v3,
                          v5,
                          v2
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
                          v5,
                          v6
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
                          v2
                        ]
                      },
                      v2
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
                          v4,
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
                          v2
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
                      v6,
                      v2
                    ]
                  },
                  v2
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'df305a302a20465413ec6b4bd5fa3552';
module.exports = node;
