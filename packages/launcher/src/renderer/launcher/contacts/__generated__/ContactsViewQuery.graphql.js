/**
 * @flow
 * @relayHash 619dd2ad365460a96d8937ffb94abae4
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
        +name: ?string
      |},
      +publicFeed: string,
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
      publicFeed
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
    "concreteType": "Peers",
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
            "concreteType": "GenericProfile",
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
            "name": "publicFeed",
            "args": null,
            "storageKey": null
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
  "text": "query ContactsViewQuery(\n  $feedHash: String!\n) {\n  peers {\n    peerLookupByFeed(feedHash: $feedHash) {\n      profile {\n        name\n      }\n      publicFeed\n      publicKey\n    }\n  }\n}\n",
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
(node/*: any*/).hash = 'c611705ab8415f9d50a5ca90317a4a03';
module.exports = node;
