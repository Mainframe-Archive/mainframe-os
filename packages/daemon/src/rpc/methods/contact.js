// @flow

import {
  type ContactsApproveContactsForAppParams,
  type ContactsApproveContactsForAppResult,
  type ContactsGetAppApprovedContactsParams,
  type ContactsGetAppUserContactsParams,
  type ContactsGetAppUserContactsResult,
  type ContactsGetUserContactsParams,
  type ContactsGetUserContactsResult,
  CONTACT_GET_APP_APPROVED_CONTACTS_SCHEMA,
  CONTACT_GET_APP_USER_CONTACTS_SCHEMA,
  CONTACT_GET_USER_CONTACTS_SCHEMA,
  CONTACT_APPROVE_CONTACTS_FOR_APP_SCHEMA,
} from '@mainframe/client'

import type ClientContext from '../../context/ClientContext'

export const getUserContacts = {
  params: CONTACT_GET_USER_CONTACTS_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: ContactsGetUserContactsParams,
  ): Promise<ContactsGetUserContactsResult> => {
    const contacts = ctx.queries.getUserContacts(params.userID)
    return { contacts }
  },
}

export const getAppApprovedContacts = {
  params: CONTACT_GET_APP_APPROVED_CONTACTS_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: ContactsGetAppApprovedContactsParams,
  ): Promise<ContactsGetAppUserContactsResult> => {
    const contacts = ctx.queries.getAppApprovedContacts(
      params.appID,
      params.userID,
    )
    return { contacts }
  },
}

export const getAppUserContacts = {
  params: CONTACT_GET_APP_USER_CONTACTS_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: ContactsGetAppUserContactsParams,
  ): Promise<ContactsGetAppUserContactsResult> => {
    const contacts = ctx.queries.getAppUserContacts(
      params.appID,
      params.userID,
      params.contactIDs,
    )
    return { contacts }
  },
}

export const approveContactsForApp = {
  params: CONTACT_APPROVE_CONTACTS_FOR_APP_SCHEMA,
  handler: async (
    ctx: ClientContext,
    params: ContactsApproveContactsForAppParams,
  ): Promise<ContactsApproveContactsForAppResult> => {
    const approvedContacts = await ctx.mutations.appApproveContacts(
      params.appID,
      params.userID,
      params.contactsToApprove,
    )
    return { approvedContacts }
  },
}
