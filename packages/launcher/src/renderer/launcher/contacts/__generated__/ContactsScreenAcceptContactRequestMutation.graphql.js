/**
 * @flow
 * @relayHash d08a7f7c2629dbbc5c7923696f8dff07
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
export type ContactsScreenAcceptContactRequestMutationVariables = {|
  input: AcceptContactRequestInput
|};
export type ContactsScreenAcceptContactRequestMutationResponse = {|
  +acceptContactRequest: ?{|
    +viewer: {|
      +id: string
    |}
  |}
|};
export type ContactsScreenAcceptContactRequestMutation = {|
  variables: ContactsScreenAcceptContactRequestMutationVariables,
  response: ContactsScreenAcceptContactRequestMutationResponse,
|};
*/


/*
mutation ContactsScreenAcceptContactRequestMutation(
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
  "name": "ContactsScreenAcceptContactRequestMutation",
  "id": null,
  "text": "mutation ContactsScreenAcceptContactRequestMutation(\n  $input: AcceptContactRequestInput!\n) {\n  acceptContactRequest(input: $input) {\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ContactsScreenAcceptContactRequestMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "ContactsScreenAcceptContactRequestMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '7a97e45a3b96dc7ff7d2c890377374cd';
module.exports = node;
