import { FormLogin } from '@components/auth'
import { Card } from '@components/shared'
import React from 'react'
import Logo from '../../../assets/images/Logo-Rindo.png'

const PageLogin = () => {
  return (
    <div className="grid h-full bg-rindo place-items-center">
      <Card className="w-[400px] flex flex-col gap-5">
        <img src={Logo} alt="logo-rindo" className="w-[180px] mx-auto" />
        <p className="text-center text-primary-300 font-okine-sans">Introduce tus credenciales para continuar.</p>
        <FormLogin />
      </Card>
    </div>
  )
}

export default PageLogin
