/**
 * @flow
 * @relayHash 510cee9ecaba6a5a7a24afc4fcbb54ff
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type IdentitySelectorViewQueryVariables = {||};
export type IdentitySelectorViewQueryResponse = {|
  +viewer: {|
    +identities: {|
      +ownUsers: ?$ReadOnlyArray<?{|
        +localID: string,
        +profile: ?{|
          +name: string
        |},
      |}>,
      +ownDevelopers: ?$ReadOnlyArray<?{|
        +localID: string,
        +profile: ?{|
          +name: string
        |},
      |}>,
    |}
  |}
|};
export type IdentitySelectorViewQuery = {|
  variables: IdentitySelectorViewQueryVariables,
  response: IdentitySelectorViewQueryResponse,
|};
*/


/*
query IdentitySelectorViewQuery {
  viewer {
    identities {
      ownUsers {
        localID
        profile {
          name
        }
        id
      }
      ownDevelopers {
        localID
        profile {
          name
        }
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
v1 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  }
],
v2 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "profile",
  "storageKey": null,
  "args": null,
  "concreteType": "OwnUserProfile",
  "plural": false,
  "selections": v1
},
v3 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "profile",
  "storageKey": null,
  "args": null,
  "concreteType": "OwnDeveloperProfile",
  "plural": false,
  "selections": v1
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "IdentitySelectorViewQuery",
  "id": null,
  "text": "query IdentitySelectorViewQuery {\n  viewer {\n    identities {\n      ownUsers {\n        localID\n        profile {\n          name\n        }\n        id\n      }\n      ownDevelopers {\n        localID\n        profile {\n          name\n        }\n        id\n      }\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "IdentitySelectorViewQuery",
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
                  v0,
                  v2
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "ownDevelopers",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnDeveloperIdentity",
                "plural": true,
                "selections": [
                  v0,
                  v3
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
    "name": "IdentitySelectorViewQuery",
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
                  v2,
                  v4
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "ownDevelopers",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnDeveloperIdentity",
                "plural": true,
                "selections": [
                  v0,
                  v3,
                  v4
                ]
              }
            ]
          },
          v4
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '1a1097cd27de9e8ee25fef8c8813e060';
module.exports = node;
