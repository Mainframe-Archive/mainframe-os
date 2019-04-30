/**
 * @flow
 * @relayHash 10e2acc4ed9f2a994c9153a2ff42e521
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type SettingsScreenQueryVariables = {||};
export type SettingsScreenQueryResponse = {|
  +viewer: {|
    +id: string
  |}
|};
export type SettingsScreenQuery = {|
  variables: SettingsScreenQueryVariables,
  response: SettingsScreenQueryResponse,
|};
*/


/*
query SettingsScreenQuery {
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
  "name": "SettingsScreenQuery",
  "id": null,
  "text": "query SettingsScreenQuery {\n  viewer {\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "SettingsScreenQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": v0
  },
  "operation": {
    "kind": "Operation",
    "name": "SettingsScreenQuery",
    "argumentDefinitions": [],
    "selections": v0
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'aaa10b22068917af8311ec2af918b69c';
module.exports = node;
