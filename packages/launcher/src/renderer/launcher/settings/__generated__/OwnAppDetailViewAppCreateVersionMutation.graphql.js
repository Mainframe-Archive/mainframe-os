/**
 * @flow
 * @relayHash 42f2134f72d716fe33530d4a9df388df
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
  publicID
  profile {
    name
  }
  contentsPath
  developer {
    localID
    profile {
      name
    }
    id
  }
  inProgressVersion {
    version
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
  latestPublishedVersion {
    version
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
  "name": "localID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "profile",
  "storageKey": null,
  "args": null,
  "concreteType": "NamedProfile",
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
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "version",
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
  "text": "mutation OwnAppDetailViewAppCreateVersionMutation(\n  $input: AppCreateVersionMutationInput!\n) {\n  createAppVersion(input: $input) {\n    app {\n      ...OwnAppDetailView_ownApp\n      id\n    }\n  }\n}\n\nfragment OwnAppDetailView_ownApp on OwnApp {\n  localID\n  publicID\n  profile {\n    name\n  }\n  contentsPath\n  developer {\n    localID\n    profile {\n      name\n    }\n    id\n  }\n  inProgressVersion {\n    version\n    permissions {\n      optional {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n        COMMS_CONTACT\n        CONTACTS_READ\n      }\n      required {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n        COMMS_CONTACT\n        CONTACTS_READ\n      }\n    }\n  }\n  latestPublishedVersion {\n    version\n  }\n}\n",
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
              v2,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "publicID",
                "args": null,
                "storageKey": null
              },
              v3,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "contentsPath",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "developer",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnDeveloper",
                "plural": false,
                "selections": [
                  v2,
                  v3,
                  v4
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "inProgressVersion",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnAppVersion",
                "plural": false,
                "selections": [
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
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "latestPublishedVersion",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnAppVersion",
                "plural": false,
                "selections": [
                  v5
                ]
              },
              v4
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
