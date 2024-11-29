import { createColumnHelper } from '@tanstack/react-table'
import { ICompany } from '@interfaces/company'
import { IconButton } from '@mui/material'
import { IconTrash } from '@tabler/icons-react'

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
        <div className="flex gap-5">
          <IconButton onClick={handleDelete}>
            <IconTrash className="text-primary-600" />
          </IconButton>
        </div>
      )
    }
  }
]
