import { CustomTooltip } from '@components/shared/CustomTooltip/CustomTooltip'
import { Button } from '@components/ui/button'
import { IExpense } from '@interfaces/expense'
import { cn, formatNumber } from '@lib/utils'
import { useAuth } from '@store/auth'
import { createColumnHelper } from '@tanstack/react-table'
import { Edit, Eye, EyeOff, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ChipStatusExpense } from '../components/ChipStatusExpense'

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

      const disabled = !data?.file

      return (
        <CustomTooltip title="Ver Comprobante">
          <Button variant="ghost" size="icon" disabled={disabled} className="rounded-full" onClick={handleShowFile}>
            {!disabled && <Eye className="text-primary-600" />}
            {disabled && <EyeOff className="text-gray-600" />}
          </Button>
        </CustomTooltip>
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

      const disabled = !data?.fileVisa

      return (
        <CustomTooltip title="Ver Cuenta">
          <Button variant="ghost" size="icon" disabled={disabled} className="rounded-full" onClick={handleShowFile}>
            {!disabled && <Eye className="text-primary-600" />}
            {disabled && <EyeOff className="text-gray-600" />}
          </Button>
        </CustomTooltip>
      )
    }
  }),
  columnHelper.accessor('fileRxh', {
    header: 'Suspención',
    cell: (info) => {
      const data = info.row.original

      const disabled = !data?.fileRxh

      const handleShowFile = () => {
        setDataSelectedFile(data?.fileRxh)
        openModalFile()
      }

      return (
        <CustomTooltip title="Ver Suspención">
          <Button variant="ghost" size="icon" disabled={disabled} className="rounded-full" onClick={handleShowFile}>
            {!disabled && <Eye className="text-primary-600" />}
            {disabled && <EyeOff className="text-gray-600" />}
          </Button>
        </CustomTooltip>
      )
    }
  }),

  {
    header: 'Acción',
    id: 'accion',
    cell: (info: any) => {
      const { user } = useAuth()
      const data = info.row.original
      const disabled = data?.status !== 'DRAFT' && data?.status !== 'IN_REVIEW'
      const navigate = useNavigate()

      const handleModalDelete = () => {
        setDataSelected(data)
        openModalDelete()
      }

      const handleModalEdit = () => {
        if (data?.status === 'IN_REVIEW') {
          navigate(`/review-expense/${data?._id}`)
        } else {
          navigate(`/edit-expense/${data?._id}`)
        }
      }

      const handleModalDetail = () => {
        navigate(`/expense/${data?._id}`)
      }

      return (
        <div className="flex gap-3">
          <CustomTooltip title="Ver Detalle">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleModalDetail}>
              <Eye className="text-primary-600" />
            </Button>
          </CustomTooltip>

          {user?.role !== 'CORPORATION' && (
            <>
              <CustomTooltip title="Editar">
                <Button variant="ghost" size="icon" disabled={disabled} className="rounded-full" onClick={handleModalEdit}>
                  <Edit className={cn(disabled ? 'disabled:text-gray-600' : 'text-primary-600')} />
                </Button>
              </CustomTooltip>
              {data?.status !== 'IN_REVIEW' && (
                <CustomTooltip title="Eliminar">
                  <Button variant="ghost" size="icon" disabled={disabled} className="w-8 h-8 rounded-full" onClick={handleModalDelete}>
                    <Trash className={cn(disabled ? 'disabled:text-gray-600' : 'text-red-600')} />
                  </Button>
                </CustomTooltip>
              )}
            </>
          )}
        </div>
      )
    }
  }
]
