/**
 * @flow
 * @relayHash ba25b515b2be935ae7e37ed1783ed7c2
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
export type AppDetailsScreenPublishAppVersionMutationVariables = {|
  input: PublishAppVersionInput
|};
export type AppDetailsScreenPublishAppVersionMutationResponse = {|
  +publishAppVersion: ?{|
    +versionHash: string,
    +viewer: {|
      +id: string
    |},
  |}
|};
export type AppDetailsScreenPublishAppVersionMutation = {|
  variables: AppDetailsScreenPublishAppVersionMutationVariables,
  response: AppDetailsScreenPublishAppVersionMutationResponse,
|};
*/


/*
mutation AppDetailsScreenPublishAppVersionMutation(
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
  "name": "AppDetailsScreenPublishAppVersionMutation",
  "id": null,
  "text": "mutation AppDetailsScreenPublishAppVersionMutation(\n  $input: PublishAppVersionInput!\n) {\n  publishAppVersion(input: $input) {\n    versionHash\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "AppDetailsScreenPublishAppVersionMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "AppDetailsScreenPublishAppVersionMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '187889fb459d0c379ce7beb6149782c4';
module.exports = node;
