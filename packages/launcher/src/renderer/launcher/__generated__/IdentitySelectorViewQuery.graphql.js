/**
 * @flow
 * @relayHash edaa5909bbd2c6af100dfaae23ee609b
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type IdentitySelectorViewQueryVariables = {||};
export type IdentitySelectorViewQueryResponse = {|
  +identities: {|
    +ownUsers: ?$ReadOnlyArray<?{|
      +localId: string,
      +profile: ?{|
        +name: string
      |},
    |}>,
    +ownDevelopers: ?$ReadOnlyArray<?{|
      +localId: string,
      +profile: ?{|
        +name: string
      |},
    |}>,
  |}
|};
export type IdentitySelectorViewQuery = {|
  variables: IdentitySelectorViewQueryVariables,
  response: IdentitySelectorViewQueryResponse,
|};
*/


/*
query IdentitySelectorViewQuery {
  identities {
    ownUsers {
      localId
      profile {
        name
      }
      id
    }
    ownDevelopers {
      localId
      profile {
        name
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
  "name": "localId",
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
  "text": "query IdentitySelectorViewQuery {\n  identities {\n    ownUsers {\n      localId\n      profile {\n        name\n      }\n      id\n    }\n    ownDevelopers {\n      localId\n      profile {\n        name\n      }\n      id\n    }\n  }\n}\n",
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
  },
  "operation": {
    "kind": "Operation",
    "name": "IdentitySelectorViewQuery",
    "argumentDefinitions": [],
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
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '2dd96a82f27ef5b9d62b4a2bccccd929';
module.exports = node;
