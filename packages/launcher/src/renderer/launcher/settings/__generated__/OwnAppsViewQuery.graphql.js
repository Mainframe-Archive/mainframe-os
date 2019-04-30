/**
 * @flow
 * @relayHash fd9e04309d7355081cdb8f62ea01f46e
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type OwnAppsViewQueryVariables = {||};
export type OwnAppsViewQueryResponse = {|
  +viewer: {|
    +id: string
  |}
|};
export type OwnAppsViewQuery = {|
  variables: OwnAppsViewQueryVariables,
  response: OwnAppsViewQueryResponse,
|};
*/


/*
query OwnAppsViewQuery {
  viewer {
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
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
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "OwnAppsViewQuery",
  "id": null,
  "text": "query OwnAppsViewQuery {\n  viewer {\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "OwnAppsViewQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": v0
  },
  "operation": {
    "kind": "Operation",
    "name": "OwnAppsViewQuery",
    "argumentDefinitions": [],
    "selections": v0
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'b928d7d98ce06b7584ab30da139e527c';
module.exports = node;
