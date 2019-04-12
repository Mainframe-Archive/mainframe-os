/**
 * @flow
 * @relayHash 825424c711a96db6fb5d5c9898e167d1
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type SideMenu_apps$ref = any;
type SideMenu_contacts$ref = any;
export type SideMenuQueryVariables = {|
  userID: string
|};
export type SideMenuQueryResponse = {|
  +viewer: {|
    +apps: {|
      +$fragmentRefs: SideMenu_apps$ref
    |},
    +contacts: {|
      +$fragmentRefs: SideMenu_contacts$ref
    |},
  |}
|};
export type SideMenuQuery = {|
  variables: SideMenuQueryVariables,
  response: SideMenuQueryResponse,
|};
*/


/*
query SideMenuQuery(
  $userID: String!
) {
  viewer {
    apps {
      ...SideMenu_apps
    }
    contacts {
      ...SideMenu_contacts_3iqrP
    }
    id
  }
}

fragment SideMenu_apps on Apps {
  updatesCount
}

fragment SideMenu_contacts_3iqrP on Contacts {
  invitesCount(userID: $userID)
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "userID",
    "type": "String!",
    "defaultValue": null
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "SideMenuQuery",
  "id": null,
  "text": "query SideMenuQuery(\n  $userID: String!\n) {\n  viewer {\n    apps {\n      ...SideMenu_apps\n    }\n    contacts {\n      ...SideMenu_contacts_3iqrP\n    }\n    id\n  }\n}\n\nfragment SideMenu_apps on Apps {\n  updatesCount\n}\n\nfragment SideMenu_contacts_3iqrP on Contacts {\n  invitesCount(userID: $userID)\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "SideMenuQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "apps",
            "storageKey": null,
            "args": null,
            "concreteType": "Apps",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "SideMenu_apps",
                "args": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "contacts",
            "storageKey": null,
            "args": null,
            "concreteType": "Contacts",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "SideMenu_contacts",
                "args": [
                  {
                    "kind": "Variable",
                    "name": "userID",
                    "variableName": "userID",
                    "type": null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SideMenuQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "Viewer",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "apps",
            "storageKey": null,
            "args": null,
            "concreteType": "Apps",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "updatesCount",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "contacts",
            "storageKey": null,
            "args": null,
            "concreteType": "Contacts",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "invitesCount",
                "args": [
                  {
                    "kind": "Variable",
                    "name": "userID",
                    "variableName": "userID",
                    "type": "String!"
                  }
                ],
                "storageKey": null
              }
            ]
          },
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
};
})();
// prettier-ignore
(node/*: any*/).hash = '3950e16a5f335a94670edace2a3a8021';
module.exports = node;
