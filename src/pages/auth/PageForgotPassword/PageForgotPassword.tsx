import { FormForgotPassword } from '@components/auth/FormForgotPassword'
import { Card } from '@components/shared'
import { Button } from '@mui/material'
import Logo from '../../../assets/images/Logo-Rindo.png'

const PageForgotPassword = () => {
  return (
    <div className="grid h-full bg-rindo place-items-center">
      <Card className="w-[400px] flex flex-col gap-5">
        <img src={Logo} alt="logo-rindo" className="w-[180px] mx-auto" />

        <p className="text-2xl font-bold text-center text-primary-600">¿Olvidaste tu contraseña?</p>
        <p className="text-center text-primary-300">
          Por favor, ingresa la dirección de correo electrónico asociada a tu cuenta y te enviaremos un enlace por correo electrónico para
          restablecer tu contraseña.
        </p>
        <FormForgotPassword />
        <Button variant="contained">Enviar</Button>
        <hr className="bg-[#e3e8e]" />
        <p className="font-semibold text-center ">¿Ya tienes una cuenta?</p>
      </Card>
    </div>
  )
}

export default PageForgotPassword
