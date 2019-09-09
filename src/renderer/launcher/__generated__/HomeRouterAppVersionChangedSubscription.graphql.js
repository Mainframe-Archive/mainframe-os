/**
 * @flow
 * @relayHash 53ca5f71d0b0936bbc9ba167f5ecbaa5
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AppItem_appVersion$ref = any;
export type HomeRouterAppVersionChangedSubscriptionVariables = {||};
export type HomeRouterAppVersionChangedSubscriptionResponse = {|
  +appVersionChanged: {|
    +appVersion: {|
      +$fragmentRefs: AppItem_appVersion$ref
    |}
  |}
|};
export type HomeRouterAppVersionChangedSubscription = {|
  variables: HomeRouterAppVersionChangedSubscriptionVariables,
  response: HomeRouterAppVersionChangedSubscriptionResponse,
|};
*/


/*
subscription HomeRouterAppVersionChangedSubscription {
  appVersionChanged {
    appVersion {
      ...AppItem_appVersion
      id
    }
  }
}

fragment AppItem_appVersion on AppVersion {
  localID
  installationState
  app {
    publicID
    id
  }
  developer {
    localID
    profile {
      name
    }
    id
  }
  manifest {
    profile {
      name
    }
  }
  update {
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
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
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "HomeRouterAppVersionChangedSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "appVersionChanged",
        "storageKey": null,
        "args": null,
        "concreteType": "AppVersionPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "appVersion",
            "storageKey": null,
            "args": null,
            "concreteType": "AppVersion",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "AppItem_appVersion",
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
    "name": "HomeRouterAppVersionChangedSubscription",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "appVersionChanged",
        "storageKey": null,
        "args": null,
        "concreteType": "AppVersionPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "appVersion",
            "storageKey": null,
            "args": null,
            "concreteType": "AppVersion",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "installationState",
                "args": null,
                "storageKey": null
              },
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
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "publicID",
                    "args": null,
                    "storageKey": null
                  },
                  (v1/*: any*/)
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "developer",
                "storageKey": null,
                "args": null,
                "concreteType": "Developer",
                "plural": false,
                "selections": [
                  (v0/*: any*/),
                  (v2/*: any*/),
                  (v1/*: any*/)
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "manifest",
                "storageKey": null,
                "args": null,
                "concreteType": "AppManifest",
                "plural": false,
                "selections": [
                  (v2/*: any*/)
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "update",
                "storageKey": null,
                "args": null,
                "concreteType": "AppVersion",
                "plural": false,
                "selections": [
                  (v1/*: any*/)
                ]
              },
              (v1/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "subscription",
    "name": "HomeRouterAppVersionChangedSubscription",
    "id": null,
    "text": "subscription HomeRouterAppVersionChangedSubscription {\n  appVersionChanged {\n    appVersion {\n      ...AppItem_appVersion\n      id\n    }\n  }\n}\n\nfragment AppItem_appVersion on AppVersion {\n  localID\n  installationState\n  app {\n    publicID\n    id\n  }\n  developer {\n    localID\n    profile {\n      name\n    }\n    id\n  }\n  manifest {\n    profile {\n      name\n    }\n  }\n  update {\n    id\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '241293dcac42795d9cbfc9eb865880c4';
module.exports = node;
