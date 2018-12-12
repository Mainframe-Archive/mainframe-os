/**
 * @flow
 * @relayHash 5bcaa199638388014b77a14316995f6d
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AppsView_apps$ref = any;
export type LauncherQueryVariables = {||};
export type LauncherQueryResponse = {|
  +apps: {|
    +$fragmentRefs: AppsView_apps$ref
  |}
|};
export type LauncherQuery = {|
  variables: LauncherQueryVariables,
  response: LauncherQueryResponse,
|};
*/


/*
query LauncherQuery {
  apps {
    ...AppsView_apps
  }
}

fragment AppsView_apps on AppsQuery {
  installed {
    id
    appID
    name
    users {
      localId
      identity {
        profile {
          name
        }
        id
      }
      id
    }
  }
  own {
    id
    appID
    name
    users {
      localId
      identity {
        profile {
          name
        }
        id
      }
      id
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v2 = [
  v0,
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "appID",
    "args": null,
    "storageKey": null
  },
  v1,
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "users",
    "storageKey": null,
    "args": null,
    "concreteType": "AppUser",
    "plural": true,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "localId",
        "args": null,
        "storageKey": null
      },
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
            "concreteType": "OwnUserProfile",
            "plural": false,
            "selections": [
              v1
            ]
          },
          v0
        ]
      },
      v0
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "LauncherQuery",
  "id": null,
  "text": "query LauncherQuery {\n  apps {\n    ...AppsView_apps\n  }\n}\n\nfragment AppsView_apps on AppsQuery {\n  installed {\n    id\n    appID\n    name\n    users {\n      localId\n      identity {\n        profile {\n          name\n        }\n        id\n      }\n      id\n    }\n  }\n  own {\n    id\n    appID\n    name\n    users {\n      localId\n      identity {\n        profile {\n          name\n        }\n        id\n      }\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "LauncherQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "apps",
        "storageKey": null,
        "args": null,
        "concreteType": "AppsQuery",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "AppsView_apps",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "LauncherQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "apps",
        "storageKey": null,
        "args": null,
        "concreteType": "AppsQuery",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "installed",
            "storageKey": null,
            "args": null,
            "concreteType": "App",
            "plural": true,
            "selections": v2
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "own",
            "storageKey": null,
            "args": null,
            "concreteType": "OwnApp",
            "plural": true,
            "selections": v2
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '23ac4b31356cfa25998b89d40ad859ce';
module.exports = node;
