/**
 * @flow
 * @relayHash 51fa29b66538f87a052ab5772e78755f
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AcceptContactRequestInput = {
  peerID: string,
  userID: string,
  clientMutationId?: ?string,
};
export type ContactsViewAcceptContactRequestMutationVariables = {|
  input: AcceptContactRequestInput
|};
export type ContactsViewAcceptContactRequestMutationResponse = {|
  +acceptContactRequest: ?{|
    +viewer: {|
      +id: string
    |}
  |}
|};
export type ContactsViewAcceptContactRequestMutation = {|
  variables: ContactsViewAcceptContactRequestMutationVariables,
  response: ContactsViewAcceptContactRequestMutationResponse,
|};
*/


/*
mutation ContactsViewAcceptContactRequestMutation(
  $input: AcceptContactRequestInput!
) {
  acceptContactRequest(input: $input) {
    viewer {
      id
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "AcceptContactRequestInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "acceptContactRequest",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "AcceptContactRequestInput!"
      }
    ],
    "concreteType": "AcceptContactRequestPayload",
    "plural": false,
    "selections": [
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
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "ContactsViewAcceptContactRequestMutation",
  "id": null,
  "text": "mutation ContactsViewAcceptContactRequestMutation(\n  $input: AcceptContactRequestInput!\n) {\n  acceptContactRequest(input: $input) {\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ContactsViewAcceptContactRequestMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "ContactsViewAcceptContactRequestMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '053deec531119bea2a7f873c9908b11a';
module.exports = node;
