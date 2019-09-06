/**
 * @flow
 * @relayHash c89aa3b7130dd7af662cfcb185566019
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type EthereumNetworkSelector_user$ref = any;
export type EthereumNetworkSelectorQueryVariables = {||};
export type EthereumNetworkSelectorQueryResponse = {|
  +user: {|
    +$fragmentRefs: EthereumNetworkSelector_user$ref
  |}
|};
export type EthereumNetworkSelectorQuery = {|
  variables: EthereumNetworkSelectorQueryVariables,
  response: EthereumNetworkSelectorQueryResponse,
|};
*/


/*
query EthereumNetworkSelectorQuery {
  user: viewer {
    ...EthereumNetworkSelector_user
    id
  }
}

fragment EthereumNetworkSelector_user on User {
  ethURL
}
*/

const node/*: ConcreteRequest*/ = {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "EthereumNetworkSelectorQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "user",
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "EthereumNetworkSelector_user",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "EthereumNetworkSelectorQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "user",
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "ethURL",
            "args": null,
            "storageKey": null
          },
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
  },
  "params": {
    "operationKind": "query",
    "name": "EthereumNetworkSelectorQuery",
    "id": null,
    "text": "query EthereumNetworkSelectorQuery {\n  user: viewer {\n    ...EthereumNetworkSelector_user\n    id\n  }\n}\n\nfragment EthereumNetworkSelector_user on User {\n  ethURL\n}\n",
    "metadata": {}
  }
};
// prettier-ignore
(node/*: any*/).hash = '4782efe502d3475614ff5d6cf2171044';
module.exports = node;
