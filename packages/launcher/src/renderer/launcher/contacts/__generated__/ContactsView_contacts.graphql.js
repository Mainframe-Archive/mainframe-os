/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
export type ConnectionState = "CONNECTED" | "SENDING" | "SENT" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type ContactsView_contacts$ref: FragmentReference;
export type ContactsView_contacts = {|
  +userContacts: ?$ReadOnlyArray<?{|
    +peerID: string,
    +localID: string,
    +connectionState: ConnectionState,
    +profile: {|
      +name: ?string
    |},
  |}>,
  +$refType: ContactsView_contacts$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "ContactsView_contacts",
  "type": "Contacts",
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
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '5e88177880bca9d7531c1e599636bfc4';
module.exports = node;
