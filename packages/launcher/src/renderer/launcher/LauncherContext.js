// @flow

import { createContext } from 'react'

export type CurrentUser = {
  localID: string,
  defaultEthAddress: ?string,
}

const LauncherContext = createContext<{ user?: CurrentUser }>({})

export default LauncherContext
