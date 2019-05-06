/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type InviteContactModal_contact$ref = any;
export type ConnectionState = "CONNECTED" | "DECLINED" | "RECEIVED" | "SENDING_BLOCKCHAIN" | "SENDING_FEED" | "SENT_BLOCKCHAIN" | "SENT_FEED" | "%future added value";
export type StakeState = "RECLAIMED" | "RECLAIMING" | "SEIZED" | "STAKED" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type ContactsView_contacts$ref: FragmentReference;
export type ContactsView_contacts = {|
  +inviteStake: string,
  +userContacts: $ReadOnlyArray<{|
    +peerID: string,
    +localID: string,
    +connectionState: ConnectionState,
    +publicFeed: string,
    +invite: ?{|
      +ethNetwork: ?string,
      +inviteTX: ?string,
      +stake: {|
        +reclaimedTX: ?string,
        +amount: ?string,
        +state: StakeState,
      |},
    |},
    +profile: {|
      +name: ?string,
      +ethAddress: ?string,
    |},
    +$fragmentRefs: InviteContactModal_contact$ref,
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
      "kind": "ScalarField",
      "alias": null,
      "name": "inviteStake",
      "args": null,
      "storageKey": null
    },
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
          "kind": "FragmentSpread",
          "name": "InviteContactModal_contact",
          "args": null
        },
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
          "kind": "ScalarField",
          "alias": null,
          "name": "publicFeed",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "invite",
          "storageKey": null,
          "args": null,
          "concreteType": "ContactInviteData",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "ethNetwork",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "inviteTX",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "stake",
              "storageKey": null,
              "args": null,
              "concreteType": "InviteStake",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "reclaimedTX",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "amount",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "state",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
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
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "ethAddress",
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
(node/*: any*/).hash = 'e1e837510e074b329c1b55264239fb25';
module.exports = node;
