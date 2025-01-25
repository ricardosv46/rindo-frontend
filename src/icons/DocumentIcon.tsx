import * as React from 'react'
import { SVGProps } from 'react'
export const DocumentIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth={0}
    viewBox="0 0 24 24"
    height="200px"
    width="200px"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path fill="none" d="M0 0h24v24H0V0z" />
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
  </svg>
)
