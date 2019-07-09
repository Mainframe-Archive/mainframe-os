/**
 * @flow
 * @relayHash 5d40451d453234cba90f7464d62593da
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AppInstallModalLookupAppQueryVariables = {|
  publicID: string
|};
export type AppInstallModalLookupAppQueryResponse = {|
  +lookup: {|
    +appByID: ?{|
      +app: {|
        +latestAvailableVersion: ?{|
          +manifest: {|
            +profile: {|
              +name: ?string
            |},
            +version: string,
            +permissions: {|
              +optional: {|
                +CONTACT_COMMUNICATION: ?boolean,
                +CONTACT_LIST: ?boolean,
                +ETHEREUM_TRANSACTION: ?boolean,
                +WEB_REQUEST: ?$ReadOnlyArray<?string>,
              |},
              +required: {|
                +CONTACT_COMMUNICATION: ?boolean,
                +CONTACT_LIST: ?boolean,
                +ETHEREUM_TRANSACTION: ?boolean,
                +WEB_REQUEST: ?$ReadOnlyArray<?string>,
              |},
            |},
          |}
        |}
      |},
      +userAppVersion: ?{|
        +localID: string
      |},
    |}
  |}
|};
export type AppInstallModalLookupAppQuery = {|
  variables: AppInstallModalLookupAppQueryVariables,
  response: AppInstallModalLookupAppQueryResponse,
|};
*/


/*
query AppInstallModalLookupAppQuery(
  $publicID: ID!
) {
  lookup {
    appByID(publicID: $publicID) {
      app {
        latestAvailableVersion {
          manifest {
            profile {
              name
            }
            version
            permissions {
              optional {
                CONTACT_COMMUNICATION
                CONTACT_LIST
                ETHEREUM_TRANSACTION
                WEB_REQUEST
              }
              required {
                CONTACT_COMMUNICATION
                CONTACT_LIST
                ETHEREUM_TRANSACTION
                WEB_REQUEST
              }
            }
          }
          id
        }
        id
      }
      userAppVersion {
        localID
        id
      }
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "publicID",
    "type": "ID!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "publicID",
    "variableName": "publicID",
    "type": "ID!"
  }
],
v2 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "CONTACT_COMMUNICATION",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "CONTACT_LIST",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "ETHEREUM_TRANSACTION",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "WEB_REQUEST",
    "args": null,
    "storageKey": null
  }
],
v3 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "manifest",
  "storageKey": null,
  "args": null,
  "concreteType": "AppManifest",
  "plural": false,
  "selections": [
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
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "version",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "permissions",
      "storageKey": null,
      "args": null,
      "concreteType": "AppPermissionsRequirements",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "optional",
          "storageKey": null,
          "args": null,
          "concreteType": "AppPermissionDefinitions",
          "plural": false,
          "selections": v2
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "required",
          "storageKey": null,
          "args": null,
          "concreteType": "AppPermissionDefinitions",
          "plural": false,
          "selections": v2
        }
      ]
    }
  ]
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "AppInstallModalLookupAppQuery",
  "id": null,
  "text": "query AppInstallModalLookupAppQuery(\n  $publicID: ID!\n) {\n  lookup {\n    appByID(publicID: $publicID) {\n      app {\n        latestAvailableVersion {\n          manifest {\n            profile {\n              name\n            }\n            version\n            permissions {\n              optional {\n                CONTACT_COMMUNICATION\n                CONTACT_LIST\n                ETHEREUM_TRANSACTION\n                WEB_REQUEST\n              }\n              required {\n                CONTACT_COMMUNICATION\n                CONTACT_LIST\n                ETHEREUM_TRANSACTION\n                WEB_REQUEST\n              }\n            }\n          }\n          id\n        }\n        id\n      }\n      userAppVersion {\n        localID\n        id\n      }\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "AppInstallModalLookupAppQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "lookup",
        "storageKey": null,
        "args": null,
        "concreteType": "Lookup",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "appByID",
            "storageKey": null,
            "args": v1,
            "concreteType": "AppLookupResult",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "app",
                "storageKey": null,
                "args": null,
                "concreteType": "App",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "latestAvailableVersion",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AppVersion",
                    "plural": false,
                    "selections": [
                      v3
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "userAppVersion",
                "storageKey": null,
                "args": null,
                "concreteType": "UserAppVersion",
                "plural": false,
                "selections": [
                  v4
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
    "name": "AppInstallModalLookupAppQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "lookup",
        "storageKey": null,
        "args": null,
        "concreteType": "Lookup",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "appByID",
            "storageKey": null,
            "args": v1,
            "concreteType": "AppLookupResult",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "app",
                "storageKey": null,
                "args": null,
                "concreteType": "App",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "latestAvailableVersion",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AppVersion",
                    "plural": false,
                    "selections": [
                      v3,
                      v5
                    ]
                  },
                  v5
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "userAppVersion",
                "storageKey": null,
                "args": null,
                "concreteType": "UserAppVersion",
                "plural": false,
                "selections": [
                  v4,
                  v5
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '0aa157d69404a5abb91d7368241cd580';
module.exports = node;
