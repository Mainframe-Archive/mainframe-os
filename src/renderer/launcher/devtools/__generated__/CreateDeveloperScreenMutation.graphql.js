/**
 * @flow
 * @relayHash 05ea7478c3b800dba3603c4542d13a63
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type CreateDeveloperInput = {|
  profile: UserProfileInput,
  clientMutationId?: ?string,
|};
export type UserProfileInput = {|
  name: string,
  avatar?: ?string,
|};
export type CreateDeveloperScreenMutationVariables = {|
  input: CreateDeveloperInput
|};
export type CreateDeveloperScreenMutationResponse = {|
  +createDeveloper: ?{|
    +developer: ?{|
      +id: string
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
    "variableName": "input"
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
  "kind": "LinkedField",
  "alias": null,
  "name": "developer",
  "storageKey": null,
  "args": null,
  "concreteType": "OwnDeveloper",
  "plural": false,
  "selections": [
    (v2/*: any*/)
  ]
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
    "name": "CreateDeveloperScreenMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createDeveloper",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateDeveloperPayload",
        "plural": false,
        "selections": [
          (v3/*: any*/),
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
                  (v4/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createDeveloper",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateDeveloperPayload",
        "plural": false,
        "selections": [
          (v3/*: any*/),
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
    "operationKind": "mutation",
    "name": "CreateDeveloperScreenMutation",
    "id": null,
    "text": "mutation CreateDeveloperScreenMutation(\n  $input: CreateDeveloperInput!\n) {\n  createDeveloper(input: $input) {\n    developer {\n      id\n    }\n    devtools {\n      developers {\n        profile {\n          name\n        }\n        id\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '6cee25f499fa92d0ffd238039a83b962';
module.exports = node;
