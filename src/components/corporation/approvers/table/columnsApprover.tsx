import { cn, ROLES } from '@/lib/utils'
import { Chip, CustomTooltip } from '@components/shared'
import { Button } from '@components/ui/button'
import { useToggle } from '@hooks/useToggle'
import { IArea } from '@interfaces/area'
import { IUser } from '@interfaces/user'
import { createColumnHelper } from '@tanstack/react-table'
import { Eye, Trash } from 'lucide-react'
import { useEffect, useRef } from 'react'

const columnHelper = createColumnHelper<IUser>()

export const columnsApprover = (
  areas: IArea[],
  setDataSelected: (data: IArea | null) => void,
  openModalDelete: () => void,
  area: string
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
    cell: (info) => info.getValue()?.name ?? '-'
  }),
  columnHelper.accessor('areas', {
    header: 'Areas',
    cell: (info) => {
      const [isOpenAreas, openModalAreas, closeModalAreas] = useToggle()

      const data = info.row.original

      let name = ''

      if (data?.role === 'APPROVER')
        name = info?.getValue()?.length === 1 ? areas.find((i) => i._id === info.getValue()?.[0])?.name ?? '' : ''

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
                .map((i) => (
                  <p key={i._id}>{i?.name}</p>
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

      const handleDelete = () => {
        setDataSelected(data)
        openModalDelete()
      }

      const disabled = area === 'all'

      return (
        <CustomTooltip title="Eliminar">
          <Button variant="ghost" size="icon" disabled={disabled} className="w-8 h-8 rounded-full" onClick={handleDelete}>
            <Trash className={cn(disabled ? 'disabled:text-gray-600' : 'text-red-600')} />
          </Button>
        </CustomTooltip>
      )
    }
  }
]
