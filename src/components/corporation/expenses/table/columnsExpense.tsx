import { createColumnHelper } from '@tanstack/react-table'
import { IExpense } from '@interfaces/expense'
import { IconButton } from '@mui/material'
import { IconEdit, IconEye, IconEyeOff, IconTrash } from '@tabler/icons-react'
import { cn, formatNumber } from '@lib/utils'
import { ChipStatusExpense } from '../components/ChipStatusExpense'
import { useNavigate } from 'react-router-dom'

const columnHelper = createColumnHelper<IExpense>()

export const columnsExpense = (
  setDataSelectedFile: (data: string | undefined) => void,
  setDataSelected: (data: IExpense) => void,
  openModalFile: () => void,
  openModalDelete: () => void
) => [
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
  columnHelper.accessor('serie', {
    header: 'Serie',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('status', {
    header: 'Estado',
    cell: (info) => <ChipStatusExpense status={info.getValue()!} />
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
            <IconEyeOff className="disabled:text-gray-600" />
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
            <IconEyeOff className="disabled:text-gray-600" />
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
            <IconEyeOff className="disabled:text-gray-600" />
          </IconButton>
        )

      return (
        <IconButton onClick={handleShowFile}>
          <IconEye className="text-primary-600" />
        </IconButton>
      )
    }
  }),

  {
    header: 'Acción',
    id: 'accion',
    cell: (info: any) => {
      const data = info.row.original
      const disabled = info.row.original?.status !== 'DRAFT'
      const navigate = useNavigate()

      const handleModalDelete = () => {
        setDataSelected(data)
        openModalDelete()
      }

      const handleModalEdit = () => {
        navigate(`/edit-expense/${data?._id}`)
      }

      const handleModalDetail = () => {
        navigate(`/expense/${data?._id}`)
      }

      return (
        <div className="flex gap-5">
          <IconButton onClick={handleModalDetail}>
            <IconEye className="text-primary-600" />
          </IconButton>
          <IconButton onClick={handleModalEdit} disabled={disabled}>
            <IconEdit className={cn(disabled ? 'disabled:text-gray-600' : 'text-primary-600')} />
          </IconButton>
          <IconButton onClick={handleModalDelete} disabled={disabled}>
            <IconTrash className={cn(disabled ? 'disabled:text-gray-600' : 'text-primary-600')} />
          </IconButton>
        </div>
      )
    }
  }
]
