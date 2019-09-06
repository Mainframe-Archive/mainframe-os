/**
 * @flow
 * @relayHash 903111fe6aaf7ecf356b8ba0d61942df
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type IdentitySelectorViewQueryVariables = {||};
export type IdentitySelectorViewQueryResponse = {|
  +viewer: {|
    +id: string
  |}
|};
export type IdentitySelectorViewQuery = {|
  variables: IdentitySelectorViewQueryVariables,
  response: IdentitySelectorViewQueryResponse,
|};
*/


/*
query IdentitySelectorViewQuery {
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
  "fragment": {
    "kind": "Fragment",
    "name": "IdentitySelectorViewQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "IdentitySelectorViewQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "IdentitySelectorViewQuery",
    "id": null,
    "text": "query IdentitySelectorViewQuery {\n  viewer {\n    id\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '0c4351c0f51bdcce984177c85906fe56';
module.exports = node;
