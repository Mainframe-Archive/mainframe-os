//@flow

import { graphql } from 'react-relay'

export const appCreateMutation = graphql`
  mutation appMutationsAppCreateMutation($input: AppCreateMutationInput!) {
    createApp(input: $input) {
      app {
        id
        localID
        name
      }
      viewer {
        apps {
          ...OwnAppsView_apps
        }
      }
    }
  }
`

export const appInstallMutation = graphql`
  mutation appMutationsAppInstallMutation($input: AppInstallMutationInput!) {
    installApp(input: $input) {
      app {
        id
        localID
        name
      }
      viewer {
        apps {
          ...AppsView_apps
        }
      }
    }
  }
`
