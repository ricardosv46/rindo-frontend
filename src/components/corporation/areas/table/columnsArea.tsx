// areaColumns.tsx
import { createColumnHelper } from '@tanstack/react-table'
import { IArea } from '@interfaces/area'
import { IconEdit } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { updateArea } from '@services/area'
import { toast } from 'react-toastify'
import { Switch } from '@components/ui/switch'
import { CustomTooltip } from '@components/shared'
import { Button } from '@components/ui/button'
import { Edit } from 'lucide-react'

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

      const handleUpdate = async (value: boolean) => {
        mutateUpdate({ status: value, id: data?._id })
      }

      return <Switch title="Cambiar estado" color="primary" disabled={isPending} checked={info.getValue()} onCheckedChange={handleUpdate} />
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
        <CustomTooltip title="Editar">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={handleUpdate}>
            <Edit className={'text-primary-600'} />
          </Button>
        </CustomTooltip>
      )
    }
  }
]
