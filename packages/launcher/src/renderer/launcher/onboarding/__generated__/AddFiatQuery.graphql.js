/**
 * @flow
 * @relayHash f0d5b3b94b5489b00cdb14c56409bc57
 */

/* eslint-disable */

'use strict'

/*::
import type { ConcreteRequest } from 'relay-runtime';
type AddFiat_user$ref = any;
export type AddFiatQueryVariables = {||};
export type AddFiatQueryResponse = {|
  +user: {|
    +$fragmentRefs: AddFiat_user$ref
  |}
|};
export type AddFiatQuery = {|
  variables: AddFiatQueryVariables,
  response: AddFiatQueryResponse,
|};
*/

/*
query AddFiatQuery {
  user: viewer {
    ...AddFiat_user
    id
  }
}

fragment AddFiat_user on User {
  profile {
    ethAddress
  }
}
*/

const node /*: ConcreteRequest*/ = {
  kind: 'Request',
  operationKind: 'query',
  name: 'AddFiatQuery',
  id: null,
  text:
    'query AddFiatQuery {\n  user: viewer {\n    ...AddFiat_user\n    id\n  }\n}\n\nfragment AddFiat_user on User {\n  profile {\n    ethAddress\n  }\n}\n',
  metadata: {},
  fragment: {
    kind: 'Fragment',
    name: 'AddFiatQuery',
    type: 'Query',
    metadata: null,
    argumentDefinitions: [],
    selections: [
      {
        kind: 'LinkedField',
        alias: 'user',
        name: 'viewer',
        storageKey: null,
        args: null,
        concreteType: 'User',
        plural: false,
        selections: [
          {
            kind: 'FragmentSpread',
            name: 'AddFiat_user',
            args: null,
          },
        ],
      },
    ],
  },
  operation: {
    kind: 'Operation',
    name: 'AddFiatQuery',
    argumentDefinitions: [],
    selections: [
      {
        kind: 'LinkedField',
        alias: 'user',
        name: 'viewer',
        storageKey: null,
        args: null,
        concreteType: 'User',
        plural: false,
        selections: [
          {
            kind: 'LinkedField',
            alias: null,
            name: 'profile',
            storageKey: null,
            args: null,
            concreteType: 'NamedProfile',
            plural: false,
            selections: [
              {
                kind: 'ScalarField',
                alias: null,
                name: 'ethAddress',
                args: null,
                storageKey: null,
              },
            ],
          },
          {
            kind: 'ScalarField',
            alias: null,
            name: 'id',
            args: null,
            storageKey: null,
          },
        ],
      },
    ],
  },
}
// prettier-ignore
;(node/*: any*/).hash = '2e7334af00f37b06ff3e343de8f58b54';
module.exports = node
