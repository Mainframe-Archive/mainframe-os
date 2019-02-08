/**
 * @flow
 * @relayHash ed9376e625cba762bdbc4dd0e9e83f1c
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type SettingsScreen_settings$ref = any;
export type SettingsScreenQueryVariables = {||};
export type SettingsScreenQueryResponse = {|
  +viewer: {|
    +settings: {|
      +$fragmentRefs: SettingsScreen_settings$ref
    |}
  |}
|};
export type SettingsScreenQuery = {|
  variables: SettingsScreenQueryVariables,
  response: SettingsScreenQueryResponse,
|};
*/


/*
query SettingsScreenQuery {
  viewer {
    settings {
      ...SettingsScreen_settings
    }
    id
  }
}

fragment SettingsScreen_settings on Settings {
  ethereumUrl
}
*/

const node/*: ConcreteRequest*/ = {
  "kind": "Request",
  "operationKind": "query",
  "name": "SettingsScreenQuery",
  "id": null,
  "text": "query SettingsScreenQuery {\n  viewer {\n    settings {\n      ...SettingsScreen_settings\n    }\n    id\n  }\n}\n\nfragment SettingsScreen_settings on Settings {\n  ethereumUrl\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "SettingsScreenQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
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
            "name": "settings",
            "storageKey": null,
            "args": null,
            "concreteType": "Settings",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "SettingsScreen_settings",
                "args": null
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SettingsScreenQuery",
    "argumentDefinitions": [],
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
            "name": "settings",
            "storageKey": null,
            "args": null,
            "concreteType": "Settings",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "ethereumUrl",
                "args": null,
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
// prettier-ignore
(node/*: any*/).hash = '6f809e5f80c02ac0457e291c0221f514';
module.exports = node;
