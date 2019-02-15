/**
 * @flow
 * @relayHash 60de3998107083b9ead2a25fcc6e258f
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type CreateDeveloperIdentityInput = {
  profile: UserProfileInput,
  clientMutationId?: ?string,
};
export type UserProfileInput = {
  name: string,
  avatar?: ?string,
};
export type CreateDevIdentityViewCreateDeveloperIdentityMutationVariables = {|
  input: CreateDeveloperIdentityInput
|};
export type CreateDevIdentityViewCreateDeveloperIdentityMutationResponse = {|
  +createDeveloperIdentity: ?{|
    +viewer: {|
      +identities: {|
        +ownDevelopers: ?$ReadOnlyArray<?{|
          +profile: {|
            +name: string
          |}
        |}>
      |}
    |}
  |}
|};
export type CreateDevIdentityViewCreateDeveloperIdentityMutation = {|
  variables: CreateDevIdentityViewCreateDeveloperIdentityMutationVariables,
  response: CreateDevIdentityViewCreateDeveloperIdentityMutationResponse,
|};
*/


/*
mutation CreateDevIdentityViewCreateDeveloperIdentityMutation(
  $input: CreateDeveloperIdentityInput!
) {
  createDeveloperIdentity(input: $input) {
    viewer {
      identities {
        ownDevelopers {
          profile {
            name
          }
          id
        }
      }
      id
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "CreateDeveloperIdentityInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "CreateDeveloperIdentityInput!"
  }
],
v2 = {
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
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "CreateDevIdentityViewCreateDeveloperIdentityMutation",
  "id": null,
  "text": "mutation CreateDevIdentityViewCreateDeveloperIdentityMutation(\n  $input: CreateDeveloperIdentityInput!\n) {\n  createDeveloperIdentity(input: $input) {\n    viewer {\n      identities {\n        ownDevelopers {\n          profile {\n            name\n          }\n          id\n        }\n      }\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "CreateDevIdentityViewCreateDeveloperIdentityMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createDeveloperIdentity",
        "storageKey": null,
        "args": v1,
        "concreteType": "CreateDeveloperIdentityPayload",
        "plural": false,
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
                      v2
                    ]
                  }
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
    "name": "CreateDevIdentityViewCreateDeveloperIdentityMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createDeveloperIdentity",
        "storageKey": null,
        "args": v1,
        "concreteType": "CreateDeveloperIdentityPayload",
        "plural": false,
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
                      v2,
                      v3
                    ]
                  }
                ]
              },
              v3
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e95f4d0abbfc546f0377959e44c19bac';
module.exports = node;
