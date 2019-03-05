/**
 * @flow
 * @relayHash 8ea3ea987b970df49f988b9b2b726d8c
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AppsView_apps$ref = any;
export type AppInstallMutationInput = {
  userID: string,
  manifest: AppManifestInput,
  permissionsSettings: AppPermissionsSettingsInput,
  clientMutationId?: ?string,
};
export type AppManifestInput = {
  id: string,
  name: string,
  version: string,
  contentsHash: string,
  updateHash: string,
  permissions: AppPermissionsRequirementsInput,
  author: ManifestAuthorInput,
};
export type AppPermissionsRequirementsInput = {
  optional: AppPermissionDefinitionsInput,
  required: AppPermissionDefinitionsInput,
};
export type AppPermissionDefinitionsInput = {
  BLOCKCHAIN_SEND?: ?boolean,
  COMMS_CONTACT?: ?boolean,
  CONTACTS_READ?: ?boolean,
  WEB_REQUEST?: ?$ReadOnlyArray<?string>,
};
export type ManifestAuthorInput = {
  id: string,
  name: string,
};
export type AppPermissionsSettingsInput = {
  permissionsChecked: boolean,
  grants: PermissionGrantsInput,
};
export type PermissionGrantsInput = {
  BLOCKCHAIN_SEND?: ?boolean,
  COMMS_CONTACT?: ?boolean,
  CONTACTS_READ?: ?boolean,
  WEB_REQUEST: WebRequestGrantInput,
};
export type WebRequestGrantInput = {
  granted?: ?$ReadOnlyArray<?string>,
  denied?: ?$ReadOnlyArray<?string>,
};
export type appMutationsAppInstallMutationVariables = {|
  input: AppInstallMutationInput
|};
export type appMutationsAppInstallMutationResponse = {|
  +installApp: ?{|
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
export type appMutationsAppInstallMutation = {|
  variables: appMutationsAppInstallMutationVariables,
  response: appMutationsAppInstallMutationResponse,
|};
*/


/*
mutation appMutationsAppInstallMutation(
  $input: AppInstallMutationInput!
) {
  installApp(input: $input) {
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

fragment AppsView_apps on Apps {
  installed {
    localID
    mfid
    ...AppItem_installedApp
    id
  }
}

fragment AppItem_installedApp on App {
  mfid
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
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "AppInstallMutationInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "AppInstallMutationInput!"
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
  "concreteType": "App",
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
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "appMutationsAppInstallMutation",
  "id": null,
  "text": "mutation appMutationsAppInstallMutation(\n  $input: AppInstallMutationInput!\n) {\n  installApp(input: $input) {\n    app {\n      id\n      localID\n      name\n    }\n    viewer {\n      apps {\n        ...AppsView_apps\n      }\n      id\n    }\n  }\n}\n\nfragment AppsView_apps on Apps {\n  installed {\n    localID\n    mfid\n    ...AppItem_installedApp\n    id\n  }\n}\n\nfragment AppItem_installedApp on App {\n  mfid\n  localID\n  name\n  manifest {\n    permissions {\n      optional {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n      required {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n    }\n    author {\n      id\n      name\n    }\n  }\n  users {\n    localID\n    identity {\n      profile {\n        name\n      }\n      id\n    }\n    settings {\n      permissionsSettings {\n        permissionsChecked\n        grants {\n          BLOCKCHAIN_SEND\n          WEB_REQUEST {\n            granted\n            denied\n          }\n        }\n      }\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "appMutationsAppInstallMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "installApp",
        "storageKey": null,
        "args": v1,
        "concreteType": "AppInstallMutationPayload",
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
    "name": "appMutationsAppInstallMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "installApp",
        "storageKey": null,
        "args": v1,
        "concreteType": "AppInstallMutationPayload",
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
                      v3,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "mfid",
                        "args": null,
                        "storageKey": null
                      },
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
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "author",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "AppAuthor",
                            "plural": false,
                            "selections": [
                              v2,
                              v4
                            ]
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
                          v3,
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
                                  v4
                                ]
                              },
                              v2
                            ]
                          },
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
(node/*: any*/).hash = 'd3739c3812348d6740c01bf09811adc4';
module.exports = node;
