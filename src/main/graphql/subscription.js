// @flow

import { GraphQLInt, GraphQLObjectType, GraphQLNonNull } from 'graphql'
import { merge } from 'rxjs'
import {
  distinctUntilChanged,
  filter,
  flatMap,
  map,
  scan,
} from 'rxjs/operators'

import type { UpdaterState } from '../updater'
import type { GraphQLContext } from '../context/graphql'

import { appVersion, contact, systemUpdate, viewerField } from './objects'
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

// To know if there are available app updates for the given context user, we need
// to keep track of the `user_app_versions` collection for the given user, and
// inserts to the `app_versions` collection (managed by the apps collection sync)
// to keep track of newly available updates, and updates applied by the user
const appUpdatesChanged = {
  type: new GraphQLNonNull(appUpdatesPayload),
  subscribe: (self, args, ctx: GraphQLContext) => {
    // Get all the app versions for the context user
    const installedVersions = ctx.db.user_app_versions
      .find({ user: ctx.userID })
      .$.pipe(
        flatMap(async userAppVersions => {
          const versionsData = await Promise.all(
            userAppVersions.map(async uav => {
              return { [uav.localID]: await uav.getNewAvailableVersion() }
            }),
          )
          return Object.assign({}, ...versionsData)
        }),
      )

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

    const observable = merge(installedVersions, newVersions).pipe(
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

const contactsChangedPayload = new GraphQLObjectType({
  name: 'contactsChangedPayload',
  fields: () => ({
    viewer: viewerField,
  }),
})

const contactsChanged = {
  type: new GraphQLNonNull(contactsChangedPayload),
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

const contactRequestsChangedPayload = new GraphQLObjectType({
  name: 'ContactRequestsChangedPayload',
  fields: () => ({
    viewer: viewerField,
  }),
})

const contactRequestsChanged = {
  type: new GraphQLNonNull(contactRequestsChangedPayload),
  subscribe: async (self, args, ctx: GraphQLContext) => {
    const user = await ctx.getUser()
    const observable = user.get$('contactRequests').pipe(
      map(() => ({
        contactRequestsChanged: {
          viewer: {},
        },
      })),
    )
    return observableToAsyncIterator(observable)
  },
}

const systemUpdateChangedPayload = new GraphQLObjectType({
  name: 'SystemUpdateChangedPayload',
  fields: () => ({
    systemUpdate: {
      type: new GraphQLNonNull(systemUpdate),
    },
  }),
})

const systemUpdateChanged = {
  type: new GraphQLNonNull(systemUpdateChangedPayload),
  subscribe: (self, args, ctx: GraphQLContext) => {
    const observable = ctx.system.updater.pipe(
      // The UI is not showing download progress so we can filter to only emit on status change
      distinctUntilChanged((a: UpdaterState, b: UpdaterState) => {
        return a.status !== b.status
      }),
      map(systemUpdate => ({ systemUpdateChanged: { systemUpdate } })),
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
    contactRequestsChanged,
    systemUpdateChanged,
  }),
})
