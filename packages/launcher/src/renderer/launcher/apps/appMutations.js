//@flow

import { graphql } from 'react-relay'

export const appInstallMutation = graphql`
  mutation appMutationsAppInstallMutation($input: AppInstallMutationInput!) {
    installApp(input: $input) {
      appVersion {
        id
        localID
        manifest {
          profile {
            name
          }
        }
      }
      viewer {
        id
        # apps {
        #   ...AppsView_apps
        # }
      }
    }
  }
`
