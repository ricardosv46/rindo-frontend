import { CustomTooltip } from '@components/shared/CustomTooltip/CustomTooltip'
import { ChipStatusExpense } from '@components/corporation/expenses/components/ChipStatusExpense'
import { Button } from '@components/ui/button'
import { Checkbox } from '@components/ui/checkbox'
import { IExpense } from '@interfaces/expense'
import { formatNumber } from '@lib/utils'
import { createColumnHelper } from '@tanstack/react-table'
import { Eye, EyeOff } from 'lucide-react'

const columnHelper = createColumnHelper<IExpense>()

export const columnsExpenseByReportReadOnly = (
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
      return <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
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

      return <Checkbox checked={isSelected} onCheckedChange={handleSelectionChange} />
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

      const handleShowFile = () => {
        setDataSelectedFile(data?.fileRxh)
        openModalFile()
      }

      const disabled = !data?.fileRxh

      return (
        <CustomTooltip title="Ver Suspención">
          <Button variant="ghost" size="icon" disabled={disabled} className="rounded-full" onClick={handleShowFile}>
            {!disabled && <Eye className="text-primary-600" />}
            {disabled && <EyeOff className="text-gray-600" />}
          </Button>
        </CustomTooltip>
      )
    }
  })
]
