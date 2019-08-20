/**
 * @flow
 * @relayHash b839c50e01b03c06d305f2500b8b1b5e
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type DevtoolsRouterQueryVariables = {||};
export type DevtoolsRouterQueryResponse = {|
  +devtools: {|
    +developers: $ReadOnlyArray<{|
      +id: string
    |}>
  |}
|};
export type DevtoolsRouterQuery = {|
  variables: DevtoolsRouterQueryVariables,
  response: DevtoolsRouterQueryResponse,
|};
*/


/*
query DevtoolsRouterQuery {
  devtools {
    developers {
      id
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "devtools",
    "storageKey": null,
    "args": null,
    "concreteType": "Devtools",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "developers",
        "storageKey": null,
        "args": null,
        "concreteType": "OwnDeveloper",
        "plural": true,
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
  "operationKind": "query",
  "name": "DevtoolsRouterQuery",
  "id": null,
  "text": "query DevtoolsRouterQuery {\n  devtools {\n    developers {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "DevtoolsRouterQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": v0
  },
  "operation": {
    "kind": "Operation",
    "name": "DevtoolsRouterQuery",
    "argumentDefinitions": [],
    "selections": v0
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'bc4266e960a52f7aa2d9c4225526ec23';
module.exports = node;
