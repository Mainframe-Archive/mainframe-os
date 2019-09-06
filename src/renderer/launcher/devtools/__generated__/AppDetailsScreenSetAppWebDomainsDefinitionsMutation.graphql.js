/**
 * @flow
 * @relayHash e34fc30ddffd95313775bf307adcddbb
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AppDetailsScreen_app$ref = any;
export type SetAppWebDomainsDefinitionsInput = {|
  appID: string,
  webDomains: $ReadOnlyArray<WebDomainDefinitionInput>,
  clientMutationId?: ?string,
|};
export type WebDomainDefinitionInput = {|
  domain: string,
  internal?: ?boolean,
  external?: ?boolean,
|};
export type AppDetailsScreenSetAppWebDomainsDefinitionsMutationVariables = {|
  input: SetAppWebDomainsDefinitionsInput
|};
export type AppDetailsScreenSetAppWebDomainsDefinitionsMutationResponse = {|
  +setAppWebDomainsDefinitions: ?{|
    +app: {|
      +$fragmentRefs: AppDetailsScreen_app$ref
    |}
  |}
|};
export type AppDetailsScreenSetAppWebDomainsDefinitionsMutation = {|
  variables: AppDetailsScreenSetAppWebDomainsDefinitionsMutationVariables,
  response: AppDetailsScreenSetAppWebDomainsDefinitionsMutationResponse,
|};
*/


/*
mutation AppDetailsScreenSetAppWebDomainsDefinitionsMutation(
  $input: SetAppWebDomainsDefinitionsInput!
) {
  setAppWebDomainsDefinitions(input: $input) {
    app {
      ...AppDetailsScreen_app
      id
    }
  }
}

fragment AppDetailsScreen_app on OwnApp {
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
    webDomains {
      domain
      internal
      external
    }
  }
  latestPublishedVersion {
    version
  }
  viewerOwnAppID
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "SetAppWebDomainsDefinitionsInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
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
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "AppDetailsScreenSetAppWebDomainsDefinitionsMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "setAppWebDomainsDefinitions",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "SetAppWebDomainsDefinitionsPayload",
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
                "name": "AppDetailsScreen_app",
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
    "name": "AppDetailsScreenSetAppWebDomainsDefinitionsMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "setAppWebDomainsDefinitions",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "SetAppWebDomainsDefinitionsPayload",
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
              (v2/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "publicID",
                "args": null,
                "storageKey": null
              },
              (v3/*: any*/),
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
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/)
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
                  (v5/*: any*/),
                  {
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
                  (v5/*: any*/)
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "viewerOwnAppID",
                "args": null,
                "storageKey": null
              },
              (v4/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "AppDetailsScreenSetAppWebDomainsDefinitionsMutation",
    "id": null,
    "text": "mutation AppDetailsScreenSetAppWebDomainsDefinitionsMutation(\n  $input: SetAppWebDomainsDefinitionsInput!\n) {\n  setAppWebDomainsDefinitions(input: $input) {\n    app {\n      ...AppDetailsScreen_app\n      id\n    }\n  }\n}\n\nfragment AppDetailsScreen_app on OwnApp {\n  localID\n  publicID\n  profile {\n    name\n  }\n  contentsPath\n  developer {\n    localID\n    profile {\n      name\n    }\n    id\n  }\n  inProgressVersion {\n    version\n    webDomains {\n      domain\n      internal\n      external\n    }\n  }\n  latestPublishedVersion {\n    version\n  }\n  viewerOwnAppID\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '8c41182794365f786faa91abcfbf72b8';
module.exports = node;
