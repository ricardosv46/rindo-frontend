import { useToggle } from '@hooks/useToggle'
import { useAuth } from '@store/auth'
import { IconLogout, IconSettings } from '@tabler/icons-react'
import { useEffect, useRef } from 'react'

export const Profile = () => {
  const [isOpenProfile, openProfile, closeProfile, toggleProfile] = useToggle()

  const { logoutAction, user } = useAuth()

  const logout = () => {
    logoutAction()
  }

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeProfile()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleProfile}
        className="flex items-center justify-center w-10 h-10 text-white transition-all duration-300 ease-in-out transform rounded-full bg-primary-600 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-opacity-50"
        aria-haspopup="true"
        aria-expanded={isOpenProfile}>
        <span className="text-2xl font-semibold uppercase">{user?.name?.slice(0, 1)}</span>
      </button>
      <div
        className={`z-[9999] absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-in-out transform origin-top-right ${
          isOpenProfile ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}>
        <div className="p-2 ">
          <div className="px-4 py-3 text-sm border-b border-gray-200">
            <p className="text-lg font-semibold uppercase">{user?.name}</p>
            <p className="text-xs font-medium uppercase text-primary-600">{user?.email}</p>
          </div>
          <div className="flex flex-col gap-1 py-3">
            <button className="flex items-center w-full gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-lg text-primary-600 hover:bg-primary-600 hover:text-white">
              <IconSettings className="w-5 h-5" />
              <span>Configuración</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center w-full gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-lg text-primary-600 hover:bg-primary-600 hover:text-white">
              <IconLogout className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
