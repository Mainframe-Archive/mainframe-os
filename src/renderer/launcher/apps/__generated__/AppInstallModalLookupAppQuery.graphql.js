/**
 * @flow
 * @relayHash 756581af15bc92826f87a87dec3b952a
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
          +localID: string,
          +publicID: string,
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
          |},
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
          localID
          publicID
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
    "variableName": "publicID"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "publicID",
  "args": null,
  "storageKey": null
},
v4 = {
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
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "AppInstallModalLookupAppQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
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
            "args": (v1/*: any*/),
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
                      (v2/*: any*/),
                      (v3/*: any*/),
                      (v4/*: any*/)
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
                  (v2/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
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
            "args": (v1/*: any*/),
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
                      (v2/*: any*/),
                      (v3/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/)
                    ]
                  },
                  (v5/*: any*/)
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
                  (v2/*: any*/),
                  (v5/*: any*/)
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "AppInstallModalLookupAppQuery",
    "id": null,
    "text": "query AppInstallModalLookupAppQuery(\n  $publicID: ID!\n) {\n  lookup {\n    appByID(publicID: $publicID) {\n      app {\n        latestAvailableVersion {\n          localID\n          publicID\n          manifest {\n            profile {\n              name\n            }\n            version\n            webDomains {\n              domain\n              internal\n              external\n            }\n          }\n          id\n        }\n        id\n      }\n      userAppVersion {\n        localID\n        id\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '81fb0ab562382f5ad6c518bf84fda2f3';
module.exports = node;
