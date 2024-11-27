import { FormRegister } from '@components/auth'
import React from 'react'
import Logo from '../../../assets/images/Logo-Rindo.png'
import { Card } from '@components/shared'

const PageRegister = () => {
  return (
    <div className="grid h-full bg-rindo place-items-center">
      {/* <Card className="w-[400px] flex flex-col gap-5">
        <img src={Logo} alt="logo-rindo" className="w-[180px] mx-auto" />
        <p className="text-center text-primary-300 font-okine-sans">Introduce tus credenciales para continuar.</p>
        <FormRegister />
      </Card> */}
      <Card className="w-[400px] flex flex-col gap-5">
        <img src={Logo} alt="logo-rindo" className="w-[180px] mx-auto" />
        <p className="text-center text-primary-300 font-okine-sans">Introduce tus credenciales para continuar.</p>
        <FormRegister />
        <hr className="bg-[#e3e8e]" />
        <p className="font-semibold text-center">¿Ya tienes una cuenta?</p>
      </Card>
    </div>
  )
}
export default PageRegister
