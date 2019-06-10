import React from 'react'

const CircleCheck = props => (
  <svg width="1em" height="1em" viewBox="0 0 26 26" {...props}>
    <g stroke="#00A7E7" fill="none" fillRule="evenodd">
      <g transform="translate(1 1)">
        <circle cx={12} cy={12} r={12} />
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12h0" />
      </g>
      <path strokeLinecap="round" d="M8 12.924L11.675 17 18 9" />
    </g>
  </svg>
)

export default CircleCheck
