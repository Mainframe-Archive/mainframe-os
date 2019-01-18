/**
 * @flow
 * @relayHash a5ac857c620dfc1c46723567a5b37bd1
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type LauncherQueryVariables = {||};
export type LauncherQueryResponse = {|
  +viewer: {|
    +identities: {|
      +ownUsers: ?$ReadOnlyArray<?{|
        +localID: string
      |}>
    |}
  |}
|};
export type LauncherQuery = {|
  variables: LauncherQueryVariables,
  response: LauncherQueryResponse,
|};
*/


/*
query LauncherQuery {
  viewer {
    identities {
      ownUsers {
        localID
        id
      }
    }
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "LauncherQuery",
  "id": null,
  "text": "query LauncherQuery {\n  viewer {\n    identities {\n      ownUsers {\n        localID\n        id\n      }\n    }\n    id\n  }\n}\n",
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
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "identities",
            "storageKey": null,
            "args": null,
            "concreteType": "IdentitiesQuery",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "ownUsers",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnUserIdentity",
                "plural": true,
                "selections": [
                  v0
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
    "name": "LauncherQuery",
    "argumentDefinitions": [],
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
            "name": "identities",
            "storageKey": null,
            "args": null,
            "concreteType": "IdentitiesQuery",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "ownUsers",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnUserIdentity",
                "plural": true,
                "selections": [
                  v0,
                  v1
                ]
              }
            ]
          },
          v1
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '9c817f2905c715fb5f0767e94334b6ab';
module.exports = node;
