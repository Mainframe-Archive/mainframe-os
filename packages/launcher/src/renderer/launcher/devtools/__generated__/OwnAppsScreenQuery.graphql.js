/**
 * @flow
 * @relayHash 0d77aa069299a261bb26fd2aa4c8e2c0
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type OwnAppsScreen_devtools$ref = any;
export type OwnAppsScreenQueryVariables = {|
  developerID?: ?string
|};
export type OwnAppsScreenQueryResponse = {|
  +devtools: {|
    +developers: $ReadOnlyArray<{|
      +id: string
    |}>,
    +$fragmentRefs: OwnAppsScreen_devtools$ref,
  |}
|};
export type OwnAppsScreenQuery = {|
  variables: OwnAppsScreenQueryVariables,
  response: OwnAppsScreenQueryResponse,
|};
*/


/*
query OwnAppsScreenQuery(
  $developerID: ID
) {
  devtools {
    ...OwnAppsScreen_devtools_2ugfxy
    developers {
      id
    }
  }
}

fragment OwnAppsScreen_devtools_2ugfxy on Devtools {
  apps(developerID: $developerID) {
    ...AppItem_ownApp
    localID
    id
  }
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
    "type": "ID",
    "defaultValue": null
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "developers",
  "storageKey": null,
  "args": null,
  "concreteType": "OwnDeveloper",
  "plural": true,
  "selections": [
    v1
  ]
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
  "operationKind": "query",
  "name": "OwnAppsScreenQuery",
  "id": null,
  "text": "query OwnAppsScreenQuery(\n  $developerID: ID\n) {\n  devtools {\n    ...OwnAppsScreen_devtools_2ugfxy\n    developers {\n      id\n    }\n  }\n}\n\nfragment OwnAppsScreen_devtools_2ugfxy on Devtools {\n  apps(developerID: $developerID) {\n    ...AppItem_ownApp\n    localID\n    id\n  }\n}\n\nfragment AppItem_ownApp on OwnApp {\n  localID\n  publicID\n  developer {\n    localID\n    profile {\n      name\n    }\n    id\n  }\n  profile {\n    name\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "OwnAppsScreenQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "devtools",
        "storageKey": null,
        "args": null,
        "concreteType": "Devtools",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "OwnAppsScreen_devtools",
            "args": [
              {
                "kind": "Variable",
                "name": "developerID",
                "variableName": "developerID",
                "type": null
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
    "name": "OwnAppsScreenQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "devtools",
        "storageKey": null,
        "args": null,
        "concreteType": "Devtools",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "apps",
            "storageKey": null,
            "args": [
              {
                "kind": "Variable",
                "name": "developerID",
                "variableName": "developerID",
                "type": "ID"
              }
            ],
            "concreteType": "OwnApp",
            "plural": true,
            "selections": [
              v3,
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
                  v3,
                  v4,
                  v1
                ]
              },
              v4,
              v1
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
(node/*: any*/).hash = '674b0afc6fd71ee75983998dbfa103c1';
module.exports = node;
