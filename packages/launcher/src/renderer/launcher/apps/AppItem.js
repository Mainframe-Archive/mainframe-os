// @flow

import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native-web'
import { createFragmentContainer, graphql } from 'react-relay'
import type { AppOwnData, AppInstalledData } from '@mainframe/client'

import colors from '../../colors'
import Text from '../../UIComponents/Text'

type AppData = AppOwnData | AppInstalledData

type SharedProps = {
  onOpenApp: (app: AppData, own: boolean) => void,
}

type InstalledProps = SharedProps & {
  installedApp: AppInstalledData,
}

type OwnProps = SharedProps & {
  ownApp: AppData,
}

type Props = SharedProps & {
  app: AppData | AppInstalledData,
  isOwn?: boolean,
}

export default class AppItem extends Component<Props> {
  render() {
    const { app, isOwn, onOpenApp } = this.props
    const open = () => onOpenApp(app, !!isOwn)
    return (
      <TouchableOpacity onPress={open} key={app.localID} style={styles.app}>
        <Text style={styles.nameLabel}>{app.name}</Text>
        <Text style={styles.idLabel}>{app.localID}</Text>
      </TouchableOpacity>
    )
  }
}

const InstalledView = (props: InstalledProps) => (
  <AppItem app={props.installedApp} onOpenApp={props.onOpenApp} />
)
const OwnView = (props: OwnProps) => (
  <AppItem app={props.ownApp} onOpenApp={props.onOpenApp} isOwn />
)

export const InstalledAppItem = createFragmentContainer(InstalledView, {
  installedApp: graphql`
    fragment AppItem_installedApp on App {
      localID
      name
      manifest {
        permissions {
          optional {
            WEB_REQUEST
            BLOCKCHAIN_SEND
          }
          required {
            WEB_REQUEST
            BLOCKCHAIN_SEND
          }
        }
      }
      users {
        localID
        identity {
          profile {
            name
          }
        }
        settings {
          permissionsSettings {
            permissionsChecked
            grants {
              BLOCKCHAIN_SEND
              WEB_REQUEST
            }
          }
        }
      }
    }
  `,
})

export const OwnAppItem = createFragmentContainer(OwnView, {
  ownApp: graphql`
    fragment AppItem_ownApp on OwnApp {
      localID
      name
      versions {
        version
        permissions {
          optional {
            WEB_REQUEST
            BLOCKCHAIN_SEND
          }
          required {
            WEB_REQUEST
            BLOCKCHAIN_SEND
          }
        }
      }
      users {
        localID
        identity {
          profile {
            name
          }
        }
      }
    }
  `,
})

const styles = StyleSheet.create({
  app: {
    padding: 10,
    marginTop: 10,
    backgroundColor: colors.LIGHT_GREY_EE,
    flexDirection: 'row',
  },
  nameLabel: {
    flex: 1,
  },
  idLabel: {
    fontSize: 12,
    color: colors.GREY_MED_75,
  },
})
