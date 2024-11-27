import { FormResetPassword } from '@components/auth/FormResetPassword'
import { Card } from '@components/shared'
import Logo from '../../../assets/images/Logo-Rindo.png'

const PageResetPassword = () => {
  return (
    <div className="grid h-full bg-rindo place-items-center">
      <Card className="w-[400px] flex flex-col gap-5">
        <img src={Logo} alt="rindo-logo" className="w-[180px] mx-auto" />
        <p className="font-semibold text-center text-primary-600">Restablecer la contraseña</p>
        <FormResetPassword />
      </Card>
    </div>
  )
}
export default PageResetPassword
