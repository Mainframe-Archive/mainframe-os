/**
 * @flow
 * @relayHash 84bd7c3eadbafac8db11d2d91d64240c
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AppDetailsScreen_app$ref = any;
export type CreateAppVersionInput = {
  appID: string,
  version: string,
  clientMutationId?: ?string,
};
export type AppDetailsScreenCreateAppVersionMutationVariables = {|
  input: CreateAppVersionInput
|};
export type AppDetailsScreenCreateAppVersionMutationResponse = {|
  +createAppVersion: ?{|
    +app: {|
      +$fragmentRefs: AppDetailsScreen_app$ref
    |}
  |}
|};
export type AppDetailsScreenCreateAppVersionMutation = {|
  variables: AppDetailsScreenCreateAppVersionMutationVariables,
  response: AppDetailsScreenCreateAppVersionMutationResponse,
|};
*/


/*
mutation AppDetailsScreenCreateAppVersionMutation(
  $input: CreateAppVersionInput!
) {
  createAppVersion(input: $input) {
    app {
      ...AppDetailsScreen_app
      id
    }
  }
}

fragment AppDetailsScreen_app on OwnApp {
  localID
  publicID
  profile {
    name
  }
  contentsPath
  developer {
    localID
    profile {
      name
    }
    id
  }
  inProgressVersion {
    version
    permissions {
      optional {
        CONTACT_COMMUNICATION
        CONTACT_LIST
        ETHEREUM_TRANSACTION
        WEB_REQUEST
      }
      required {
        CONTACT_COMMUNICATION
        CONTACT_LIST
        ETHEREUM_TRANSACTION
        WEB_REQUEST
      }
    }
  }
  latestPublishedVersion {
    version
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "CreateAppVersionInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "CreateAppVersionInput!"
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
  "kind": "LinkedField",
  "alias": null,
  "name": "profile",
  "storageKey": null,
  "args": null,
  "concreteType": "NamedProfile",
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
v6 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "CONTACT_COMMUNICATION",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "CONTACT_LIST",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "ETHEREUM_TRANSACTION",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "WEB_REQUEST",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "AppDetailsScreenCreateAppVersionMutation",
  "id": null,
  "text": "mutation AppDetailsScreenCreateAppVersionMutation(\n  $input: CreateAppVersionInput!\n) {\n  createAppVersion(input: $input) {\n    app {\n      ...AppDetailsScreen_app\n      id\n    }\n  }\n}\n\nfragment AppDetailsScreen_app on OwnApp {\n  localID\n  publicID\n  profile {\n    name\n  }\n  contentsPath\n  developer {\n    localID\n    profile {\n      name\n    }\n    id\n  }\n  inProgressVersion {\n    version\n    permissions {\n      optional {\n        CONTACT_COMMUNICATION\n        CONTACT_LIST\n        ETHEREUM_TRANSACTION\n        WEB_REQUEST\n      }\n      required {\n        CONTACT_COMMUNICATION\n        CONTACT_LIST\n        ETHEREUM_TRANSACTION\n        WEB_REQUEST\n      }\n    }\n  }\n  latestPublishedVersion {\n    version\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "AppDetailsScreenCreateAppVersionMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createAppVersion",
        "storageKey": null,
        "args": v1,
        "concreteType": "CreateAppVersionPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "app",
            "storageKey": null,
            "args": null,
            "concreteType": "OwnApp",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "AppDetailsScreen_app",
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
    "name": "AppDetailsScreenCreateAppVersionMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createAppVersion",
        "storageKey": null,
        "args": v1,
        "concreteType": "CreateAppVersionPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "app",
            "storageKey": null,
            "args": null,
            "concreteType": "OwnApp",
            "plural": false,
            "selections": [
              v2,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "publicID",
                "args": null,
                "storageKey": null
              },
              v3,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "contentsPath",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "developer",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnDeveloper",
                "plural": false,
                "selections": [
                  v2,
                  v3,
                  v4
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "inProgressVersion",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnAppVersion",
                "plural": false,
                "selections": [
                  v5,
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
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "latestPublishedVersion",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnAppVersion",
                "plural": false,
                "selections": [
                  v5
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
(node/*: any*/).hash = '78b3e2a4948d3808ceb87b0742bc5abf';
module.exports = node;
