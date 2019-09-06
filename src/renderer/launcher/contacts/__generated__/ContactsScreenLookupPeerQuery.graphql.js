/**
 * @flow
 * @relayHash 1139bc5475e73e8f0425d83c862f273c
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ContactsScreenLookupPeerQueryVariables = {|
  publicID: string
|};
export type ContactsScreenLookupPeerQueryResponse = {|
  +lookup: {|
    +peerByID: ?{|
      +profile: {|
        +name: ?string
      |},
      +publicID: string,
      +publicKey: ?string,
    |}
  |}
|};
export type ContactsScreenLookupPeerQuery = {|
  variables: ContactsScreenLookupPeerQueryVariables,
  response: ContactsScreenLookupPeerQueryResponse,
|};
*/


/*
query ContactsScreenLookupPeerQuery(
  $publicID: ID!
) {
  lookup {
    peerByID(publicID: $publicID) {
      profile {
        name
      }
      publicID
      publicKey
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "publicID",
    "type": "ID!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "lookup",
    "storageKey": null,
    "args": null,
    "concreteType": "Lookup",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "peerByID",
        "storageKey": null,
        "args": [
          {
            "kind": "Variable",
            "name": "publicID",
            "variableName": "publicID"
          }
        ],
        "concreteType": "PeerLookupResult",
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
            "name": "publicID",
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
  "fragment": {
    "kind": "Fragment",
    "name": "ContactsScreenLookupPeerQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "ContactsScreenLookupPeerQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "ContactsScreenLookupPeerQuery",
    "id": null,
    "text": "query ContactsScreenLookupPeerQuery(\n  $publicID: ID!\n) {\n  lookup {\n    peerByID(publicID: $publicID) {\n      profile {\n        name\n      }\n      publicID\n      publicKey\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '7253a71acabe5bdfe4409de6edb2ec95';
module.exports = node;
