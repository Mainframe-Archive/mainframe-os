/**
 * @flow
 * @relayHash 5400258c72d99da1b20d7c1fcbbcd23c
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type CreateDeveloperInput = {
  profile: UserProfileInput,
  clientMutationId?: ?string,
};
export type UserProfileInput = {
  name: string,
  avatar?: ?string,
};
export type CreateDeveloperScreenMutationVariables = {|
  input: CreateDeveloperInput
|};
export type CreateDeveloperScreenMutationResponse = {|
  +createDeveloper: ?{|
    +developer: ?{|
      +localID: string
    |},
    +devtools: {|
      +developers: $ReadOnlyArray<{|
        +profile: {|
          +name: string
        |}
      |}>
    |},
  |}
|};
export type CreateDeveloperScreenMutation = {|
  variables: CreateDeveloperScreenMutationVariables,
  response: CreateDeveloperScreenMutationResponse,
|};
*/


/*
mutation CreateDeveloperScreenMutation(
  $input: CreateDeveloperInput!
) {
  createDeveloper(input: $input) {
    developer {
      localID
      id
    }
    devtools {
      developers {
        profile {
          name
        }
        id
      }
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "CreateDeveloperInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "CreateDeveloperInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v3 = {
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
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "CreateDeveloperScreenMutation",
  "id": null,
  "text": "mutation CreateDeveloperScreenMutation(\n  $input: CreateDeveloperInput!\n) {\n  createDeveloper(input: $input) {\n    developer {\n      localID\n      id\n    }\n    devtools {\n      developers {\n        profile {\n          name\n        }\n        id\n      }\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "CreateDeveloperScreenMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createDeveloper",
        "storageKey": null,
        "args": v1,
        "concreteType": "CreateDeveloperPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "developer",
            "storageKey": null,
            "args": null,
            "concreteType": "OwnDeveloper",
            "plural": false,
            "selections": [
              v2
            ]
          },
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
                "name": "developers",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnDeveloper",
                "plural": true,
                "selections": [
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
    "name": "CreateDeveloperScreenMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createDeveloper",
        "storageKey": null,
        "args": v1,
        "concreteType": "CreateDeveloperPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "developer",
            "storageKey": null,
            "args": null,
            "concreteType": "OwnDeveloper",
            "plural": false,
            "selections": [
              v2,
              v4
            ]
          },
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
                "name": "developers",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnDeveloper",
                "plural": true,
                "selections": [
                  v3,
                  v4
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'd3c16f3bc5a9cbfbf1e7544df16666b1';
module.exports = node;
