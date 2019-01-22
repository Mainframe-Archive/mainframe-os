/**
 * @flow
 * @relayHash ddd3696632e19329827215cd2d9c6d23
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Launcher_identities$ref = any;
export type LauncherQueryVariables = {||};
export type LauncherQueryResponse = {|
  +viewer: {|
    +identities: {|
      +$fragmentRefs: Launcher_identities$ref
    |}
  |}
|};
export type LauncherQuery = {|
  variables: LauncherQueryVariables,
  response: LauncherQueryResponse,
|};
*/


/*
query LauncherQuery {
  viewer {
    identities {
      ...Launcher_identities
    }
    id
  }
}

fragment Launcher_identities on IdentitiesQuery {
  ownUsers {
    defaultEthAddress
    localID
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "LauncherQuery",
  "id": null,
  "text": "query LauncherQuery {\n  viewer {\n    identities {\n      ...Launcher_identities\n    }\n    id\n  }\n}\n\nfragment Launcher_identities on IdentitiesQuery {\n  ownUsers {\n    defaultEthAddress\n    localID\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "LauncherQuery",
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
            "name": "identities",
            "storageKey": null,
            "args": null,
            "concreteType": "IdentitiesQuery",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "Launcher_identities",
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
    "name": "LauncherQuery",
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
            "name": "identities",
            "storageKey": null,
            "args": null,
            "concreteType": "IdentitiesQuery",
            "plural": false,
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
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "defaultEthAddress",
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
                  v0
                ]
              }
            ]
          },
          v0
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '7b17d4721b814a9fdf9e02d9022a155d';
module.exports = node;
