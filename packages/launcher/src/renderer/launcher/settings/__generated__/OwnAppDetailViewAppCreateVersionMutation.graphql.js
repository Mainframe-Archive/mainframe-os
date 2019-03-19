/**
 * @flow
 * @relayHash 0da6f70a1a4a2301f923cfa117c3b59d
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type OwnAppDetailView_ownApp$ref = any;
export type AppCreateVersionMutationInput = {
  appID: string,
  version: string,
  clientMutationId?: ?string,
};
export type OwnAppDetailViewAppCreateVersionMutationVariables = {|
  input: AppCreateVersionMutationInput
|};
export type OwnAppDetailViewAppCreateVersionMutationResponse = {|
  +createAppVersion: ?{|
    +app: {|
      +$fragmentRefs: OwnAppDetailView_ownApp$ref
    |}
  |}
|};
export type OwnAppDetailViewAppCreateVersionMutation = {|
  variables: OwnAppDetailViewAppCreateVersionMutationVariables,
  response: OwnAppDetailViewAppCreateVersionMutationResponse,
|};
*/


/*
mutation OwnAppDetailViewAppCreateVersionMutation(
  $input: AppCreateVersionMutationInput!
) {
  createAppVersion(input: $input) {
    app {
      ...OwnAppDetailView_ownApp
      id
    }
  }
}

fragment OwnAppDetailView_ownApp on OwnApp {
  localID
  mfid
  name
  contentsPath
  updateFeedHash
  developer {
    id
    name
  }
  currentVersionData {
    version
    versionHash
  }
  versions {
    version
    versionHash
    permissions {
      optional {
        WEB_REQUEST
        BLOCKCHAIN_SEND
        COMMS_CONTACT
        CONTACTS_READ
      }
      required {
        WEB_REQUEST
        BLOCKCHAIN_SEND
        COMMS_CONTACT
        CONTACTS_READ
      }
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "AppCreateVersionMutationInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "AppCreateVersionMutationInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "version",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "versionHash",
  "args": null,
  "storageKey": null
},
v6 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "WEB_REQUEST",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "BLOCKCHAIN_SEND",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "COMMS_CONTACT",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "CONTACTS_READ",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "OwnAppDetailViewAppCreateVersionMutation",
  "id": null,
  "text": "mutation OwnAppDetailViewAppCreateVersionMutation(\n  $input: AppCreateVersionMutationInput!\n) {\n  createAppVersion(input: $input) {\n    app {\n      ...OwnAppDetailView_ownApp\n      id\n    }\n  }\n}\n\nfragment OwnAppDetailView_ownApp on OwnApp {\n  localID\n  mfid\n  name\n  contentsPath\n  updateFeedHash\n  developer {\n    id\n    name\n  }\n  currentVersionData {\n    version\n    versionHash\n  }\n  versions {\n    version\n    versionHash\n    permissions {\n      optional {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n        COMMS_CONTACT\n        CONTACTS_READ\n      }\n      required {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n        COMMS_CONTACT\n        CONTACTS_READ\n      }\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "OwnAppDetailViewAppCreateVersionMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createAppVersion",
        "storageKey": null,
        "args": v1,
        "concreteType": "AppCreateVersionMutationPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "app",
            "storageKey": null,
            "args": null,
            "concreteType": "OwnApp",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "OwnAppDetailView_ownApp",
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
    "name": "OwnAppDetailViewAppCreateVersionMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createAppVersion",
        "storageKey": null,
        "args": v1,
        "concreteType": "AppCreateVersionMutationPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "app",
            "storageKey": null,
            "args": null,
            "concreteType": "OwnApp",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "localID",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "mfid",
                "args": null,
                "storageKey": null
              },
              v2,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "contentsPath",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "updateFeedHash",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "developer",
                "storageKey": null,
                "args": null,
                "concreteType": "AppAuthor",
                "plural": false,
                "selections": [
                  v3,
                  v2
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "currentVersionData",
                "storageKey": null,
                "args": null,
                "concreteType": "AppVersionData",
                "plural": false,
                "selections": [
                  v4,
                  v5
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "versions",
                "storageKey": null,
                "args": null,
                "concreteType": "AppVersionData",
                "plural": true,
                "selections": [
                  v4,
                  v5,
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
                        "selections": v6
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "required",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "AppPermissionDefinitions",
                        "plural": false,
                        "selections": v6
                      }
                    ]
                  }
                ]
              },
              v3
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'c2442f7674aec399d62740df720f4a89';
module.exports = node;
