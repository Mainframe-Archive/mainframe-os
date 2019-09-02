// @flow

import React, { Component } from 'react'

type Props = {
  light?: boolean,
  height?: number,
  width?: number,
}

export default class Loader extends Component<Props> {
  render() {
    const { light, height, width } = this.props
    return (
      <svg
        width={width ? width : '35px'}
        height={height ? height : '35px'}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        className="lds-ring">
        <circle
          cx="50"
          cy="50"
          fill="none"
          r="45"
          stroke="#00A7E7"
          strokeWidth="6"
        />
        <circle
          cx="50"
          cy="50"
          fill="none"
          r="45"
          stroke={light ? '#EFEFEF' : '#ffffff'}
          strokeWidth="6"
          strokeLinecap="square"
          transform="rotate(502.931 50 50)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            calcMode="linear"
            values="0 50 50;180 50 50;720 50 50"
            keyTimes="0;0.5;1"
            dur="4.4s"
            begin="0s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dasharray"
            calcMode="linear"
            values="28.274333882308138 254.46900494077326;268.6061718819273 14.137166941154078;28.274333882308138 254.46900494077326"
            keyTimes="0;0.5;1"
            dur="4.4"
            begin="0s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    )
  }
}
