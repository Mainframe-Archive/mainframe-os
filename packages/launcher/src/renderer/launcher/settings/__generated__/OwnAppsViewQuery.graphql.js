/**
 * @flow
 * @relayHash 1485a4645d8184108afb12e23e3c3920
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type OwnAppsView_apps$ref = any;
type OwnAppsView_identities$ref = any;
export type OwnAppsViewQueryVariables = {||};
export type OwnAppsViewQueryResponse = {|
  +viewer: {|
    +identities: {|
      +$fragmentRefs: OwnAppsView_identities$ref
    |},
    +apps: {|
      +$fragmentRefs: OwnAppsView_apps$ref
    |},
  |}
|};
export type OwnAppsViewQuery = {|
  variables: OwnAppsViewQueryVariables,
  response: OwnAppsViewQueryResponse,
|};
*/


/*
query OwnAppsViewQuery {
  viewer {
    identities {
      ...OwnAppsView_identities
    }
    apps {
      ...OwnAppsView_apps
    }
    id
  }
}

fragment OwnAppsView_identities on Identities {
  ownDevelopers {
    localID
    id
  }
}

fragment OwnAppsView_apps on Apps {
  own {
    localID
    name
    ...AppItem_ownApp
    ...OwnAppDetailView_ownApp
    id
  }
}

fragment AppItem_ownApp on OwnApp {
  mfid
  localID
  name
  developer {
    id
    name
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
  publishedVersion
  currentVersionData {
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
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = [
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
  "operationKind": "query",
  "name": "OwnAppsViewQuery",
  "id": null,
  "text": "query OwnAppsViewQuery {\n  viewer {\n    identities {\n      ...OwnAppsView_identities\n    }\n    apps {\n      ...OwnAppsView_apps\n    }\n    id\n  }\n}\n\nfragment OwnAppsView_identities on Identities {\n  ownDevelopers {\n    localID\n    id\n  }\n}\n\nfragment OwnAppsView_apps on Apps {\n  own {\n    localID\n    name\n    ...AppItem_ownApp\n    ...OwnAppDetailView_ownApp\n    id\n  }\n}\n\nfragment AppItem_ownApp on OwnApp {\n  mfid\n  localID\n  name\n  developer {\n    id\n    name\n  }\n}\n\nfragment OwnAppDetailView_ownApp on OwnApp {\n  localID\n  mfid\n  name\n  contentsPath\n  updateFeedHash\n  developer {\n    id\n    name\n  }\n  publishedVersion\n  currentVersionData {\n    version\n    versionHash\n    permissions {\n      optional {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n        COMMS_CONTACT\n        CONTACTS_READ\n      }\n      required {\n        WEB_REQUEST\n        BLOCKCHAIN_SEND\n        COMMS_CONTACT\n        CONTACTS_READ\n      }\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "OwnAppsViewQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
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
            "name": "identities",
            "storageKey": null,
            "args": null,
            "concreteType": "Identities",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "OwnAppsView_identities",
                "args": null
              }
            ]
          },
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
                "name": "OwnAppsView_apps",
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
    "name": "OwnAppsViewQuery",
    "argumentDefinitions": [],
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
            "name": "identities",
            "storageKey": null,
            "args": null,
            "concreteType": "Identities",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "ownDevelopers",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnDeveloperIdentity",
                "plural": true,
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
            "name": "apps",
            "storageKey": null,
            "args": null,
            "concreteType": "Apps",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "own",
                "storageKey": null,
                "args": null,
                "concreteType": "OwnApp",
                "plural": true,
                "selections": [
                  v0,
                  v2,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "mfid",
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
                      v1,
                      v2
                    ]
                  },
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
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "publishedVersion",
                    "args": null,
                    "storageKey": null
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
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "version",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "versionHash",
                        "args": null,
                        "storageKey": null
                      },
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
                            "selections": v3
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "required",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "AppPermissionDefinitions",
                            "plural": false,
                            "selections": v3
                          }
                        ]
                      }
                    ]
                  },
                  v1
                ]
              }
            ]
          },
          v1
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '5cf69b652d8cf062dc6a0a9b02d26474';
module.exports = node;
