/**
 * @flow
 * @relayHash 88e1c1a1ebaa6297a457bcfc0948a432
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AppDetailsScreen_app$ref = any;
export type PublishAppVersionInput = {
  appID: string,
  clientMutationId?: ?string,
};
export type AppDetailsScreenPublishAppVersionMutationVariables = {|
  input: PublishAppVersionInput
|};
export type AppDetailsScreenPublishAppVersionMutationResponse = {|
  +publishAppVersion: ?{|
    +app: {|
      +$fragmentRefs: AppDetailsScreen_app$ref
    |},
    +versionHash: string,
  |}
|};
export type AppDetailsScreenPublishAppVersionMutation = {|
  variables: AppDetailsScreenPublishAppVersionMutationVariables,
  response: AppDetailsScreenPublishAppVersionMutationResponse,
|};
*/


/*
mutation AppDetailsScreenPublishAppVersionMutation(
  $input: PublishAppVersionInput!
) {
  publishAppVersion(input: $input) {
    app {
      ...AppDetailsScreen_app
      id
    }
    versionHash
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
  "name": "versionHash",
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
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "version",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "AppDetailsScreenPublishAppVersionMutation",
  "id": null,
  "text": "mutation AppDetailsScreenPublishAppVersionMutation(\n  $input: PublishAppVersionInput!\n) {\n  publishAppVersion(input: $input) {\n    app {\n      ...AppDetailsScreen_app\n      id\n    }\n    versionHash\n  }\n}\n\nfragment AppDetailsScreen_app on OwnApp {\n  localID\n  publicID\n  profile {\n    name\n  }\n  contentsPath\n  developer {\n    localID\n    profile {\n      name\n    }\n    id\n  }\n  inProgressVersion {\n    version\n    webDomains {\n      domain\n      internal\n      external\n    }\n  }\n  latestPublishedVersion {\n    version\n  }\n  viewerOwnAppID\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "AppDetailsScreenPublishAppVersionMutation",
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
          },
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "AppDetailsScreenPublishAppVersionMutation",
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
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "app",
            "storageKey": null,
            "args": null,
            "concreteType": "OwnApp",
            "plural": false,
            "selections": [
              v3,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "publicID",
                "args": null,
                "storageKey": null
              },
              v4,
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
                  v3,
                  v4,
                  v5
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
                  v6,
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
                  v6
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "viewerOwnAppID",
                "args": null,
                "storageKey": null
              },
              v5
            ]
          },
          v2
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'd1e149e091267bb6490ff302ae4e3d87';
module.exports = node;
