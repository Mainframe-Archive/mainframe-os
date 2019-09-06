/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type IdentityEditModal_user$ref: FragmentReference;
declare export opaque type IdentityEditModal_user$fragmentType: IdentityEditModal_user$ref;
export type IdentityEditModal_user = {|
  +localID: string,
  +publicID: string,
  +privateProfile: boolean,
  +profile: {|
    +name: string,
    +avatar: ?string,
  |},
  +$refType: IdentityEditModal_user$ref,
|};
export type IdentityEditModal_user$data = IdentityEditModal_user;
export type IdentityEditModal_user$key = {
  +$data?: IdentityEditModal_user$data,
  +$fragmentRefs: IdentityEditModal_user$ref,
};
*/


const node/*: ReaderFragment*/ = {
  "kind": "Fragment",
  "name": "IdentityEditModal_user",
  "type": "User",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
      "name": "publicID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "privateProfile",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "profile",
      "storageKey": null,
      "args": null,
      "concreteType": "NamedProfile",
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
          "name": "avatar",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = 'd5f516e4dec0c9d375d445e3c326f336';
module.exports = node;
