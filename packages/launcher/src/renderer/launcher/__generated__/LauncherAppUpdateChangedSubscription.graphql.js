/**
 * @flow
 * @relayHash 0a7cd7c4cbffa09c559bdc70e4795665
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AppItem_installedApp$ref = any;
export type LauncherAppUpdateChangedSubscriptionVariables = {||};
export type LauncherAppUpdateChangedSubscriptionResponse = {|
  +appUpdateChanged: {|
    +app: {|
      +$fragmentRefs: AppItem_installedApp$ref
    |},
    +viewer: {|
      +apps: {|
        +updatesCount: number
      |}
    |},
  |}
|};
export type LauncherAppUpdateChangedSubscription = {|
  variables: LauncherAppUpdateChangedSubscriptionVariables,
  response: LauncherAppUpdateChangedSubscriptionResponse,
|};
*/


/*
subscription LauncherAppUpdateChangedSubscription {
  appUpdateChanged {
    app {
      ...AppItem_installedApp
      id
    }
    viewer {
      apps {
        updatesCount
      }
      id
    }
  }
}

fragment AppItem_installedApp on App {
  mfid
  localID
  name
  manifest {
    author {
      id
      name
    }
  }
  update {
    manifest {
      version
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
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
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "LauncherAppUpdateChangedSubscription",
  "id": null,
  "text": "subscription LauncherAppUpdateChangedSubscription {\n  appUpdateChanged {\n    app {\n      ...AppItem_installedApp\n      id\n    }\n    viewer {\n      apps {\n        updatesCount\n      }\n      id\n    }\n  }\n}\n\nfragment AppItem_installedApp on App {\n  mfid\n  localID\n  name\n  manifest {\n    author {\n      id\n      name\n    }\n  }\n  update {\n    manifest {\n      version\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "LauncherAppUpdateChangedSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "appUpdateChanged",
        "storageKey": null,
        "args": null,
        "concreteType": "AppUpdatePayload",
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
                "kind": "FragmentSpread",
                "name": "AppItem_installedApp",
                "args": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "Viewer",
            "plural": false,
            "selections": [
              v0
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "LauncherAppUpdateChangedSubscription",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "appUpdateChanged",
        "storageKey": null,
        "args": null,
        "concreteType": "AppUpdatePayload",
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
                "kind": "ScalarField",
                "alias": null,
                "name": "mfid",
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
              v1,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "manifest",
                "storageKey": null,
                "args": null,
                "concreteType": "AppManifestData",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "author",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AppAuthor",
                    "plural": false,
                    "selections": [
                      v2,
                      v1
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "update",
                "storageKey": null,
                "args": null,
                "concreteType": "AppUpdateData",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "manifest",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AppManifestData",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "version",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  }
                ]
              },
              v2
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "Viewer",
            "plural": false,
            "selections": [
              v0,
              v2
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'a48605cadb9946820a27d50306ee0277';
module.exports = node;
