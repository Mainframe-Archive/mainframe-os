/**
 * @flow
 * @relayHash 873d0f235bb8f5e964b0198087985436
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AppsView_apps$ref = any;
export type CreateAppMutationInput = {
  name: string,
  contentsPath: string,
  version: string,
  developerID: string,
  permissionsRequirements: AppPermissionsRequirementsInput,
  clientMutationId?: ?string,
};
export type AppPermissionsRequirementsInput = {
  optional: AppPermissionDefinitionsInput,
  required: AppPermissionDefinitionsInput,
};
export type AppPermissionDefinitionsInput = {
  WEB_REQUEST?: ?$ReadOnlyArray<?string>,
  BLOCKCHAIN_SEND?: ?boolean,
  SWARM_UPLOAD?: ?boolean,
  SWARM_DOWNLOAD?: ?boolean,
};
export type CreateAppModalCreateAppMutationVariables = {|
  input: CreateAppMutationInput
|};
export type CreateAppModalCreateAppMutationResponse = {|
  +createApp: ?{|
    +app: ?{|
      +id: string,
      +localID: string,
      +name: string,
    |},
    +viewer: {|
      +apps: {|
        +$fragmentRefs: AppsView_apps$ref
      |}
    |},
  |}
|};
export type CreateAppModalCreateAppMutation = {|
  variables: CreateAppModalCreateAppMutationVariables,
  response: CreateAppModalCreateAppMutationResponse,
|};
*/


/*
mutation CreateAppModalCreateAppMutation(
  $input: CreateAppMutationInput!
) {
  createApp(input: $input) {
    app {
      id
      localID
      name
    }
    viewer {
      apps {
        ...AppsView_apps
      }
      id
    }
  }
}

fragment AppsView_apps on AppsQuery {
  installed {
    ...AppItem_installedApp
    id
  }
  own {
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
}

fragment AppItem_ownApp on OwnApp {
  localID
  name
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
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "CreateAppMutationInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "CreateAppMutationInput!"
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
  "name": "name",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "app",
  "storageKey": null,
  "args": null,
  "concreteType": "OwnApp",
  "plural": false,
  "selections": [
    v2,
    v3,
    v4
  ]
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "WEB_REQUEST",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "BLOCKCHAIN_SEND",
  "args": null,
  "storageKey": null
},
v8 = [
  v6,
  v7
],
v9 = {
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
      "selections": v8
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "required",
      "storageKey": null,
      "args": null,
      "concreteType": "AppPermissionDefinitions",
      "plural": false,
      "selections": v8
    }
  ]
},
v10 = {
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
        v4
      ]
    },
    v2
  ]
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "CreateAppModalCreateAppMutation",
  "id": null,
  "text": "mutation CreateAppModalCreateAppMutation(\n  $input: CreateAppMutationInput!\n) {\n  createApp(input: $input) {\n    app {\n      id\n      localID\n      name\n    }\n    viewer {\n      apps {\n        ...AppsView_apps\n      }\n      id\n    }\n  }\n}\n\nfragment AppsView_apps on AppsQuery {\n  installed {\n    ...AppItem_installedApp\n    id\n  }\n  own {\n    ...AppItem_ownApp\n    id\n  }\n}\n\nfragment AppItem_installedApp on App {\n  localID\n  name\n  manifest {\n    permissions {\n      optional {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n      required {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n    }\n  }\n  users {\n    localID\n    identity {\n      profile {\n        name\n      }\n      id\n    }\n    settings {\n      permissionsSettings {\n        permissionsChecked\n        grants {\n          BLOCKCHAIN_SEND\n          WEB_REQUEST\n        }\n      }\n    }\n    id\n  }\n}\n\nfragment AppItem_ownApp on OwnApp {\n  localID\n  name\n  versions {\n    version\n    permissions {\n      optional {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n      required {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n    }\n  }\n  users {\n    localID\n    identity {\n      profile {\n        name\n      }\n      id\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "CreateAppModalCreateAppMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createApp",
        "storageKey": null,
        "args": v1,
        "concreteType": "CreateAppMutationPayload",
        "plural": false,
        "selections": [
          v5,
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
                    "name": "AppsView_apps",
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
    "name": "CreateAppModalCreateAppMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createApp",
        "storageKey": null,
        "args": v1,
        "concreteType": "CreateAppMutationPayload",
        "plural": false,
        "selections": [
          v5,
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
                      v3,
                      v4,
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "manifest",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "AppManifestData",
                        "plural": false,
                        "selections": [
                          v9
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
                          v3,
                          v10,
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
                                      v7,
                                      v6
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
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "own",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "OwnApp",
                    "plural": true,
                    "selections": [
                      v3,
                      v4,
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
                          v9
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
                          v3,
                          v10,
                          v2
                        ]
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
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '456c652e29c88e32ccc3ded47e35d0d8';
module.exports = node;
