/**
 * @flow
 * @relayHash 5e9778339ec4f58acccb7acada43457b
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type OwnAppsView_apps$ref = any;
export type PublishAppVersionInput = {
  appID: string,
  version: string,
  clientMutationId?: ?string,
};
export type OwnAppDetailViewPublishAppVersionMutationVariables = {|
  input: PublishAppVersionInput
|};
export type OwnAppDetailViewPublishAppVersionMutationResponse = {|
  +publishAppVersion: ?{|
    +contentsURI: string,
    +viewer: {|
      +apps: {|
        +$fragmentRefs: OwnAppsView_apps$ref
      |}
    |},
  |}
|};
export type OwnAppDetailViewPublishAppVersionMutation = {|
  variables: OwnAppDetailViewPublishAppVersionMutationVariables,
  response: OwnAppDetailViewPublishAppVersionMutationResponse,
|};
*/


/*
mutation OwnAppDetailViewPublishAppVersionMutation(
  $input: PublishAppVersionInput!
) {
  publishAppVersion(input: $input) {
    contentsURI
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
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "PublishAppVersionInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "PublishAppVersionInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "contentsURI",
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
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
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
  }
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "OwnAppDetailViewPublishAppVersionMutation",
  "id": null,
  "text": "mutation OwnAppDetailViewPublishAppVersionMutation(\n  $input: PublishAppVersionInput!\n) {\n  publishAppVersion(input: $input) {\n    contentsURI\n    viewer {\n      apps {\n        ...OwnAppsView_apps\n      }\n      id\n    }\n  }\n}\n\nfragment OwnAppsView_apps on Apps {\n  own {\n    localID\n    name\n    ...AppItem_ownApp\n    ...OwnAppDetailView_ownApp\n    id\n  }\n}\n\nfragment AppItem_ownApp on OwnApp {\n  localID\n  name\n  developer {\n    id\n    name\n  }\n  versions {\n    version\n    permissions {\n      optional {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n      required {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n    }\n  }\n  users {\n    localID\n    identity {\n      profile {\n        name\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment OwnAppDetailView_ownApp on OwnApp {\n  localID\n  name\n  contentsPath\n  developer {\n    id\n    name\n  }\n  versions {\n    version\n    publicationState\n    contentsURI\n    permissions {\n      optional {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n      required {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n      }\n    }\n  }\n  users {\n    localID\n    identity {\n      profile {\n        name\n      }\n      id\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "OwnAppDetailViewPublishAppVersionMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "publishAppVersion",
        "storageKey": null,
        "args": v1,
        "concreteType": "PublishAppVersionPayload",
        "plural": false,
        "selections": [
          v2,
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
    "name": "OwnAppDetailViewPublishAppVersionMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "publishAppVersion",
        "storageKey": null,
        "args": v1,
        "concreteType": "PublishAppVersionPayload",
        "plural": false,
        "selections": [
          v2,
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
                          v5,
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
                            "name": "publicationState",
                            "args": null,
                            "storageKey": null
                          },
                          v2
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
                              v5
                            ]
                          },
                          v5
                        ]
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "contentsPath",
                        "args": null,
                        "storageKey": null
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
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '2d52a378331ed1fbec523ca2f42d67fa';
module.exports = node;
