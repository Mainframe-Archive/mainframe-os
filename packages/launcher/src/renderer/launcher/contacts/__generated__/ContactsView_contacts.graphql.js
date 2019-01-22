/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
export type ContactConnection = "CONNECTED" | "SENT" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type ContactsView_contacts$ref: FragmentReference;
export type ContactsView_contacts = {|
  +userContacts: ?$ReadOnlyArray<?{|
    +peerID: string,
    +localID: string,
    +connectionState: ContactConnection,
    +profile: {|
      +name: string
    |},
  |}>,
  +$refType: ContactsView_contacts$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "ContactsView_contacts",
  "type": "ContactsQuery",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "userID",
      "type": "String!",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "userContacts",
      "storageKey": null,
      "args": [
        {
          "kind": "Variable",
          "name": "userID",
          "variableName": "userID",
          "type": "String!"
        }
      ],
      "concreteType": "Contact",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "peerID",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "localID",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "connectionState",
          "args": null,
          "storageKey": null
        },
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
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '8040c38454634df0e0e2ed7d663bf068';
module.exports = node;
