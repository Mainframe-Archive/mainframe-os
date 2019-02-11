/**
 * @flow
 * @relayHash 3d08c5419783951b1113af1ce4b87408
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type OwnAppsView_apps$ref = any;
export type AppCreateMutationInput = {
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
  BLOCKCHAIN_SEND?: ?boolean,
  COMMS_CONTACT?: ?boolean,
  CONTACTS_READ?: ?boolean,
  WEB_REQUEST?: ?$ReadOnlyArray<?string>,
};
export type appMutationsAppCreateMutationVariables = {|
  input: AppCreateMutationInput
|};
export type appMutationsAppCreateMutationResponse = {|
  +createApp: ?{|
    +app: ?{|
      +id: string,
      +localID: string,
      +name: string,
    |},
    +viewer: {|
      +apps: {|
        +$fragmentRefs: OwnAppsView_apps$ref
      |}
    |},
  |}
|};
export type appMutationsAppCreateMutation = {|
  variables: appMutationsAppCreateMutationVariables,
  response: appMutationsAppCreateMutationResponse,
|};
*/


/*
mutation appMutationsAppCreateMutation(
  $input: AppCreateMutationInput!
) {
  createApp(input: $input) {
    app {
      id
      localID
      name
    }
    viewer {
      apps {
        ...OwnAppsView_apps
      }
      id
    }
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
    versionHash
    permissions {
      optional {
        WEB_REQUEST
        BLOCKCHAIN_SEND
        COMMS_CONTACT
        CONTACTS_READ
      }
      required {
        WEB_REQUEST
        BLOCKCHAIN_SEND
        COMMS_CONTACT
        CONTACTS_READ
      }
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "AppCreateMutationInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "AppCreateMutationInput!"
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
v6 = [
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
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "COMMS_CONTACT",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "CONTACTS_READ",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "appMutationsAppCreateMutation",
  "id": null,
  "text": "mutation appMutationsAppCreateMutation(\n  $input: AppCreateMutationInput!\n) {\n  createApp(input: $input) {\n    app {\n      id\n      localID\n      name\n    }\n    viewer {\n      apps {\n        ...OwnAppsView_apps\n      }\n      id\n    }\n  }\n}\n\nfragment OwnAppsView_apps on Apps {\n  own {\n    localID\n    name\n    ...AppItem_ownApp\n    ...OwnAppDetailView_ownApp\n    id\n  }\n}\n\nfragment AppItem_ownApp on OwnApp {\n  localID\n  name\n  developer {\n    id\n    name\n  }\n  versions {\n    version\n    permissions {\n      optional {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n      required {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n    }\n  }\n  users {\n    localID\n    identity {\n      profile {\n        name\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment OwnAppDetailView_ownApp on OwnApp {\n  localID\n  name\n  contentsPath\n  developer {\n    id\n    name\n  }\n  versions {\n    version\n    versionHash\n    permissions {\n      optional {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n        COMMS_CONTACT\n        CONTACTS_READ\n      }\n      required {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n        COMMS_CONTACT\n        CONTACTS_READ\n      }\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "appMutationsAppCreateMutation",
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
        "concreteType": "AppCreateMutationPayload",
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
                    "name": "OwnAppsView_apps",
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
    "name": "appMutationsAppCreateMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createApp",
        "storageKey": null,
        "args": v1,
        "concreteType": "AppCreateMutationPayload",
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
                        "name": "developer",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "AppAuthor",
                        "plural": false,
                        "selections": [
                          v2,
                          v4
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
                                "selections": v6
                              },
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "required",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "AppPermissionDefinitions",
                                "plural": false,
                                "selections": v6
                              }
                            ]
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "versionHash",
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
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '954c5f8b516fc2de93670403fecc6b96';
module.exports = node;
