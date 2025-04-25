import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FormInput } from '@components/shared/Forms/FormInput'
import { FormSearchInput } from '@components/shared/Forms/FormSearchInput'
import { TablePagination } from '@components/shared/TablePagination/TablePagination'
import { columnsExpenseByReport } from '@components/corporation/reports/table/columnsExpenseByReport'
import { Card, Modal, Show, Spinner } from '@components/shared'
import { FileUploadReadOnly } from '@components/shared/Files/FileUploadReadOnly'
import { Button } from '@components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToggle } from '@hooks/useToggle'
import { IExpense } from '@interfaces/expense'
import { IFilterResponse, IFormFilters } from '@interfaces/filters'
import { getExpensesDraft } from '@services/expense'
import { createReport } from '@services/report'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'

export interface IFormCreateReport {
  name: string
  expenses: string[]
}

export const validationSchema = z.object({
  name: z.string().min(1, 'La Razón social es obligatoria.'),
  expenses: z.array(z.string()).min(1, 'Debe seleccionar al menos un gasto.')
})

const PageCreateReport = () => {
  const navigate = useNavigate()
  // const [filteredExpenses, setFilteredExpenses] = useState<IExpense[]>([])
  const [dataSelectedFile, setDataSelectedFile] = useState<string | undefined>(undefined)
  const [isOpenModalFile, openModalFile, closeModalFile] = useToggle()
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
    setValue
  } = useForm<IFormCreateReport>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: '',
      expenses: []
    },
    mode: 'onChange'
  })

  const initialValues: IFormFilters = {
    search: '',
    pageSize: '10',
    dateRange: null,
    pageIndex: 1
  }
  const {
    watch: watchFilter,
    control: controlFilter,
    handleSubmit: handleSubmitFilter,
    reset: resetFilter,
    setValue: setValueFilter
  } = useForm<IFormFilters>({
    defaultValues: initialValues
  })

  const { search, pageSize, pageIndex, dateRange } = watchFilter()

  const {
    data: dataExpenses,
    isPending: isLoadingExpenses,
    mutate: mutateExpenses
  } = useMutation<IFilterResponse<IExpense[]>, Error, IFormFilters>({
    mutationFn: getExpensesDraft,
    mutationKey: ['getExpensesDraft']
  })

  useEffect(() => {
    // Si cambia pageSize, reseteamos a la primera página
    if (pageSize !== initialValues.pageSize) {
      setValueFilter('pageIndex', 1)
    }

    mutateExpenses({
      search,
      pageSize,
      dateRange,
      pageIndex: pageSize !== initialValues.pageSize ? 1 : pageIndex
    })
  }, [pageSize, pageIndex])

  const queryClient = useQueryClient()
  const { mutate: mutateCreate, isPending: isPendingCreate } = useMutation({
    mutationFn: createReport,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      console.log({ message })
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getReports'] })
      navigate('/reports')
    }
  })

  const handleReset = () => {
    reset()
    resetFilter()
    mutateExpenses(initialValues)
  }

  const onSubmit = async (values: IFormCreateReport) => {
    mutateCreate(values)
  }

  const onSubmitFilter = async (values: IFormFilters) => {
    mutateExpenses(values)
  }

  const handleCreate = () => {
    handleSubmit(onSubmit)()
  }

  const { expenses } = watch()

  const handleSeletedForm = (expenses: string[]) => {
    setValue('expenses', expenses, { shouldValidate: true })
  }

  const { getHeaderGroups, getRowModel } = useReactTable({
    data: dataExpenses?.data ?? [],
    columns: columnsExpenseByReport({
      setDataSelectedFile,
      openModalFile,
      dataSelected: expenses,
      setDataSelected: handleSeletedForm,
      filteredExpenses: dataExpenses?.data ?? [],
      selection: true
    }),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true
  })

  const handleChangePageSize = (pageSize: string) => {
    setValueFilter('pageSize', pageSize)
  }

  const handleFirst = () => {
    setValueFilter('pageIndex', 1)
  }

  const handlePrevious = () => {
    setValueFilter('pageIndex', pageIndex - 1)
  }

  const handleNext = () => {
    setValueFilter('pageIndex', pageIndex + 1)
  }

  const handleLast = () => {
    setValueFilter('pageIndex', dataExpenses?.pagination.totalPages ?? 1)
  }

  return (
    <Show condition={isLoadingExpenses} loadingComponent={<Spinner />}>
      <form onSubmit={handleSubmitFilter(onSubmitFilter)} className="flex flex-col gap-5 py-2">
        <FormInput label="Nombre" name="name" control={control} placeholder="Nombre" className="w-96" />
        <div className="flex gap-2">
          <FormSearchInput name="search" control={controlFilter} placeholder="Buscar" className="w-96" />
          <Button type="submit" className="w-24">
            Buscar
          </Button>
          <Button type="button" className="w-24" color="red" onClick={handleReset}>
            Limpiar
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 hover:bg-gray-50">
              {getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody className="hover:bg-gray-50">
              {getRowModel().rows?.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="font-medium" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            total={dataExpenses?.pagination?.total ?? 0}
            pageIndex={pageIndex}
            totalPages={dataExpenses?.pagination.totalPages ?? 1}
            pageSize={pageSize}
            onChangePageSize={handleChangePageSize}
            onFirst={handleFirst}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onLast={handleLast}
          />
          <div className="flex flex-col items-end gap-3 mt-2">
            {errors.expenses?.message && <p className="text-sm text-red-500">{errors.expenses?.message}</p>}

            <Button type="button" className="w-48" onClick={handleCreate} disabled={isPendingCreate}>
              Crear Informe
            </Button>
          </div>
        </div>
      </form>

      <Modal isOpen={isOpenModalFile} onClose={closeModalFile}>
        <Card className="w-[500px] max-h-[95vh] overflow-hidden">
          <FileUploadReadOnly value={dataSelectedFile} />
        </Card>
      </Modal>
    </Show>
  )
}

export default PageCreateReport
