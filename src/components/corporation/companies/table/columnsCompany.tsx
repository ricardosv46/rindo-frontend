import { CustomTooltip } from '@components/shared'
import { Button } from '@components/ui/button'
import { ICompany } from '@interfaces/company'
import { createColumnHelper } from '@tanstack/react-table'
import { Trash } from 'lucide-react'

const columnHelper = createColumnHelper<ICompany>()

export const columnsCompany = (setDataSelected: (data: ICompany | null) => void, openModalDelete: () => void) => [
  {
    header: 'ID',
    id: 'index',
    cell: (info: any) => info.row.index + 1
  },
  columnHelper.accessor('ruc', {
    header: 'Ruc',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('name', {
    header: 'Nombre',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('username', {
    header: 'Usuario',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('token', {
    header: 'Token',
    cell: (info) => info.getValue()
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

      return (
        <CustomTooltip title="Eliminar">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={handleDelete}>
            <Trash className={'text-red-600'} />
          </Button>
        </CustomTooltip>
      )
    }
  }
]
