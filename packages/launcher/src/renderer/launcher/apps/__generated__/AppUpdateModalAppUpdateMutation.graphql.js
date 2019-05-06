/**
 * @flow
 * @relayHash f99eac5bccc5f904c81653f4610b1baa
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AppsView_apps$ref = any;
export type AppUpdateMutationInput = {
  appID: string,
  userID: string,
  permissionsSettings?: ?AppPermissionsSettingsInput,
  clientMutationId?: ?string,
};
export type AppPermissionsSettingsInput = {
  permissionsChecked: boolean,
  grants: PermissionGrantsInput,
};
export type PermissionGrantsInput = {
  BLOCKCHAIN_SEND?: ?boolean,
  BLOCKCHAIN_SIGN?: ?boolean,
  COMMS_CONTACT?: ?boolean,
  CONTACTS_READ?: ?boolean,
  WEB_REQUEST: WebRequestGrantInput,
};
export type WebRequestGrantInput = {
  granted?: ?$ReadOnlyArray<?string>,
  denied?: ?$ReadOnlyArray<?string>,
};
export type AppUpdateModalAppUpdateMutationVariables = {|
  input: AppUpdateMutationInput
|};
export type AppUpdateModalAppUpdateMutationResponse = {|
  +updateApp: ?{|
    +viewer: {|
      +apps: {|
        +$fragmentRefs: AppsView_apps$ref
      |}
    |}
  |}
|};
export type AppUpdateModalAppUpdateMutation = {|
  variables: AppUpdateModalAppUpdateMutationVariables,
  response: AppUpdateModalAppUpdateMutationResponse,
|};
*/


/*
mutation AppUpdateModalAppUpdateMutation(
  $input: AppUpdateMutationInput!
) {
  updateApp(input: $input) {
    viewer {
      apps {
        ...AppsView_apps
      }
      id
    }
  }
}

fragment AppsView_apps on Apps {
  installed {
    ...AppItem_installedApp
    ...AppUpdateModal_app
    localID
    mfid
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
    name
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
    id
  }
}

fragment AppItem_installedApp on App {
  mfid
  localID
  name
  installationState
  manifest {
    author {
      id
      name
    }
  }
  update {
    manifest {
      version
    }
  }
}

fragment AppUpdateModal_app on App {
  localID
  mfid
  name
  manifest {
    version
  }
  update {
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
      version
    }
    permissionsChanged
  }
  users {
    localID
    settings {
      permissionsSettings {
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
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "AppUpdateMutationInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "AppUpdateMutationInput!"
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
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "version",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "BLOCKCHAIN_SEND",
  "args": null,
  "storageKey": null
},
v7 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "WEB_REQUEST",
    "args": null,
    "storageKey": null
  },
  v6
],
v8 = {
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
      "selections": v7
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "required",
      "storageKey": null,
      "args": null,
      "concreteType": "AppPermissionDefinitions",
      "plural": false,
      "selections": v7
    }
  ]
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "AppUpdateModalAppUpdateMutation",
  "id": null,
  "text": "mutation AppUpdateModalAppUpdateMutation(\n  $input: AppUpdateMutationInput!\n) {\n  updateApp(input: $input) {\n    viewer {\n      apps {\n        ...AppsView_apps\n      }\n      id\n    }\n  }\n}\n\nfragment AppsView_apps on Apps {\n  installed {\n    ...AppItem_installedApp\n    ...AppUpdateModal_app\n    localID\n    mfid\n    manifest {\n      permissions {\n        optional {\n          WEB_REQUEST\n          BLOCKCHAIN_SEND\n        }\n        required {\n          WEB_REQUEST\n          BLOCKCHAIN_SEND\n        }\n      }\n    }\n    name\n    users {\n      localID\n      identity {\n        profile {\n          name\n        }\n        id\n      }\n      settings {\n        permissionsSettings {\n          permissionsChecked\n          grants {\n            BLOCKCHAIN_SEND\n            WEB_REQUEST {\n              granted\n              denied\n            }\n          }\n        }\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment AppItem_installedApp on App {\n  mfid\n  localID\n  name\n  installationState\n  manifest {\n    author {\n      id\n      name\n    }\n  }\n  update {\n    manifest {\n      version\n    }\n  }\n}\n\nfragment AppUpdateModal_app on App {\n  localID\n  mfid\n  name\n  manifest {\n    version\n  }\n  update {\n    manifest {\n      permissions {\n        optional {\n          WEB_REQUEST\n          BLOCKCHAIN_SEND\n        }\n        required {\n          WEB_REQUEST\n          BLOCKCHAIN_SEND\n        }\n      }\n      version\n    }\n    permissionsChanged\n  }\n  users {\n    localID\n    settings {\n      permissionsSettings {\n        grants {\n          BLOCKCHAIN_SEND\n          WEB_REQUEST {\n            granted\n            denied\n          }\n        }\n      }\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "AppUpdateModalAppUpdateMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateApp",
        "storageKey": null,
        "args": v1,
        "concreteType": "AppUpdateMutationPayload",
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
                "name": "apps",
                "storageKey": null,
                "args": null,
                "concreteType": "Apps",
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
    "name": "AppUpdateModalAppUpdateMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateApp",
        "storageKey": null,
        "args": v1,
        "concreteType": "AppUpdateMutationPayload",
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
                "name": "apps",
                "storageKey": null,
                "args": null,
                "concreteType": "Apps",
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
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "mfid",
                        "args": null,
                        "storageKey": null
                      },
                      v2,
                      v3,
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
                        "concreteType": "AppManifestData",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "author",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "AppAuthor",
                            "plural": false,
                            "selections": [
                              v4,
                              v3
                            ]
                          },
                          v5,
                          v8
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "update",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "AppUpdateData",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "manifest",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "AppManifestData",
                            "plural": false,
                            "selections": [
                              v5,
                              v8
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
                        "name": "users",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "AppUser",
                        "plural": true,
                        "selections": [
                          v2,
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
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "grants",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "AppPermissions",
                                    "plural": false,
                                    "selections": [
                                      v6,
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
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "permissionsChecked",
                                    "args": null,
                                    "storageKey": null
                                  }
                                ]
                              }
                            ]
                          },
                          v4,
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
                                  v3
                                ]
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
(node/*: any*/).hash = 'ce163426574995ed118d543c70cad0e2';
module.exports = node;
