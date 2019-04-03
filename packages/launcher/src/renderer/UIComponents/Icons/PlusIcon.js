import React from 'react'

const SvgPlusIcon = props => (
  <svg width="1em" height="1em" viewBox="0 0 14 14" {...props}>
    <defs>
      <path
        d="M6.5.5v6h-6a.5.5 0 0 0 0 1h6v6a.5.5 0 0 0 1 0v-6h6a.5.5 0 0 0 0-1h-6v-6a.5.5 0 0 0-1 0z"
        id="plus-icon_svg__a"
      />
    </defs>
    <g fill="none" fillRule="evenodd">
      <mask id="plus-icon_svg__b" fill="#fff">
        <use xlinkHref="#plus-icon_svg__a" />
      </mask>
      <path
        fill="currentColor"
        mask="url(#plus-icon_svg__b)"
        d="M-5 19h24V-5H-5z"
      />
    </g>
  </svg>
)

export default SvgPlusIcon
