import { HtmlHTMLAttributes, ReactNode } from 'react'

interface CardProps extends HtmlHTMLAttributes<HTMLDivElement> {
  children: ReactNode
}
export const Card = ({ children, ...props }: CardProps) => {
  return (
    <div {...props} className={`p-6 ${props.className} bg-white  rounded-lg  shadow-lg`}>
      {children}
    </div>
  )
}
