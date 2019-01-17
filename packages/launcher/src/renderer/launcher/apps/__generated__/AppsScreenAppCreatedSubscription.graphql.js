/**
 * @flow
 * @relayHash 1fb6d4163f05d284737aed669b712ee9
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AppsScreenAppCreatedSubscriptionVariables = {||};
export type AppsScreenAppCreatedSubscriptionResponse = {|
  +appCreated: {|
    +name: string
  |}
|};
export type AppsScreenAppCreatedSubscription = {|
  variables: AppsScreenAppCreatedSubscriptionVariables,
  response: AppsScreenAppCreatedSubscriptionResponse,
|};
*/


/*
subscription AppsScreenAppCreatedSubscription {
  appCreated {
    name
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "AppsScreenAppCreatedSubscription",
  "id": null,
  "text": "subscription AppsScreenAppCreatedSubscription {\n  appCreated {\n    name\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "AppsScreenAppCreatedSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "appCreated",
        "storageKey": null,
        "args": null,
        "concreteType": "OwnApp",
        "plural": false,
        "selections": [
          v0
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "AppsScreenAppCreatedSubscription",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "appCreated",
        "storageKey": null,
        "args": null,
        "concreteType": "OwnApp",
        "plural": false,
        "selections": [
          v0,
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
})();
// prettier-ignore
(node/*: any*/).hash = '39a31114a87ea79b3bde167446f31fc0';
module.exports = node;
