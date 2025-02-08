import { createColumnHelper } from '@tanstack/react-table'
import { IExpense } from '@interfaces/expense'
import { Checkbox, IconButton } from '@mui/material'
import { IconEdit, IconEye, IconEyeClosed, IconEyeOff, IconTrash } from '@tabler/icons-react'
import { formatNumber } from '@lib/utils'
import { ChipStatus } from '../components/ChipStatus'
import { useNavigate } from 'react-router-dom'

const columnHelper = createColumnHelper<IExpense>()

export const columnsExpenseByReport = (
  setDataSelectedFile: (data: string | undefined) => void,
  openModalFile: () => void,
  dataSelected: string[],
  setDataSelected: (expenses: string[]) => void,
  filteredExpenses: IExpense[]
) => [
  {
    header: () => {
      const isAllSelected = dataSelected?.length === filteredExpenses.length

      const handleSelectAll = () => {
        if (isAllSelected) {
          setDataSelected([])
        } else {
          setDataSelected(filteredExpenses.map((i) => i._id!))
        }
      }
      return <Checkbox checked={isAllSelected} onChange={handleSelectAll} />
    },
    id: 'selection',
    cell: (info: any) => {
      const data = info.row.original
      const isSelected = dataSelected?.some((expense) => expense === data._id)

      const handleSelectionChange = () => {
        if (isSelected) {
          setDataSelected(dataSelected?.filter((expense) => expense !== data._id))
        } else {
          setDataSelected([...dataSelected, data?._id])
        }
      }

      return <Checkbox checked={isSelected} onChange={handleSelectionChange} />
    }
  },
  {
    header: 'ID',
    id: 'index',
    cell: (info: any) => info.row.index + 1
  },
  columnHelper.accessor('ruc', {
    header: 'Ruc',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('companyName', {
    header: 'Nombre',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('description', {
    header: 'Descripción',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('date', {
    header: 'Fecha de Emisión',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('total', {
    header: 'Monto',
    cell: (info) => formatNumber(String(info.getValue())!)
  }),
  columnHelper.accessor('currency', {
    header: 'Moneda',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('status', {
    header: 'Estado',
    cell: (info) => <ChipStatus status={info.getValue()!} />
  }),
  columnHelper.accessor('category', {
    header: 'Categoria',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('file', {
    header: 'Comprobante',
    cell: (info) => {
      const data = info.row.original

      const handleShowFile = () => {
        setDataSelectedFile(data?.file)
        openModalFile()
      }
      if (!data?.file)
        return (
          <IconButton disabled>
            <IconEyeOff className="text-gray-300" />
          </IconButton>
        )
      return (
        <IconButton onClick={handleShowFile}>
          <IconEye className="text-primary-600" />
        </IconButton>
      )
    }
  }),
  columnHelper.accessor('fileVisa', {
    header: 'Cuenta',
    cell: (info) => {
      const data = info.row.original

      const handleShowFile = () => {
        setDataSelectedFile(data?.fileVisa)
        openModalFile()
      }
      if (!data?.fileVisa)
        return (
          <IconButton disabled>
            <IconEyeOff className="text-gray-300" />
          </IconButton>
        )
      return (
        <IconButton onClick={handleShowFile}>
          <IconEye className="text-primary-600" />
        </IconButton>
      )
    }
  }),
  columnHelper.accessor('fileRxh', {
    header: 'Suspención',
    cell: (info) => {
      const data = info.row.original

      const handleShowFile = () => {
        setDataSelectedFile(data?.fileRxh)
        openModalFile()
      }

      if (!data?.fileRxh)
        return (
          <IconButton disabled>
            <IconEyeOff className="text-gray-300" />
          </IconButton>
        )

      return (
        <IconButton onClick={handleShowFile}>
          <IconEye className="text-primary-600" />
        </IconButton>
      )
    }
  })
]
