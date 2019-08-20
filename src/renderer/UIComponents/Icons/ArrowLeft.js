import React from 'react'

const SvgTest = props => (
  <svg width="7" height="12" viewBox="0 0 7 12" {...props}>
    <defs>
      <path id="test_svg__a" d="M0 0h6.75v12H0z" />
    </defs>
    <g transform="matrix(-1 0 0 1 7 0)" fill="none" fillRule="evenodd">
      <mask id="test_svg__b" fill="#fff">
        <use xlinkHref="#test_svg__a" />
      </mask>
      <path
        d="M.22.22a.75.75 0 0 0 0 1.06L4.939 6l-4.72 4.72a.75.75 0 0 0 1.061 1.06l5.25-5.25a.748.748 0 0 0 0-1.06L1.28.22a.75.75 0 0 0-1.06 0"
        fill="#A9A9A9"
        mask="url(#test_svg__b)"
      />
    </g>
  </svg>
)

export default SvgTest
