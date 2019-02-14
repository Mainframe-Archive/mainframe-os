/**
 * @flow
 * @relayHash 46ab08d4883620ea8c3f34e65f2974b8
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type SetEthNetworkInput = {|
  url: string,
  clientMutationId?: ?string,
|};
export type SettingsMenuViewSetEthNetworkMutationVariables = {|
  input: SetEthNetworkInput
|};
export type SettingsMenuViewSetEthNetworkMutationResponse = {|
  +setEthNetwork: ?{|
    +viewer: {|
      +settings: {|
        +ethereumUrl: string
      |}
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
      settings {
        ethereumUrl
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
  "kind": "LinkedField",
  "alias": null,
  "name": "settings",
  "storageKey": null,
  "args": null,
  "concreteType": "Settings",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "ethereumUrl",
      "args": null,
      "storageKey": null
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "SettingsMenuViewSetEthNetworkMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "setEthNetwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "SetEthNetworkPayload",
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
              (v2/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SettingsMenuViewSetEthNetworkMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "setEthNetwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "SetEthNetworkPayload",
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
              (v2/*: any*/),
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
    "name": "SettingsMenuViewSetEthNetworkMutation",
    "id": null,
    "text": "mutation SettingsMenuViewSetEthNetworkMutation(\n  $input: SetEthNetworkInput!\n) {\n  setEthNetwork(input: $input) {\n    viewer {\n      settings {\n        ethereumUrl\n      }\n      id\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '00f6e56de1c760cf21efb0a3ca5010e6';
module.exports = node;
