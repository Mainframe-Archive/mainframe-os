/**
 * @flow
 * @relayHash aa650a6fe16f197746a1bfd66745434c
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AppItem_installedApp$ref = any;
type SideMenu_apps$ref = any;
export type LauncherAppUpdateChangedSubscriptionVariables = {||};
export type LauncherAppUpdateChangedSubscriptionResponse = {|
  +appUpdateChanged: {|
    +viewer: {|
      +apps: {|
        +$fragmentRefs: SideMenu_apps$ref
      |}
    |},
    +app: {|
      +$fragmentRefs: AppItem_installedApp$ref
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
    viewer {
      apps {
        ...SideMenu_apps
      }
      id
    }
    app {
      ...AppItem_installedApp
      id
    }
  }
}

fragment SideMenu_apps on Apps {
  updatesCount
}

fragment AppItem_installedApp on App {
  mfid
  localID
  name
  installationState
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
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "LauncherAppUpdateChangedSubscription",
  "id": null,
  "text": "subscription LauncherAppUpdateChangedSubscription {\n  appUpdateChanged {\n    viewer {\n      apps {\n        ...SideMenu_apps\n      }\n      id\n    }\n    app {\n      ...AppItem_installedApp\n      id\n    }\n  }\n}\n\nfragment SideMenu_apps on Apps {\n  updatesCount\n}\n\nfragment AppItem_installedApp on App {\n  mfid\n  localID\n  name\n  installationState\n  manifest {\n    author {\n      id\n      name\n    }\n  }\n  update {\n    manifest {\n      version\n    }\n  }\n}\n",
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
              }
            ]
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
                "kind": "FragmentSpread",
                "name": "AppItem_installedApp",
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
              v0
            ]
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
                "kind": "ScalarField",
                "alias": null,
                "name": "installationState",
                "args": null,
                "storageKey": null
              },
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
                      v0,
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
              v0
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '6c3591fe5c5858d691e9788825128fe6';
module.exports = node;
