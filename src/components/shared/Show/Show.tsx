import React, { ReactNode } from 'react'

interface ShowProps {
  condition: boolean
  loadingComponent: ReactNode
  children: ReactNode
}
export const Show = ({ condition, loadingComponent, children }: ShowProps) => {
  return (
    <>
      {condition && loadingComponent} {!condition && children}
    </>
  )
}
