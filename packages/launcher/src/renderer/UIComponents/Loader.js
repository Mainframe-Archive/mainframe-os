// @flow

import React, { Component } from 'react'
import { TimelineMax, Linear } from 'gsap'

const FRAMERATE = 0.02
const DISPLACEMENT = 50
const ANIMATION_CONFIG = {
  repeat: -1,
  yoyo: true,
}

type Props = {
  width: number,
  height: number,
}

type Animation = {
  to: (id: string, rate: number, opts: Object) => any,
}

export default class Loader extends Component<Props> {
  static defaultProps = {
    width: 60,
    height: 30,
  }
  animMask: ?Animation = null
  animDark: ?Animation = null
  animRed: ?Animation = null
  animBlue: ?Animation = null

  componentDidMount() {
    this.animMask = new TimelineMax(ANIMATION_CONFIG)
    this.animDark = new TimelineMax(ANIMATION_CONFIG)
    this.animRed = new TimelineMax(ANIMATION_CONFIG)
    this.animBlue = new TimelineMax(ANIMATION_CONFIG)

    for (let i = 0; i <= DISPLACEMENT; i++) {
      if (this.animMask) {
        this.animMask.to('#mask-path', FRAMERATE, {
          attr: {
            transform: 'translate(' + i + ', 0)',
          },
          ease: Linear.easeInOut,
        })
      }
      if (this.animRed) {
        this.animRed.to('#red-circle', FRAMERATE, {
          attr: {
            transform: 'translate(' + i + ', 0)',
          },
          ease: Linear.easeInOut,
        })
      }
      if (this.animDark) {
        this.animDark.to('#dark-circle', FRAMERATE, {
          attr: {
            transform: 'translate(' + (DISPLACEMENT - i) + ', 0)',
          },
          ease: Linear.easeInOut,
        })
      }
      if (this.animBlue) {
        this.animBlue.to('#light-blue', FRAMERATE, {
          attr: {
            transform: 'translate(' + (DISPLACEMENT - i) + ', 0)',
          },
          ease: Linear.easeInOut,
        })
      }
    }
  }

  componentWillUnmount() {
    this.animMask = null
    this.animDark = null
    this.animRed = null
    this.animBlue = null
  }

  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={this.props.width}
        height={this.props.height}
        viewBox="0 0 108 58">
        <defs>
          <mask id="mask">
            <g id="mask-path" transform="translate(0, 0)">
              <path
                fill="#fff"
                d="M29,0A29,29,0,1,0,58,29,29,29,0,0,0,29,0Zm0,41.5A12.5,12.5,0,1,1,41.5,29,12.5,12.5,0,0,1,29,41.5Z"
              />
            </g>
          </mask>
          <g id="dark-circle" transform="translate(50, 0)">
            <path
              fill="#1F3464"
              d="M29,0A29,29,0,1,0,58,29,29,29,0,0,0,29,0Zm0,41.5A12.5,12.5,0,1,1,41.5,29,12.5,12.5,0,0,1,29,41.5Z"
            />
          </g>
        </defs>
        <g id="red-circle" transform="translate(0, 0)">
          <path
            fill="#DA1157"
            d="M29,0A29,29,0,1,0,58,29,29,29,0,0,0,29,0Zm0,41.5A12.5,12.5,0,1,1,41.5,29,12.5,12.5,0,0,1,29,41.5Z"
          />
        </g>
        <g id="light-blue" transform="translate(50, 0)">
          <path
            fill="#1fa7df"
            d="M29,0A29,29,0,1,0,58,29,29,29,0,0,0,29,0Zm0,41.5A12.5,12.5,0,1,1,41.5,29,12.5,12.5,0,0,1,29,41.5Z"
          />
        </g>
        <use xlinkHref="#dark-circle" mask="url(#mask)" />
      </svg>
    )
  }
}
