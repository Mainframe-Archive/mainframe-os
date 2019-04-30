/**
 * @flow
 * @relayHash 12edefa723e0b78a213b7499d85decf7
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type LauncherQueryVariables = {||};
export type LauncherQueryResponse = {|
  +viewer: {|
    +id: string
  |}
|};
export type LauncherQuery = {|
  variables: LauncherQueryVariables,
  response: LauncherQueryResponse,
|};
*/


/*
query LauncherQuery {
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
  "name": "LauncherQuery",
  "id": null,
  "text": "query LauncherQuery {\n  viewer {\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "LauncherQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": v0
  },
  "operation": {
    "kind": "Operation",
    "name": "LauncherQuery",
    "argumentDefinitions": [],
    "selections": v0
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'a79648e5a83b15381caafb602a43ed9a';
module.exports = node;
