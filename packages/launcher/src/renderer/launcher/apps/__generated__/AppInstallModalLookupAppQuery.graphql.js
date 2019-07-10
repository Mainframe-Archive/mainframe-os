/**
 * @flow
 * @relayHash 2b6adb8d827451ca35e0533b111832ed
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
            +webDomains: $ReadOnlyArray<{|
              +domain: string,
              +internal: ?boolean,
              +external: ?boolean,
            |}>,
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
            webDomains {
              domain
              internal
              external
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
v2 = {
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
      "name": "webDomains",
      "storageKey": null,
      "args": null,
      "concreteType": "WebDomainDefinition",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "domain",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "internal",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "external",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v4 = {
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
  "text": "query AppInstallModalLookupAppQuery(\n  $publicID: ID!\n) {\n  lookup {\n    appByID(publicID: $publicID) {\n      app {\n        latestAvailableVersion {\n          manifest {\n            profile {\n              name\n            }\n            version\n            webDomains {\n              domain\n              internal\n              external\n            }\n          }\n          id\n        }\n        id\n      }\n      userAppVersion {\n        localID\n        id\n      }\n    }\n  }\n}\n",
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
                      v2
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
                  v3
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
                      v2,
                      v4
                    ]
                  },
                  v4
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
                  v3,
                  v4
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
(node/*: any*/).hash = '0b469af9ea1a32cc95823f1bb06cd016';
module.exports = node;
