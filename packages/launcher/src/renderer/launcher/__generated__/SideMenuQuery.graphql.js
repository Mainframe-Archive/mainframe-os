/**
 * @flow
 * @relayHash 598c336f2dbc7e983c99bf4ead6972c7
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type SideMenuQueryVariables = {||};
export type SideMenuQueryResponse = {|
  +viewer: {|
    +id: string
  |}
|};
export type SideMenuQuery = {|
  variables: SideMenuQueryVariables,
  response: SideMenuQueryResponse,
|};
*/


/*
query SideMenuQuery {
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
  "name": "SideMenuQuery",
  "id": null,
  "text": "query SideMenuQuery {\n  viewer {\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "SideMenuQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": v0
  },
  "operation": {
    "kind": "Operation",
    "name": "SideMenuQuery",
    "argumentDefinitions": [],
    "selections": v0
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '187ca0dd87557e83d95ecf24bd180b55';
module.exports = node;
