/**
 * @flow
 * @relayHash 377156fbea841b447a011808c4502d32
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type SystemUpdateItem_systemUpdate$ref = any;
export type SystemUpdateItemUpdateChangedSubscriptionVariables = {||};
export type SystemUpdateItemUpdateChangedSubscriptionResponse = {|
  +systemUpdateChanged: {|
    +systemUpdate: {|
      +$fragmentRefs: SystemUpdateItem_systemUpdate$ref
    |}
  |}
|};
export type SystemUpdateItemUpdateChangedSubscription = {|
  variables: SystemUpdateItemUpdateChangedSubscriptionVariables,
  response: SystemUpdateItemUpdateChangedSubscriptionResponse,
|};
*/


/*
subscription SystemUpdateItemUpdateChangedSubscription {
  systemUpdateChanged {
    systemUpdate {
      ...SystemUpdateItem_systemUpdate
      id
    }
  }
}

fragment SystemUpdateItem_systemUpdate on SystemUpdate {
  status
  currentVersion
  newVersion
}
*/

const node/*: ConcreteRequest*/ = {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "SystemUpdateItemUpdateChangedSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "systemUpdateChanged",
        "storageKey": null,
        "args": null,
        "concreteType": "SystemUpdateChangedPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "systemUpdate",
            "storageKey": null,
            "args": null,
            "concreteType": "SystemUpdate",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "SystemUpdateItem_systemUpdate",
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
    "name": "SystemUpdateItemUpdateChangedSubscription",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "systemUpdateChanged",
        "storageKey": null,
        "args": null,
        "concreteType": "SystemUpdateChangedPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "systemUpdate",
            "storageKey": null,
            "args": null,
            "concreteType": "SystemUpdate",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "status",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "currentVersion",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "newVersion",
                "args": null,
                "storageKey": null
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
    ]
  },
  "params": {
    "operationKind": "subscription",
    "name": "SystemUpdateItemUpdateChangedSubscription",
    "id": null,
    "text": "subscription SystemUpdateItemUpdateChangedSubscription {\n  systemUpdateChanged {\n    systemUpdate {\n      ...SystemUpdateItem_systemUpdate\n      id\n    }\n  }\n}\n\nfragment SystemUpdateItem_systemUpdate on SystemUpdate {\n  status\n  currentVersion\n  newVersion\n}\n",
    "metadata": {}
  }
};
// prettier-ignore
(node/*: any*/).hash = '8bbd53e2fb8924bd27d93a7fe75b14eb';
module.exports = node;
