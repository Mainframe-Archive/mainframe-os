/**
 * @flow
 * @relayHash 3dac3edf3e039c42dea639b2e8689a88
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type SetEthNetworkInput = {
  url: string,
  clientMutationId?: ?string,
};
export type SettingsMenuViewSetEthNetworkMutationVariables = {|
  input: SetEthNetworkInput
|};
export type SettingsMenuViewSetEthNetworkMutationResponse = {|
  +setEthNetwork: ?{|
    +viewer: {|
      +ethURL: string
    |}
  |}
|};
export type SettingsMenuViewSetEthNetworkMutation = {|
  variables: SettingsMenuViewSetEthNetworkMutationVariables,
  response: SettingsMenuViewSetEthNetworkMutationResponse,
|};
*/


/*
mutation SettingsMenuViewSetEthNetworkMutation(
  $input: SetEthNetworkInput!
) {
  setEthNetwork(input: $input) {
    viewer {
      ethURL
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
    "type": "SetEthNetworkInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "SetEthNetworkInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "ethURL",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "SettingsMenuViewSetEthNetworkMutation",
  "id": null,
  "text": "mutation SettingsMenuViewSetEthNetworkMutation(\n  $input: SetEthNetworkInput!\n) {\n  setEthNetwork(input: $input) {\n    viewer {\n      ethURL\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "SettingsMenuViewSetEthNetworkMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "setEthNetwork",
        "storageKey": null,
        "args": v1,
        "concreteType": "SetEthNetworkPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "User",
            "plural": false,
            "selections": [
              v2
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SettingsMenuViewSetEthNetworkMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "setEthNetwork",
        "storageKey": null,
        "args": v1,
        "concreteType": "SetEthNetworkPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "User",
            "plural": false,
            "selections": [
              v2,
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
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'c7fadb064f0135e390cf08ca37e87334';
module.exports = node;
