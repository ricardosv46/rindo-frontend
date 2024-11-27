import { IconButtonPurple } from '@components/shared'
import { useSidebar } from '@store/sidebar'
import { IconMenu2 } from '@tabler/icons-react'
import React from 'react'

export const Menu = () => {
  const { toggleSidebar } = useSidebar()

  return (
    <IconButtonPurple onClick={toggleSidebar}>
      <IconMenu2 stroke={1.5} size="20px" />
    </IconButtonPurple>
  )
}
