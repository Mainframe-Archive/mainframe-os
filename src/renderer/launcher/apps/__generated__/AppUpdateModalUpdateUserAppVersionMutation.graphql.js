/**
 * @flow
 * @relayHash 91af2f432d62fc374faadb89fda4f83d
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AppUpdateModal_userAppVersion$ref = any;
export type UpdateUserAppVersionMutationInput = {
  userAppVersionID: string,
  webDomains: $ReadOnlyArray<WebDomainDefinitionInput>,
  clientMutationId?: ?string,
};
export type WebDomainDefinitionInput = {
  domain: string,
  internal?: ?boolean,
  external?: ?boolean,
};
export type AppUpdateModalUpdateUserAppVersionMutationVariables = {|
  input: UpdateUserAppVersionMutationInput
|};
export type AppUpdateModalUpdateUserAppVersionMutationResponse = {|
  +updateUserAppVersion: ?{|
    +userAppVersion: {|
      +$fragmentRefs: AppUpdateModal_userAppVersion$ref
    |}
  |}
|};
export type AppUpdateModalUpdateUserAppVersionMutation = {|
  variables: AppUpdateModalUpdateUserAppVersionMutationVariables,
  response: AppUpdateModalUpdateUserAppVersionMutationResponse,
|};
*/


/*
mutation AppUpdateModalUpdateUserAppVersionMutation(
  $input: UpdateUserAppVersionMutationInput!
) {
  updateUserAppVersion(input: $input) {
    userAppVersion {
      ...AppUpdateModal_userAppVersion
      id
    }
  }
}

fragment AppUpdateModal_userAppVersion on UserAppVersion {
  localID
  settings {
    webDomains {
      domain
      internal
      external
    }
    id
  }
  update {
    fromVersion {
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
    toVersion {
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
    permissionsChanged
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "UpdateUserAppVersionMutationInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "UpdateUserAppVersionMutationInput!"
  }
],
v2 = {
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
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
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
    v2
  ]
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "AppUpdateModalUpdateUserAppVersionMutation",
  "id": null,
  "text": "mutation AppUpdateModalUpdateUserAppVersionMutation(\n  $input: UpdateUserAppVersionMutationInput!\n) {\n  updateUserAppVersion(input: $input) {\n    userAppVersion {\n      ...AppUpdateModal_userAppVersion\n      id\n    }\n  }\n}\n\nfragment AppUpdateModal_userAppVersion on UserAppVersion {\n  localID\n  settings {\n    webDomains {\n      domain\n      internal\n      external\n    }\n    id\n  }\n  update {\n    fromVersion {\n      manifest {\n        profile {\n          name\n        }\n        version\n        webDomains {\n          domain\n          internal\n          external\n        }\n      }\n      id\n    }\n    toVersion {\n      publicID\n      manifest {\n        profile {\n          name\n        }\n        version\n        webDomains {\n          domain\n          internal\n          external\n        }\n      }\n      id\n    }\n    permissionsChanged\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "AppUpdateModalUpdateUserAppVersionMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateUserAppVersion",
        "storageKey": null,
        "args": v1,
        "concreteType": "UpdateUserAppVersionMutationPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "userAppVersion",
            "storageKey": null,
            "args": null,
            "concreteType": "UserAppVersion",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "AppUpdateModal_userAppVersion",
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
    "name": "AppUpdateModalUpdateUserAppVersionMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateUserAppVersion",
        "storageKey": null,
        "args": v1,
        "concreteType": "UpdateUserAppVersionMutationPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "userAppVersion",
            "storageKey": null,
            "args": null,
            "concreteType": "UserAppVersion",
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
                "kind": "LinkedField",
                "alias": null,
                "name": "settings",
                "storageKey": null,
                "args": null,
                "concreteType": "UserAppSettings",
                "plural": false,
                "selections": [
                  v2,
                  v3
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "update",
                "storageKey": null,
                "args": null,
                "concreteType": "AppUpdate",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "fromVersion",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AppVersion",
                    "plural": false,
                    "selections": [
                      v4,
                      v3
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "toVersion",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AppVersion",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "publicID",
                        "args": null,
                        "storageKey": null
                      },
                      v4,
                      v3
                    ]
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "permissionsChanged",
                    "args": null,
                    "storageKey": null
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
(node/*: any*/).hash = 'ec8ce68ec681f844d4387f7b1d84ed1c';
module.exports = node;
