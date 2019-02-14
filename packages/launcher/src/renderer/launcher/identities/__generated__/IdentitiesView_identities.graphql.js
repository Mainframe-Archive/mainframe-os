/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type IdentityEditModal_ownUserIdentity$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type IdentitiesView_identities$ref: FragmentReference;
export type IdentitiesView_identities = {|
  +ownUsers: ?$ReadOnlyArray<?{|
    +localID: string,
    +feedHash: string,
    +profile: {|
      +name: string
    |},
    +apps: ?$ReadOnlyArray<?{|
      +localID: string,
      +manifest: {|
        +name: string
      |},
      +users: ?$ReadOnlyArray<?{|
        +settings: {|
          +permissionsSettings: {|
            +permissionsChecked: boolean,
            +grants: {|
              +BLOCKCHAIN_SEND: ?boolean
            |},
          |}
        |}
      |}>,
    |}>,
    +$fragmentRefs: IdentityEditModal_ownUserIdentity$ref,
  |}>,
  +ownDevelopers: ?$ReadOnlyArray<?{|
    +localID: string,
    +profile: {|
      +name: string
    |},
  |}>,
  +$refType: IdentitiesView_identities$ref,
|};
*/


const node/*: ReaderFragment*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v1 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  }
],
v2 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "profile",
  "storageKey": null,
  "args": null,
  "concreteType": "NamedProfile",
  "plural": false,
  "selections": (v1/*: any*/)
};
return {
  "kind": "Fragment",
  "name": "IdentitiesView_identities",
  "type": "Identities",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "ownUsers",
      "storageKey": null,
      "args": null,
      "concreteType": "OwnUserIdentity",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "IdentityEditModal_ownUserIdentity",
          "args": null
        },
        (v0/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "feedHash",
          "args": null,
          "storageKey": null
        },
        (v2/*: any*/),
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "apps",
          "storageKey": null,
          "args": null,
          "concreteType": "App",
          "plural": true,
          "selections": [
            (v0/*: any*/),
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "manifest",
              "storageKey": null,
              "args": null,
              "concreteType": "AppManifestData",
              "plural": false,
              "selections": (v1/*: any*/)
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "users",
              "storageKey": null,
              "args": null,
              "concreteType": "AppUser",
              "plural": true,
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "settings",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "AppUserSettings",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "permissionsSettings",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "AppPermissionsSettings",
                      "plural": false,
                      "selections": [
                        {
                          "kind": "ScalarField",
                          "alias": null,
                          "name": "permissionsChecked",
                          "args": null,
                          "storageKey": null
                        },
                        {
                          "kind": "LinkedField",
                          "alias": null,
                          "name": "grants",
                          "storageKey": null,
                          "args": null,
                          "concreteType": "AppPermissions",
                          "plural": false,
                          "selections": [
                            {
                              "kind": "ScalarField",
                              "alias": null,
                              "name": "BLOCKCHAIN_SEND",
                              "args": null,
                              "storageKey": null
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "ownDevelopers",
      "storageKey": null,
      "args": null,
      "concreteType": "OwnDeveloperIdentity",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        (v2/*: any*/)
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = '0f74049c86a42c875369196ede1862dc';
module.exports = node;
