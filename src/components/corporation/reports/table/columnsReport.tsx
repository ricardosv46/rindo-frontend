import { CustomTooltip } from '@components/shared/CustomTooltip/CustomTooltip'
import { Button } from '@components/ui/button'
import { IExpense } from '@interfaces/expense'
import { IReport } from '@interfaces/report'
import { Role } from '@interfaces/user'
import { cn } from '@lib/utils'
import { createColumnHelper } from '@tanstack/react-table'
import { Edit, Eye, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ChipStatusReport } from '../components/ChipStatusReport'

const columnHelper = createColumnHelper<IReport>()

export const columnsReport = (setDataSelected: (data: IReport) => void, openModalDelete: () => void, role: Role) => [
  {
    header: 'ID',
    id: 'index',
    cell: (info: any) => info.row.index + 1
  },
  columnHelper.accessor('name', {
    header: 'Descripción',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('created', {
    header: 'Fecha',
    cell: (info) => info.getValue()
  }),
  {
    header: 'Aprobados',
    id: 'approved',
    cell: (info: any) => {
      const data = info.row.original
      return data.expenses?.filter((expense: IExpense) => expense.status === 'APPROVED').length
    }
  },
  {
    header: 'Rechazados',
    id: 'rejected',
    cell: (info: any) => {
      const data = info.row.original
      return data.expenses?.filter((expense: IExpense) => expense.status === 'REJECTED').length
    }
  },
  {
    header: 'Total Gastos',
    id: 'amount',
    cell: (info: any) => {
      const data = info.row.original
      return data.expenses?.length
    }
  },
  columnHelper.accessor('status', {
    header: 'Estado',
    cell: (info) => <ChipStatusReport status={info.getValue()!} />
  }),

  {
    header: 'Acción',
    id: 'accion',
    cell: (info: any) => {
      const data = info.row.original

      const navigate = useNavigate()

      const handleModalDelete = () => {
        setDataSelected(data)
        openModalDelete()
      }

      const handleModalEdit = () => {
        navigate(`/edit-report/${data?._id}`)
      }

      const handleDetail = () => {
        navigate(`/report/${data?._id}`)
      }

      const disabled = data?.status !== 'DRAFT'
      return (
        <div className="flex gap-5">
          <CustomTooltip title="Ver Detalle">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleDetail}>
              <Eye className="text-primary-600" />
            </Button>
          </CustomTooltip>

          {role === 'SUBMITTER' && (
            <>
              <CustomTooltip title="Editar">
                <Button variant="ghost" size="icon" disabled={disabled} className="rounded-full" onClick={handleModalEdit}>
                  <Edit className={cn(disabled ? 'disabled:text-gray-600' : 'text-primary-600')} />
                </Button>
              </CustomTooltip>
              <CustomTooltip title="Eliminar">
                <Button variant="ghost" size="icon" disabled={disabled} className="w-8 h-8 rounded-full" onClick={handleModalDelete}>
                  <Trash className={cn(disabled ? 'disabled:text-gray-600' : 'text-red-600')} />
                </Button>
              </CustomTooltip>
            </>
          )}
        </div>
      )
    }
  }
]
