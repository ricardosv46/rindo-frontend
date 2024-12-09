import { ScrollArea } from '@/components/ui/scroll-area'
import { Button, colors } from '@mui/material'
import { useSidebar } from '@store/sidebar'
import { ChevronDown, LayoutDashboard, Settings, Users } from 'lucide-react'
import { useAuth } from '@store/auth'
import { useToggle } from '@hooks/useToggle'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Role } from '@interfaces/user'
import { ROLES } from '@/lib/utils'

type MenuItem = {
  icon: React.ReactNode
  label: string
  url: string
  subItems?: MenuItem[]
}

const ADMIN: MenuItem[] = [{ icon: <Users className="w-4 h-4" />, label: 'Usuarios', url: '/users' }]

const CORPORATION: MenuItem[] = [
  { icon: <Users className="w-4 h-4" />, label: 'Gastos', url: '/expenses' },
  { icon: <Users className="w-4 h-4" />, label: 'Reportes', url: '/reports' },
  { icon: <Users className="w-4 h-4" />, label: 'Usuarios', url: '/users' },
  { icon: <Settings className="w-4 h-4" />, label: 'Aprobadores', url: '/approvers' },
  { icon: <Users className="w-4 h-4" />, label: 'Areas', url: '/areas' },
  { icon: <Users className="w-4 h-4" />, label: 'Empresas', url: '/companies' }
]

const SUBMITTER: MenuItem[] = [
  { icon: <Users className="w-4 h-4" />, label: 'Gastos', url: '/expenses' },
  { icon: <Users className="w-4 h-4" />, label: 'Informes', url: '/reports' },
  { icon: <Users className="w-4 h-4" />, label: 'Revision', url: '/review' }
]

const APPROVER: MenuItem[] = [
  {
    icon: <Users className="w-4 h-4" />,
    label: 'Aprobador',
    url: '/to-review',
    subItems: [
      { icon: <Users className="w-4 h-4" />, label: 'Por Revisar', url: '/to-review' },
      { icon: <Users className="w-4 h-4" />, label: 'Revisados', url: '/reviewed' }
    ]
  }
]

const GLOBAL_APPROVER: MenuItem[] = [
  {
    icon: <Users className="w-4 h-4" />,
    label: 'Aprobador',
    url: '/to-review',
    subItems: [
      { icon: <Users className="w-4 h-4" />, label: 'Por Revisar', url: '/to-review' },
      { icon: <Users className="w-4 h-4" />, label: 'Revisados', url: '/reviewed' }
    ]
  }
]

const MENUS = {
  ADMIN,
  CORPORATION,
  SUBMITTER,
  APPROVER,
  GLOBAL_APPROVER
}

export const MenuItem = ({ item, isExpanded, depth = 0 }: { item: MenuItem; isExpanded: boolean; depth?: number }) => {
  const [isOpen, , , toggleSubMenu] = useToggle()

  const location = useLocation()

  const hasSubItems = item.subItems && item.subItems.length > 0

  return (
    <div className="">
      <Link to={item.url}>
        <Button
          sx={{
            padding: location?.pathname === item?.url ? '6px 8px' : 'auto'
          }}
          variant={location?.pathname === item?.url ? 'contained' : 'text'}
          className={`w-full flex justify-between bg-red-500  ${depth > 0 ? 'pl-8' : ''}`}
          onClick={toggleSubMenu}>
          <div className="flex items-center justify-between w-full ">
            <div className="flex items-center h-[24.5px] ">
              {item.icon}
              {isExpanded && <span className="ml-2">{item.label}</span>}
            </div>

            {isExpanded && hasSubItems && <ChevronDown className={` h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
          </div>
        </Button>
      </Link>
      {isExpanded && isOpen && hasSubItems && (
        <div className="ml-4">
          {item.subItems!.map((subItem, index) => (
            <MenuItem key={index} item={subItem} isExpanded={isExpanded} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export const Sidebar = () => {
  const { user } = useAuth()

  const { isExpanded } = useSidebar()

  const menuItemsRender = MENUS[user?.role as Role] || []

  return (
    <div
      className={`h-full inset-y-0 left-0 z-50 flex flex-col bg-background border-r transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? 'w-64' : 'w-16'
      }`}>
      {isExpanded && <p className="p-4 font-bold ftext-lg text-primary-600">{ROLES[user?.role!]}</p>}
      {!isExpanded && <span className="p-7"></span>}
      <ScrollArea className="flex-grow ">
        <nav className="p-3">
          {menuItemsRender.map((item, index) => (
            <MenuItem key={index} item={item} isExpanded={isExpanded} />
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
