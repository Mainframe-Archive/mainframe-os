/**
 * @flow
 * @relayHash 61cf4a93ccb2790a9a94c7dd53b54ac6
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type OwnAppsView_apps$ref = any;
export type SetAppPermissionsRequirementsInput = {
  appID: string,
  permissionsRequirements: AppPermissionsRequirementsInput,
  clientMutationId?: ?string,
};
export type AppPermissionsRequirementsInput = {
  optional: AppPermissionDefinitionsInput,
  required: AppPermissionDefinitionsInput,
};
export type AppPermissionDefinitionsInput = {
  BLOCKCHAIN_SEND?: ?boolean,
  BLOCKCHAIN_SIGN?: ?boolean,
  COMMS_CONTACT?: ?boolean,
  CONTACTS_READ?: ?boolean,
  WEB_REQUEST?: ?$ReadOnlyArray<?string>,
};
export type OwnAppDetailViewSetAppPermissionsRequirementsMutationVariables = {|
  input: SetAppPermissionsRequirementsInput
|};
export type OwnAppDetailViewSetAppPermissionsRequirementsMutationResponse = {|
  +setAppPermissionsRequirements: ?{|
    +viewer: {|
      +apps: {|
        +$fragmentRefs: OwnAppsView_apps$ref
      |}
    |}
  |}
|};
export type OwnAppDetailViewSetAppPermissionsRequirementsMutation = {|
  variables: OwnAppDetailViewSetAppPermissionsRequirementsMutationVariables,
  response: OwnAppDetailViewSetAppPermissionsRequirementsMutationResponse,
|};
*/


/*
mutation OwnAppDetailViewSetAppPermissionsRequirementsMutation(
  $input: SetAppPermissionsRequirementsInput!
) {
  setAppPermissionsRequirements(input: $input) {
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
        BLOCKCHAIN_SIGN
        COMMS_CONTACT
        CONTACTS_READ
      }
      required {
        WEB_REQUEST
        BLOCKCHAIN_SEND
        BLOCKCHAIN_SIGN
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
    "type": "SetAppPermissionsRequirementsInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "SetAppPermissionsRequirementsInput!"
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
    "name": "BLOCKCHAIN_SIGN",
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
  "name": "OwnAppDetailViewSetAppPermissionsRequirementsMutation",
  "id": null,
  "text": "mutation OwnAppDetailViewSetAppPermissionsRequirementsMutation(\n  $input: SetAppPermissionsRequirementsInput!\n) {\n  setAppPermissionsRequirements(input: $input) {\n    viewer {\n      apps {\n        ...OwnAppsView_apps\n      }\n      id\n    }\n  }\n}\n\nfragment OwnAppsView_apps on Apps {\n  own {\n    localID\n    name\n    ...AppItem_ownApp\n    ...OwnAppDetailView_ownApp\n    id\n  }\n}\n\nfragment AppItem_ownApp on OwnApp {\n  mfid\n  localID\n  name\n  developer {\n    id\n    name\n  }\n}\n\nfragment OwnAppDetailView_ownApp on OwnApp {\n  localID\n  mfid\n  name\n  contentsPath\n  updateFeedHash\n  developer {\n    id\n    name\n  }\n  publishedVersion\n  currentVersionData {\n    version\n    versionHash\n    permissions {\n      optional {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n        BLOCKCHAIN_SIGN\n        COMMS_CONTACT\n        CONTACTS_READ\n      }\n      required {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n        BLOCKCHAIN_SIGN\n        COMMS_CONTACT\n        CONTACTS_READ\n      }\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "OwnAppDetailViewSetAppPermissionsRequirementsMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "setAppPermissionsRequirements",
        "storageKey": null,
        "args": v1,
        "concreteType": "SetAppPermissionsRequirementsPayload",
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
    "name": "OwnAppDetailViewSetAppPermissionsRequirementsMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "setAppPermissionsRequirements",
        "storageKey": null,
        "args": v1,
        "concreteType": "SetAppPermissionsRequirementsPayload",
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
(node/*: any*/).hash = 'f35f1ca10fa351676864199904c87463';
module.exports = node;
