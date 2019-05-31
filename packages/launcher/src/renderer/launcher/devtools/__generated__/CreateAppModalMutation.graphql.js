/**
 * @flow
 * @relayHash a8111ffc3e940c5f611b40b9cf87b3a4
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type OwnAppsScreen_devtools$ref = any;
export type AppCreateMutationInput = {
  name: string,
  contentsPath: string,
  version: string,
  developerID: string,
  permissionsRequirements: AppPermissionsRequirementsInput,
  clientMutationId?: ?string,
};
export type AppPermissionsRequirementsInput = {
  optional: AppPermissionDefinitionsInput,
  required: AppPermissionDefinitionsInput,
};
export type AppPermissionDefinitionsInput = {
  BLOCKCHAIN_SEND?: ?boolean,
  COMMS_CONTACT?: ?boolean,
  CONTACTS_READ?: ?boolean,
  WEB_REQUEST?: ?$ReadOnlyArray<?string>,
};
export type CreateAppModalMutationVariables = {|
  input: AppCreateMutationInput
|};
export type CreateAppModalMutationResponse = {|
  +createApp: ?{|
    +app: {|
      +id: string,
      +localID: string,
      +profile: {|
        +name: string
      |},
    |},
    +devtools: {|
      +$fragmentRefs: OwnAppsScreen_devtools$ref
    |},
  |}
|};
export type CreateAppModalMutation = {|
  variables: CreateAppModalMutationVariables,
  response: CreateAppModalMutationResponse,
|};
*/


/*
mutation CreateAppModalMutation(
  $input: AppCreateMutationInput!
) {
  createApp(input: $input) {
    app {
      id
      localID
      profile {
        name
      }
    }
    devtools {
      ...OwnAppsScreen_devtools
    }
  }
}

fragment OwnAppsScreen_devtools on Devtools {
  apps {
    ...AppItem_ownApp
    localID
    id
  }
}

fragment AppItem_ownApp on OwnApp {
  localID
  publicID
  developer {
    localID
    profile {
      name
    }
    id
  }
  profile {
    name
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "AppCreateMutationInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "AppCreateMutationInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v4 = {
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
v5 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "app",
  "storageKey": null,
  "args": null,
  "concreteType": "OwnApp",
  "plural": false,
  "selections": [
    v2,
    v3,
    v4
  ]
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "CreateAppModalMutation",
  "id": null,
  "text": "mutation CreateAppModalMutation(\n  $input: AppCreateMutationInput!\n) {\n  createApp(input: $input) {\n    app {\n      id\n      localID\n      profile {\n        name\n      }\n    }\n    devtools {\n      ...OwnAppsScreen_devtools\n    }\n  }\n}\n\nfragment OwnAppsScreen_devtools on Devtools {\n  apps {\n    ...AppItem_ownApp\n    localID\n    id\n  }\n}\n\nfragment AppItem_ownApp on OwnApp {\n  localID\n  publicID\n  developer {\n    localID\n    profile {\n      name\n    }\n    id\n  }\n  profile {\n    name\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "CreateAppModalMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createApp",
        "storageKey": null,
        "args": v1,
        "concreteType": "AppCreateMutationPayload",
        "plural": false,
        "selections": [
          v5,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "devtools",
            "storageKey": null,
            "args": null,
            "concreteType": "Devtools",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "OwnAppsScreen_devtools",
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
    "name": "CreateAppModalMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createApp",
        "storageKey": null,
        "args": v1,
        "concreteType": "AppCreateMutationPayload",
        "plural": false,
        "selections": [
          v5,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "devtools",
            "storageKey": null,
            "args": null,
            "concreteType": "Devtools",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "apps",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnApp",
                "plural": true,
                "selections": [
                  v3,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "publicID",
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
                      v3,
                      v4,
                      v2
                    ]
                  },
                  v4,
                  v2
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
(node/*: any*/).hash = '3b589606ba339c0e8dc82cf337fd9ede';
module.exports = node;
