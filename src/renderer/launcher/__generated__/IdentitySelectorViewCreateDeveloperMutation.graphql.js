/**
 * @flow
 * @relayHash 30b8f9df56905db5b8bb44b750346db0
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
export type IdentitySelectorViewCreateDeveloperMutationVariables = {|
  input: CreateDeveloperInput
|};
export type IdentitySelectorViewCreateDeveloperMutationResponse = {|
  +createDeveloper: ?{|
    +developer: ?{|
      +localID: string,
      +profile: {|
        +name: string
      |},
    |}
  |}
|};
export type IdentitySelectorViewCreateDeveloperMutation = {|
  variables: IdentitySelectorViewCreateDeveloperMutationVariables,
  response: IdentitySelectorViewCreateDeveloperMutationResponse,
|};
*/


/*
mutation IdentitySelectorViewCreateDeveloperMutation(
  $input: CreateDeveloperInput!
) {
  createDeveloper(input: $input) {
    developer {
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
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "IdentitySelectorViewCreateDeveloperMutation",
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
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "developer",
            "storageKey": null,
            "args": null,
            "concreteType": "OwnDeveloper",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "IdentitySelectorViewCreateDeveloperMutation",
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
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "developer",
            "storageKey": null,
            "args": null,
            "concreteType": "OwnDeveloper",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "IdentitySelectorViewCreateDeveloperMutation",
    "id": null,
    "text": "mutation IdentitySelectorViewCreateDeveloperMutation(\n  $input: CreateDeveloperInput!\n) {\n  createDeveloper(input: $input) {\n    developer {\n      localID\n      profile {\n        name\n      }\n      id\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'd5bdda712245e88f16a110e996833d56';
module.exports = node;
