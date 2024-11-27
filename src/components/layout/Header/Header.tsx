import Logo from '../../../assets/images/Logo-Rindo.png'
import { Menu } from '../Menu/Menu'
import { Notification } from '../Notification/Notification'
import { Profile } from '../Profile/Profile'
export const Header = () => {
  return (
    <div className="flex items-center justify-between w-full px-6 py-4">
      <div className="flex h-full gap-[14px]">
        <img src={Logo} alt="logo-rindo" className="w-[180px] hidden lg:block" />
        <Menu />
      </div>
      <div className="flex items-center gap-5">
        <Notification />
        <Profile />
      </div>
    </div>
  )
}
