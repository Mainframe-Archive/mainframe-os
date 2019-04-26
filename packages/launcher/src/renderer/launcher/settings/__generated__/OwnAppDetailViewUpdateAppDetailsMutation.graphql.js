/**
 * @flow
 * @relayHash 7b7720e8bc815334590321335924033e
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type OwnAppsView_apps$ref = any;
export type UpdateAppDetailsInput = {
  appID: string,
  name: string,
  contentsPath: string,
  version: string,
  clientMutationId?: ?string,
};
export type OwnAppDetailViewUpdateAppDetailsMutationVariables = {|
  input: UpdateAppDetailsInput
|};
export type OwnAppDetailViewUpdateAppDetailsMutationResponse = {|
  +updateAppDetails: ?{|
    +viewer: {|
      +apps: {|
        +$fragmentRefs: OwnAppsView_apps$ref
      |}
    |}
  |}
|};
export type OwnAppDetailViewUpdateAppDetailsMutation = {|
  variables: OwnAppDetailViewUpdateAppDetailsMutationVariables,
  response: OwnAppDetailViewUpdateAppDetailsMutationResponse,
|};
*/


/*
mutation OwnAppDetailViewUpdateAppDetailsMutation(
  $input: UpdateAppDetailsInput!
) {
  updateAppDetails(input: $input) {
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
  mfid
  localID
  name
  developer {
    id
    name
  }
}

fragment OwnAppDetailView_ownApp on OwnApp {
  localID
  mfid
  name
  contentsPath
  updateFeedHash
  developer {
    id
    name
  }
  publishedVersion
  currentVersionData {
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
    "type": "UpdateAppDetailsInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "UpdateAppDetailsInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = [
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
  "name": "OwnAppDetailViewUpdateAppDetailsMutation",
  "id": null,
  "text": "mutation OwnAppDetailViewUpdateAppDetailsMutation(\n  $input: UpdateAppDetailsInput!\n) {\n  updateAppDetails(input: $input) {\n    viewer {\n      apps {\n        ...OwnAppsView_apps\n      }\n      id\n    }\n  }\n}\n\nfragment OwnAppsView_apps on Apps {\n  own {\n    localID\n    name\n    ...AppItem_ownApp\n    ...OwnAppDetailView_ownApp\n    id\n  }\n}\n\nfragment AppItem_ownApp on OwnApp {\n  mfid\n  localID\n  name\n  developer {\n    id\n    name\n  }\n}\n\nfragment OwnAppDetailView_ownApp on OwnApp {\n  localID\n  mfid\n  name\n  contentsPath\n  updateFeedHash\n  developer {\n    id\n    name\n  }\n  publishedVersion\n  currentVersionData {\n    version\n    versionHash\n    permissions {\n      optional {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n        COMMS_CONTACT\n        CONTACTS_READ\n      }\n      required {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n        COMMS_CONTACT\n        CONTACTS_READ\n      }\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "OwnAppDetailViewUpdateAppDetailsMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateAppDetails",
        "storageKey": null,
        "args": v1,
        "concreteType": "UpdateAppDetailsPayload",
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
    "name": "OwnAppDetailViewUpdateAppDetailsMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateAppDetails",
        "storageKey": null,
        "args": v1,
        "concreteType": "UpdateAppDetailsPayload",
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
                    "name": "own",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "OwnApp",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "localID",
                        "args": null,
                        "storageKey": null
                      },
                      v2,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "mfid",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "developer",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "AppAuthor",
                        "plural": false,
                        "selections": [
                          v3,
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
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "updateFeedHash",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "publishedVersion",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "currentVersionData",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "AppVersionData",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "version",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "versionHash",
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
                      v3
                    ]
                  }
                ]
              },
              v3
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e08a472a8dbccfea272e55c28528998a';
module.exports = node;
