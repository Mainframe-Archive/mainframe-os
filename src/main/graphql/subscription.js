// @flow

import { GraphQLInt, GraphQLObjectType, GraphQLNonNull } from 'graphql'
import { merge, of } from 'rxjs'
import {
  distinctUntilChanged,
  filter,
  flatMap,
  map,
  scan,
} from 'rxjs/operators'

import type { GraphQLContext } from '../context/graphql'

import { appVersion, contact, viewerField } from './objects'
import observableToAsyncIterator from './observableToAsyncIterator'

const appUpdatesPayload = new GraphQLObjectType({
  name: 'AppUpdatesPayload',
  fields: () => ({
    appUpdatesCount: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    viewer: viewerField,
  }),
})

const appUpdatesChanged = {
  type: new GraphQLNonNull(appUpdatesPayload),
  subscribe: async (self, args, ctx: GraphQLContext) => {
    // Get all the app versions for the context user
    const userAppVersions = await ctx.db.user_app_versions
      .find({ user: ctx.userID })
      .exec()
    const versionsData = await Promise.all(
      userAppVersions.map(async uav => {
        return { [uav.localID]: await uav.getNewAvailableVersion() }
      }),
    )
    const currentVersions = of(Object.assign({}, ...versionsData))

    const newVersions = ctx.db.app_versions.insert$.pipe(
      // Load the created doc
      flatMap(event => ctx.getDoc('app_versions', event.data.doc)),
      // Ensure doc is loaded
      filter(appVersion => appVersion != null),
      // Load matching user app version
      flatMap(async appVersion => {
        const uav = await ctx.db.user_app_versions
          .findOne({ user: ctx.userID, app: appVersion.app })
          .exec()
        return uav == null
          ? {}
          : { [uav.localID]: await uav.getNewAvailableVersion() }
      }),
    )

    const observable = merge(currentVersions, newVersions).pipe(
      // Merge results for all app versions
      scan((acc, value) => ({ ...acc, ...value }), {}),
      // Reduce to count for available updates
      map(updates => Object.values(updates).filter(Boolean).length),
      distinctUntilChanged(),
      map(appUpdatesCount => ({
        appUpdatesChanged: { appUpdatesCount, viewer: {} },
      })),
    )
    return observableToAsyncIterator(observable)
  },
}

const appVersionPayload = new GraphQLObjectType({
  name: 'AppVersionPayload',
  fields: () => ({
    appVersion: {
      type: new GraphQLNonNull(appVersion),
    },
    viewer: viewerField,
  }),
})

const appVersionChanged = {
  type: new GraphQLNonNull(appVersionPayload),
  subscribe: (self, args, ctx: GraphQLContext) => {
    const observable = ctx.db.app_versions.update$.pipe(
      // Load the updated doc
      flatMap(event => ctx.getDoc('app_versions', event.data.doc)),
      // Ensure doc is loaded
      filter(appVersion => appVersion != null),
      map(appVersion => ({ appVersionChanged: { appVersion, viewer: {} } })),
    )
    return observableToAsyncIterator(observable)
  },
}

const contactChangedPayload = new GraphQLObjectType({
  name: 'ContactChangedPayload',
  fields: () => ({
    contact: {
      type: new GraphQLNonNull(contact),
    },
    viewer: viewerField,
  }),
})

const contactChanged = {
  type: new GraphQLNonNull(contactChangedPayload),
  subscribe: async (self, args, ctx: GraphQLContext) => {
    const user = await ctx.getUser()
    const observable = ctx.db.contacts.update$.pipe(
      filter(event => user.contacts.includes(event.data.doc)),
      flatMap(event => ctx.getDoc('contacts', event.data.doc)),
      filter(contact => contact != null),
      map(contact => ({ contactChanged: { contact, viewer: {} } })),
    )
    return observableToAsyncIterator(observable)
  },
}

const contactsChanged = {
  type: new GraphQLNonNull(contactChangedPayload),
  subscribe: async (self, args, ctx: GraphQLContext) => {
    const user = await ctx.getUser()
    const observable = user.get$('contacts').pipe(
      map(() => ({
        contactsChanged: {
          viewer: {},
        },
      })),
    )
    return observableToAsyncIterator(observable)
  },
}

export default new GraphQLObjectType({
  name: 'Subscription',
  fields: () => ({
    appUpdatesChanged,
    appVersionChanged,
    contactChanged,
    contactsChanged,
  }),
})
