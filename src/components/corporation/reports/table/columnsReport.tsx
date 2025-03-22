import { createColumnHelper } from '@tanstack/react-table'
import { IExpense } from '@interfaces/expense'
import { IconButton } from '@mui/material'
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react'
import { formatNumber } from '@lib/utils'
import { useNavigate } from 'react-router-dom'
import { ChipStatusReport } from '../components/ChipStatusReport'
import { IReport } from '@interfaces/report'
import { EyeIcon } from 'lucide-react'
import { Role } from '@interfaces/user'

const columnHelper = createColumnHelper<IReport>()

export const columnsReport = (setDataSelected: (data: IReport) => void, openModalDelete: () => void, role: Role) => [
  {
    header: 'ID',
    id: 'index',
    cell: (info: any) => info.row.index + 1
  },
  columnHelper.accessor('name', {
    header: 'Ruc',
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

      return (
        <div className="flex gap-5">
          <IconButton onClick={handleDetail}>
            <EyeIcon className="text-primary-600" />
          </IconButton>

          {role === 'SUBMITTER' && (
            <>
              <IconButton onClick={handleModalEdit}>
                <IconEdit className="text-primary-600" />
              </IconButton>
              <IconButton onClick={handleModalDelete}>
                <IconTrash className="text-primary-600" />
              </IconButton>
            </>
          )}
        </div>
      )
    }
  }
]
