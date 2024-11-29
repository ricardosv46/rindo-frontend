// areaColumns.tsx
import { createColumnHelper } from '@tanstack/react-table'
import { IArea } from '@interfaces/area'
import { IconButton, Switch } from '@mui/material'
import { IconEdit } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { updateArea } from '@services/area'
import { toast } from 'react-toastify'

const columnHelper = createColumnHelper<IArea>()

export const columnsArea = (setDataSelected: (data: IArea | null) => void, openModalUpdate: () => void, refetch: () => void) => [
  {
    header: 'ID',
    id: 'id',
    cell: (info: any) => info.row.index + 1
  },
  columnHelper.accessor('name', {
    header: 'Nombre',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('company', {
    header: 'Empresa',
    cell: (info) => info.getValue()?.name
  }),
  columnHelper.accessor('status', {
    header: 'Estado',
    cell: (info) => {
      const data = info.row.original

      const { mutate: mutateUpdate, isPending } = useMutation({
        mutationFn: updateArea,
        onError: (error: string) => {
          toast.error(error)
        },
        onSuccess: async ({ message }) => {
          toast.success(message)
          refetch()
        }
      })

      const handleUpdate = async (e: any) => {
        mutateUpdate({ status: e.target.checked, id: data?._id })
      }

      return <Switch title="Cambiar estado" color="primary" disabled={isPending} checked={info.getValue()} onChange={handleUpdate} />
    }
  }),
  {
    header: 'Nro de aprobadores',
    id: 'approvers',
    cell: (info: any) => info.row.original.approvers.length
  },
  {
    header: 'Acción',
    id: 'accion',
    cell: (info: any) => {
      const data = info.row.original

      const handleUpdate = () => {
        setDataSelected(data)
        openModalUpdate()
      }

      return (
        <div className="flex gap-5">
          <IconButton onClick={handleUpdate}>
            <IconEdit className="text-primary-600" />
          </IconButton>
        </div>
      )
    }
  }
]
