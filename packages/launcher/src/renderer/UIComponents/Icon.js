// @flow
import React, { Component } from 'react'
import { View } from 'react-native'

import { Style } from '../types'

import PlusIcon from './icons/plus.svg'
import RedCloseIcon from './icons/red-close.svg'
import Checkmark from './icons/checkmark.svg'
import MainframeLogo from './icons/mainframe-logo.svg'
import MainframeIcon from './icons/mainframe-icon.svg'
import CircledCross from './icons/circled-cross.svg'
import GenericFile from './icons/generic-file.svg'
import Download from './icons/download.svg'
import DownArrowGrey from './icons/down-arrow-grey.svg'
import LeftArrowGrey from './icons/left-arrow-grey.svg'

const ICONS = {
  plus: PlusIcon,
  'red-close': RedCloseIcon,
  checkmark: Checkmark,
  'mainframe-logo': MainframeLogo,
  'mainframe-icon': MainframeIcon,
  'circled-cross': CircledCross,
  download: Download,
  'generic-file': GenericFile,
  'down-arrow': DownArrowGrey,
  'left-arrow': LeftArrowGrey,
}

type Props = {
  name: string,
  style?: Style,
  height?: number,
}

export default class Icon extends Component<Props> {
  render() {
    return (
      <View style={this.props.style}>
        <img
          alt={this.props.name}
          src={ICONS[this.props.name]}
          height={this.props.height}
        />
      </View>
    )
  }
}
