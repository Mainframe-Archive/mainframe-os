/**
 * @flow
 * @relayHash 85baa31ef4c354b411271354bf5262c6
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type PublishAppVersionInput = {
  appID: string,
  version: string,
  clientMutationId?: ?string,
};
export type OwnAppDetailViewPublishAppVersionMutationVariables = {|
  input: PublishAppVersionInput
|};
export type OwnAppDetailViewPublishAppVersionMutationResponse = {|
  +publishAppVersion: ?{|
    +versionHash: string,
    +viewer: {|
      +id: string
    |},
  |}
|};
export type OwnAppDetailViewPublishAppVersionMutation = {|
  variables: OwnAppDetailViewPublishAppVersionMutationVariables,
  response: OwnAppDetailViewPublishAppVersionMutationResponse,
|};
*/


/*
mutation OwnAppDetailViewPublishAppVersionMutation(
  $input: PublishAppVersionInput!
) {
  publishAppVersion(input: $input) {
    versionHash
    viewer {
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
    "type": "PublishAppVersionInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "publishAppVersion",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "PublishAppVersionInput!"
      }
    ],
    "concreteType": "PublishAppVersionPayload",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "versionHash",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
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
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "OwnAppDetailViewPublishAppVersionMutation",
  "id": null,
  "text": "mutation OwnAppDetailViewPublishAppVersionMutation(\n  $input: PublishAppVersionInput!\n) {\n  publishAppVersion(input: $input) {\n    versionHash\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "OwnAppDetailViewPublishAppVersionMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "OwnAppDetailViewPublishAppVersionMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'dd0b794ad50074efe115c4717eb6d007';
module.exports = node;
