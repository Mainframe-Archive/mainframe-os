/**
 * @flow
 * @relayHash 5104ddf5088e7640ec4a2c26ee504914
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AppDetailsScreen_app$ref = any;
export type UpdateAppDetailsInput = {
  appID: string,
  name: string,
  contentsPath: string,
  version: string,
  clientMutationId?: ?string,
};
export type AppDetailsScreenUpdateAppDetailsMutationVariables = {|
  input: UpdateAppDetailsInput
|};
export type AppDetailsScreenUpdateAppDetailsMutationResponse = {|
  +updateAppDetails: ?{|
    +app: {|
      +$fragmentRefs: AppDetailsScreen_app$ref
    |}
  |}
|};
export type AppDetailsScreenUpdateAppDetailsMutation = {|
  variables: AppDetailsScreenUpdateAppDetailsMutationVariables,
  response: AppDetailsScreenUpdateAppDetailsMutationResponse,
|};
*/


/*
mutation AppDetailsScreenUpdateAppDetailsMutation(
  $input: UpdateAppDetailsInput!
) {
  updateAppDetails(input: $input) {
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
    webDomains {
      domain
      internal
      external
    }
  }
  latestPublishedVersion {
    version
  }
  viewerOwnAppID
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
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "AppDetailsScreenUpdateAppDetailsMutation",
  "id": null,
  "text": "mutation AppDetailsScreenUpdateAppDetailsMutation(\n  $input: UpdateAppDetailsInput!\n) {\n  updateAppDetails(input: $input) {\n    app {\n      ...AppDetailsScreen_app\n      id\n    }\n  }\n}\n\nfragment AppDetailsScreen_app on OwnApp {\n  localID\n  publicID\n  profile {\n    name\n  }\n  contentsPath\n  developer {\n    localID\n    profile {\n      name\n    }\n    id\n  }\n  inProgressVersion {\n    version\n    webDomains {\n      domain\n      internal\n      external\n    }\n  }\n  latestPublishedVersion {\n    version\n  }\n  viewerOwnAppID\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "AppDetailsScreenUpdateAppDetailsMutation",
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
    "name": "AppDetailsScreenUpdateAppDetailsMutation",
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "viewerOwnAppID",
                "args": null,
                "storageKey": null
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
(node/*: any*/).hash = '51d5f7c86fa345db46fbf68abff34da7';
module.exports = node;
