/**
 * @flow
 * @relayHash 09c9456887c24ee40a2a9534ee4a23fe
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type CreateDeveloperIdentityInput = {
  profile: UserProfileInput,
  clientMutationId?: ?string,
};
export type UserProfileInput = {
  name: string,
  avatar?: ?string,
};
export type IdentitySelectorViewCreateDeveloperIdentityMutationVariables = {|
  input: CreateDeveloperIdentityInput
|};
export type IdentitySelectorViewCreateDeveloperIdentityMutationResponse = {|
  +createDeveloperIdentity: ?{|
    +user: ?{|
      +localID: string,
      +profile: ?{|
        +name: string
      |},
    |},
    +viewer: {|
      +identities: {|
        +ownUsers: ?$ReadOnlyArray<?{|
          +profile: ?{|
            +name: string
          |}
        |}>,
        +ownDevelopers: ?$ReadOnlyArray<?{|
          +profile: ?{|
            +name: string
          |}
        |}>,
      |}
    |},
  |}
|};
export type IdentitySelectorViewCreateDeveloperIdentityMutation = {|
  variables: IdentitySelectorViewCreateDeveloperIdentityMutationVariables,
  response: IdentitySelectorViewCreateDeveloperIdentityMutationResponse,
|};
*/


/*
mutation IdentitySelectorViewCreateDeveloperIdentityMutation(
  $input: CreateDeveloperIdentityInput!
) {
  createDeveloperIdentity(input: $input) {
    user {
      localID
      profile {
        name
      }
      id
    }
    viewer {
      identities {
        ownUsers {
          profile {
            name
          }
          id
        }
        ownDevelopers {
          profile {
            name
          }
          id
        }
      }
      id
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "CreateDeveloperIdentityInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "CreateDeveloperIdentityInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "localID",
  "args": null,
  "storageKey": null
},
v3 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  }
],
v4 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "profile",
  "storageKey": null,
  "args": null,
  "concreteType": "OwnDeveloperProfile",
  "plural": false,
  "selections": v3
},
v5 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "profile",
  "storageKey": null,
  "args": null,
  "concreteType": "OwnUserProfile",
  "plural": false,
  "selections": v3
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "IdentitySelectorViewCreateDeveloperIdentityMutation",
  "id": null,
  "text": "mutation IdentitySelectorViewCreateDeveloperIdentityMutation(\n  $input: CreateDeveloperIdentityInput!\n) {\n  createDeveloperIdentity(input: $input) {\n    user {\n      localID\n      profile {\n        name\n      }\n      id\n    }\n    viewer {\n      identities {\n        ownUsers {\n          profile {\n            name\n          }\n          id\n        }\n        ownDevelopers {\n          profile {\n            name\n          }\n          id\n        }\n      }\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "IdentitySelectorViewCreateDeveloperIdentityMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createDeveloperIdentity",
        "storageKey": null,
        "args": v1,
        "concreteType": "CreateDeveloperIdentityPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "user",
            "storageKey": null,
            "args": null,
            "concreteType": "OwnDeveloperIdentity",
            "plural": false,
            "selections": [
              v2,
              v4
            ]
          },
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
                "concreteType": "IdentitiesQuery",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "ownUsers",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "OwnUserIdentity",
                    "plural": true,
                    "selections": [
                      v5
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "ownDevelopers",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "OwnDeveloperIdentity",
                    "plural": true,
                    "selections": [
                      v4
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "IdentitySelectorViewCreateDeveloperIdentityMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createDeveloperIdentity",
        "storageKey": null,
        "args": v1,
        "concreteType": "CreateDeveloperIdentityPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "user",
            "storageKey": null,
            "args": null,
            "concreteType": "OwnDeveloperIdentity",
            "plural": false,
            "selections": [
              v2,
              v4,
              v6
            ]
          },
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
                "concreteType": "IdentitiesQuery",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "ownUsers",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "OwnUserIdentity",
                    "plural": true,
                    "selections": [
                      v5,
                      v6
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "ownDevelopers",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "OwnDeveloperIdentity",
                    "plural": true,
                    "selections": [
                      v4,
                      v6
                    ]
                  }
                ]
              },
              v6
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '28a64937d638185ac4449244aa655579';
module.exports = node;
