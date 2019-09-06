/**
 * @flow
 * @relayHash 92698746a5cb008cd22e5c2fc251f073
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AppDetailsScreen_app$ref = any;
export type AppDetailsScreenQueryVariables = {|
  appID: string
|};
export type AppDetailsScreenQueryResponse = {|
  +app: ?{|
    +$fragmentRefs: AppDetailsScreen_app$ref
  |}
|};
export type AppDetailsScreenQuery = {|
  variables: AppDetailsScreenQueryVariables,
  response: AppDetailsScreenQueryResponse,
|};
*/


/*
query AppDetailsScreenQuery(
  $appID: ID!
) {
  app: node(id: $appID) {
    __typename
    ... on OwnApp {
      ...AppDetailsScreen_app
    }
    id
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
    "name": "appID",
    "type": "ID!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "appID"
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
  "name": "version",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "AppDetailsScreenQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "app",
        "name": "node",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "type": "OwnApp",
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
    "name": "AppDetailsScreenQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "app",
        "name": "node",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "__typename",
            "args": null,
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "type": "OwnApp",
            "selections": [
              (v3/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "publicID",
                "args": null,
                "storageKey": null
              },
              (v4/*: any*/),
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
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v2/*: any*/)
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
                  (v5/*: any*/),
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
                  (v5/*: any*/)
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "viewerOwnAppID",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "AppDetailsScreenQuery",
    "id": null,
    "text": "query AppDetailsScreenQuery(\n  $appID: ID!\n) {\n  app: node(id: $appID) {\n    __typename\n    ... on OwnApp {\n      ...AppDetailsScreen_app\n    }\n    id\n  }\n}\n\nfragment AppDetailsScreen_app on OwnApp {\n  localID\n  publicID\n  profile {\n    name\n  }\n  contentsPath\n  developer {\n    localID\n    profile {\n      name\n    }\n    id\n  }\n  inProgressVersion {\n    version\n    webDomains {\n      domain\n      internal\n      external\n    }\n  }\n  latestPublishedVersion {\n    version\n  }\n  viewerOwnAppID\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'c24a27bbefea89c69b88d79c2a20d687';
module.exports = node;
