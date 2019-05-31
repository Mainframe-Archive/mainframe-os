/**
 * @flow
 * @relayHash 0b6c882ed73cf78cffe84345b89d3e48
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type LauncherAppUpdateChangedSubscriptionVariables = {||};
export type LauncherAppUpdateChangedSubscriptionResponse = {|
  +appUpdateChanged: {|
    +viewer: {|
      +id: string
    |}
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
      id
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
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
        "concreteType": "User",
        "plural": false,
        "selections": [
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
];
return {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "LauncherAppUpdateChangedSubscription",
  "id": null,
  "text": "subscription LauncherAppUpdateChangedSubscription {\n  appUpdateChanged {\n    viewer {\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "LauncherAppUpdateChangedSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": v0
  },
  "operation": {
    "kind": "Operation",
    "name": "LauncherAppUpdateChangedSubscription",
    "argumentDefinitions": [],
    "selections": v0
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '2d4b9dde90a9771106dd3d72fa43315f';
module.exports = node;
