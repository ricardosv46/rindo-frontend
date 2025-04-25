import { createColumnHelper } from '@tanstack/react-table'
import { IUser } from '@interfaces/user'
import { Chip, CustomTooltip } from '@components/shared'
import { IconButton } from '@mui/material'
import { IconTrash, IconEdit } from '@tabler/icons-react'
import { Edit, Eye, EyeIcon, Trash } from 'lucide-react'
import { useToggle } from '@hooks/useToggle'
import { useEffect, useRef } from 'react'
import { cn, ROLES } from '@/lib/utils'
import { IArea } from '@interfaces/area'
import { Button } from '@components/ui/button'

const columnHelper = createColumnHelper<IUser>()

export const columnsUser = (
  areas: IArea[],
  setUserSelected: (data: IUser | null) => void,
  openModalUpdate: () => void,
  openModalDelete: () => void
) => [
  {
    header: 'ID',
    id: 'index',
    cell: (info: any) => info.row.index + 1
  },
  columnHelper.accessor('name', {
    header: 'Nombre',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('lastname', {
    header: 'Apellido',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('email', {
    header: 'Correo',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('phone', {
    header: 'Celular',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('document', {
    header: 'Documento',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('company', {
    header: 'Empresa',
    cell: (info) => info.getValue()?.name ?? 'Todas'
  }),
  columnHelper.accessor('areas', {
    header: 'Areas',
    cell: (info) => {
      const [isOpenAreas, openModalAreas, closeModalAreas] = useToggle()

      const data = info.row.original

      let name = ''
      if (data?.role === 'SUBMITTER') name = areas.filter((i) => i._id === info.getValue()?.[0])[0]?.name ?? ''
      if (data?.role === 'APPROVER')
        name = info?.getValue()?.length === 1 ? areas.filter((i) => i._id === info.getValue()?.[0])[0]?.name ?? '' : ''
      if (data?.role === 'GLOBAL_APPROVER') name = '-'

      const dropdownRef = useRef<HTMLDivElement>(null)

      useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            closeModalAreas()
          }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
          document.removeEventListener('mousedown', handleClickOutside)
        }
      }, [])

      return (
        <div className="relative flex items-center gap-1" ref={dropdownRef}>
          {name}
          {data?.role === 'APPROVER' && name === '' && (
            <CustomTooltip title="Ver Areas">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={openModalAreas}>
                <Eye className={cn('text-primary-600')} />
              </Button>
            </CustomTooltip>
          )}

          <div
            className={`z-[9999] absolute right-0 mt-2 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-in-out transform origin-top-right ${
              isOpenAreas ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
            }`}>
            <div className="p-2 ">
              {areas
                .filter((i) => info.getValue()?.includes(i?._id!))
                .map((i, index) => (
                  <p key={index}>{i?.name}</p>
                ))}
            </div>
          </div>
        </div>
      )
    }
  }),
  columnHelper.accessor('role', {
    header: 'Rol',
    cell: (info) => (
      <Chip
        label={ROLES[info.getValue()!]}
        color={info.getValue() === 'APPROVER' ? 'blue' : info.getValue() === 'GLOBAL_APPROVER' ? 'purple' : 'yellow'}
      />
    )
  }),
  columnHelper.accessor('verify_email', {
    header: 'Confirmado',
    cell: (info) => (
      <>
        {info.getValue() && <Chip label="Si" color="green" />}
        {!info.getValue() && <Chip label="No" color="red" />}
      </>
    )
  }),
  {
    header: 'Acción',
    id: 'accion',
    cell: (info: any) => {
      const data = info.row.original

      const handleUpdate = () => {
        setUserSelected(data)
        openModalUpdate()
      }

      const handleDelete = () => {
        setUserSelected(data)
        openModalDelete()
      }

      return (
        <div className="flex gap-5">
          <CustomTooltip title="Editar">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleUpdate}>
              <Edit className={cn('text-primary-600')} />
            </Button>
          </CustomTooltip>
          <CustomTooltip title="Eliminar">
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={handleDelete}>
              <Trash className={cn('text-red-600')} />
            </Button>
          </CustomTooltip>
        </div>
      )
    }
  }
]
