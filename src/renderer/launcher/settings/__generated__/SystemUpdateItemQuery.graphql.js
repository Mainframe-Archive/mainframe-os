/**
 * @flow
 * @relayHash 29bc5d04900a6a5d5c24369c5f63d41b
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type SystemUpdateItem_systemUpdate$ref = any;
export type SystemUpdateItemQueryVariables = {||};
export type SystemUpdateItemQueryResponse = {|
  +systemUpdate: {|
    +$fragmentRefs: SystemUpdateItem_systemUpdate$ref
  |}
|};
export type SystemUpdateItemQuery = {|
  variables: SystemUpdateItemQueryVariables,
  response: SystemUpdateItemQueryResponse,
|};
*/


/*
query SystemUpdateItemQuery {
  systemUpdate {
    ...SystemUpdateItem_systemUpdate
    id
  }
}

fragment SystemUpdateItem_systemUpdate on SystemUpdate {
  status
  currentVersion
  newVersion
}
*/

const node/*: ConcreteRequest*/ = {
  "kind": "Request",
  "operationKind": "query",
  "name": "SystemUpdateItemQuery",
  "id": null,
  "text": "query SystemUpdateItemQuery {\n  systemUpdate {\n    ...SystemUpdateItem_systemUpdate\n    id\n  }\n}\n\nfragment SystemUpdateItem_systemUpdate on SystemUpdate {\n  status\n  currentVersion\n  newVersion\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "SystemUpdateItemQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "systemUpdate",
        "storageKey": null,
        "args": null,
        "concreteType": "SystemUpdate",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "SystemUpdateItem_systemUpdate",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SystemUpdateItemQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "systemUpdate",
        "storageKey": null,
        "args": null,
        "concreteType": "SystemUpdate",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "status",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "currentVersion",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "newVersion",
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
  }
};
// prettier-ignore
(node/*: any*/).hash = 'bc7b8b85b0ce9a63f1dfc6d4d303bca9';
module.exports = node;
