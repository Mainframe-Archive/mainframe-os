/**
 * @flow
 * @relayHash 1a56d7f72587a1381b7cd963f4c3c023
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type DeveloperAppsScreen_developer$ref = any;
export type DeveloperAppsScreenQueryVariables = {|
  developerID: string
|};
export type DeveloperAppsScreenQueryResponse = {|
  +developer: ?{|
    +$fragmentRefs: DeveloperAppsScreen_developer$ref
  |}
|};
export type DeveloperAppsScreenQuery = {|
  variables: DeveloperAppsScreenQueryVariables,
  response: DeveloperAppsScreenQueryResponse,
|};
*/


/*
query DeveloperAppsScreenQuery(
  $developerID: ID!
) {
  developer: node(id: $developerID) {
    __typename
    ... on OwnDeveloper {
      ...DeveloperAppsScreen_developer
    }
    id
  }
}

fragment DeveloperAppsScreen_developer on OwnDeveloper {
  ...CreateAppModal_developer
  apps {
    ...AppItem_ownApp
    id
  }
}

fragment CreateAppModal_developer on OwnDeveloper {
  localID
}

fragment AppItem_ownApp on OwnApp {
  localID
  publicID
  developer {
    localID
    profile {
      name
    }
    id
  }
  profile {
    name
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "developerID",
    "type": "ID!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "developerID"
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
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "DeveloperAppsScreenQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "developer",
        "name": "node",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "type": "OwnDeveloper",
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "DeveloperAppsScreen_developer",
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
    "name": "DeveloperAppsScreenQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "developer",
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
            "type": "OwnDeveloper",
            "selections": [
              (v3/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "apps",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnApp",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "publicID",
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
                  (v4/*: any*/),
                  (v2/*: any*/)
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "DeveloperAppsScreenQuery",
    "id": null,
    "text": "query DeveloperAppsScreenQuery(\n  $developerID: ID!\n) {\n  developer: node(id: $developerID) {\n    __typename\n    ... on OwnDeveloper {\n      ...DeveloperAppsScreen_developer\n    }\n    id\n  }\n}\n\nfragment DeveloperAppsScreen_developer on OwnDeveloper {\n  ...CreateAppModal_developer\n  apps {\n    ...AppItem_ownApp\n    id\n  }\n}\n\nfragment CreateAppModal_developer on OwnDeveloper {\n  localID\n}\n\nfragment AppItem_ownApp on OwnApp {\n  localID\n  publicID\n  developer {\n    localID\n    profile {\n      name\n    }\n    id\n  }\n  profile {\n    name\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '926d60a0103a5fbf6121c9c52b40b5cf';
module.exports = node;
