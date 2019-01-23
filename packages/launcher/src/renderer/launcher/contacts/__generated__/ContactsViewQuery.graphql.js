/**
 * @flow
 * @relayHash 854d7e52afb78f3b96a939d373bf4d85
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ContactsViewQueryVariables = {|
  feedHash: string
|};
export type ContactsViewQueryResponse = {|
  +peers: {|
    +peerLookupByFeed: ?{|
      +profile: {|
        +name: string
      |},
      +publicKey: string,
    |}
  |}
|};
export type ContactsViewQuery = {|
  variables: ContactsViewQueryVariables,
  response: ContactsViewQueryResponse,
|};
*/


/*
query ContactsViewQuery(
  $feedHash: String!
) {
  peers {
    peerLookupByFeed(feedHash: $feedHash) {
      profile {
        name
      }
      publicKey
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "feedHash",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "peers",
    "storageKey": null,
    "args": null,
    "concreteType": "PeersQuery",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "peerLookupByFeed",
        "storageKey": null,
        "args": [
          {
            "kind": "Variable",
            "name": "feedHash",
            "variableName": "feedHash",
            "type": "String!"
          }
        ],
        "concreteType": "Peer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "profile",
            "storageKey": null,
            "args": null,
            "concreteType": "ContactProfile",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "name",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "publicKey",
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
  "name": "ContactsViewQuery",
  "id": null,
  "text": "query ContactsViewQuery(\n  $feedHash: String!\n) {\n  peers {\n    peerLookupByFeed(feedHash: $feedHash) {\n      profile {\n        name\n      }\n      publicKey\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ContactsViewQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "ContactsViewQuery",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '3315d9492edb9b34541707ffbb58b320';
module.exports = node;
