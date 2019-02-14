/**
 * @flow
 * @relayHash a5177a93eaef6ab3c280bc66d462f361
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type CreateAppModalQueryVariables = {||};
export type CreateAppModalQueryResponse = {|
  +viewer: {|
    +identities: {|
      +ownDevelopers: ?$ReadOnlyArray<?{|
        +localID: string
      |}>
    |}
  |}
|};
export type CreateAppModalQuery = {|
  variables: CreateAppModalQueryVariables,
  response: CreateAppModalQueryResponse,
|};
*/


/*
query CreateAppModalQuery {
  viewer {
    identities {
      ownDevelopers {
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
  "fragment": {
    "kind": "Fragment",
    "name": "CreateAppModalQuery",
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
            "concreteType": "Identities",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "ownDevelopers",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnDeveloperIdentity",
                "plural": true,
                "selections": [
                  (v0/*: any*/)
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
    "name": "CreateAppModalQuery",
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
            "concreteType": "Identities",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "ownDevelopers",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnDeveloperIdentity",
                "plural": true,
                "selections": [
                  (v0/*: any*/),
                  (v1/*: any*/)
                ]
              }
            ]
          },
          (v1/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "CreateAppModalQuery",
    "id": null,
    "text": "query CreateAppModalQuery {\n  viewer {\n    identities {\n      ownDevelopers {\n        localID\n        id\n      }\n    }\n    id\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'bc43dd993b0eca6de4577d815b6dc39e';
module.exports = node;
