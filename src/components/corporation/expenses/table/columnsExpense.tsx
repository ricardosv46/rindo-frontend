import { createColumnHelper } from '@tanstack/react-table'
import { IExpense } from '@interfaces/expense'
import { IconButton } from '@mui/material'
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react'
import { formatNumber } from '@lib/utils'
import { ChipStatus } from '../components/ChipStatus'
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
      if (!data?.file) return null
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
      if (!data?.fileVisa) return null
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

      if (!data?.fileRxh) return null

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

      const navigate = useNavigate()

      const handleModalDelete = () => {
        setDataSelected(data)
        openModalDelete()
      }

      const handleModalEdit = () => {
        navigate(`/edit-expense/${data?._id}`)
      }

      return (
        <div className="flex gap-5">
          <IconButton onClick={handleModalEdit}>
            <IconEdit className="text-primary-600" />
          </IconButton>
          <IconButton onClick={handleModalDelete}>
            <IconTrash className="text-primary-600" />
          </IconButton>
        </div>
      )
    }
  }
]
