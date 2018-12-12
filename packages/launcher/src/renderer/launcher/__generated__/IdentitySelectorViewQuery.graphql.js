/**
 * @flow
 * @relayHash d8b91dbee99a893cca981b93ca71c32b
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type IdentitySelectorViewQueryVariables = {||};
export type IdentitySelectorViewQueryResponse = {|
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
  "text": "query IdentitySelectorViewQuery {\n  identities {\n    ownUsers {\n      localID\n      profile {\n        name\n      }\n      id\n    }\n    ownDevelopers {\n      localID\n      profile {\n        name\n      }\n      id\n    }\n  }\n}\n",
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
(node/*: any*/).hash = '6abb1f501e6d186adb7236af76c0163f';
module.exports = node;
