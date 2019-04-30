/**
 * @flow
 * @relayHash 8e38e01e01a202a47a1f640d40b4ca21
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type CreateAppModalQueryVariables = {||};
export type CreateAppModalQueryResponse = {|
  +viewer: {|
    +id: string
  |}
|};
export type CreateAppModalQuery = {|
  variables: CreateAppModalQueryVariables,
  response: CreateAppModalQueryResponse,
|};
*/


/*
query CreateAppModalQuery {
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
  "name": "CreateAppModalQuery",
  "id": null,
  "text": "query CreateAppModalQuery {\n  viewer {\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "CreateAppModalQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": v0
  },
  "operation": {
    "kind": "Operation",
    "name": "CreateAppModalQuery",
    "argumentDefinitions": [],
    "selections": v0
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '9582f1e9702683b813b522609173bba5';
module.exports = node;
