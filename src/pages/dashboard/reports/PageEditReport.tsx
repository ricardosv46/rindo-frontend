import { FormInput } from '@components/shared/Forms/FormInput'
import { FormSearchInput } from '@components/shared/Forms/FormSearchInput'
import { TablePagination } from '@components/shared/TablePagination/TablePagination'
import { columnsExpenseByReport } from '@components/corporation'
import { Card, Modal, Show, Spinner } from '@components/shared'
import { FileUploadReadOnly } from '@components/shared/Files/FileUploadReadOnly'
import { Button } from '@components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToggle } from '@hooks/useToggle'
import { IExpense } from '@interfaces/expense'
import { IFilterResponse, IFormFilters } from '@interfaces/filters'
import { IReport } from '@interfaces/report'

import { getExpenses, getExpensesByReportDraft } from '@services/expense'
import { editReport, getReport } from '@services/report'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'

export interface IFormCreateReport {
  name: string
  expenses: string[]
}

export const validationSchema = z.object({
  name: z.string().min(1, 'El Razón social es obligatoria.'),
  expenses: z.array(z.string()).min(1, 'Debe seleccionar al menos un gasto.')
})

const PageEditReport = () => {
  const navigate = useNavigate()
  const [filteredExpenses, setFilteredExpenses] = useState<IExpense[]>([])
  const [dataSelectedFile, setDataSelectedFile] = useState<string | undefined>(undefined)
  const [isOpenModalFile, openModalFile, closeModalFile] = useToggle()
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<IFormCreateReport>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: '',
      expenses: []
    },
    mode: 'onChange'
  })
  const { expenses } = watch()

  const { id } = useParams()

  const getReportData = async () => {
    try {
      const data = await getReport({ id: id! })
      setValue('name', data?.name!)
      setValue('expenses', data?.expenses!)
      return data
    } catch (error) {
      throw error
    }
  }

  const {
    data: report = {} as IReport,
    isFetching: isFetchingReport,
    refetch: refetchReport
  } = useQuery({
    queryKey: ['getReport', id],
    queryFn: getReportData,
    enabled: !!id
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

  const getExpensesDraft = async (props: IFormFilters) => {
    try {
      const data = await getExpensesByReportDraft(id!, props)
      return data
    } catch (error) {
      throw error
    }
  }

  const {
    data: dataExpenses,
    isPending: isLoadingExpenses,
    mutate: mutateExpenses
  } = useMutation<IFilterResponse<IExpense[]>, Error, IFormFilters>({
    mutationFn: getExpensesDraft,
    mutationKey: ['getExpensesReportDraft']
  })

  // const {
  //   data: dataeExpenses = [],
  //   isLoading: isLoadingExpenses,
  //   isFetching: isFetchingExpenses,
  //   refetch
  // } = useQuery({
  //   queryKey: ['getExpenses'],
  //   queryFn: getExpensesDraft,
  //   enabled: !isFetchingReport && expenses?.length > 0
  // })

  const queryClient = useQueryClient()
  const { mutate: mutateEdit, isPending: isPendingEdit } = useMutation({
    mutationFn: editReport,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getReports'] })
      navigate('/reports')
    }
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

  const handleReset = () => {
    reset()
    resetFilter()
    mutateExpenses(initialValues)
  }

  const onSubmit = async (values: IFormCreateReport) => {
    mutateEdit({ ...values, id: report._id })
  }

  const onSubmitFilter = async (values: IFormFilters) => {
    mutateExpenses(values)
  }

  const handleEdit = () => {
    handleSubmit(onSubmit)()
  }

  const handleSeletedForm = (expenses: string[]) => {
    setValue('expenses', expenses, { shouldValidate: true })
  }

  const { getHeaderGroups, getRowModel, setPageSize, getRowCount, getState, setPageIndex } = useReactTable({
    data: dataExpenses?.data ?? [],
    columns: columnsExpenseByReport({
      setDataSelectedFile,
      openModalFile,
      dataSelected: expenses,
      setDataSelected: handleSeletedForm,
      filteredExpenses,
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
    <Show condition={isLoadingExpenses || isFetchingReport} loadingComponent={<Spinner />}>
      {/* <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 py-2">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              color="primary"
              type="text"
              label="Nombre"
              size="small"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />
        <div className="mt-5">
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                sx={{ pb: 3 }}
                placeholder="Buscar"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }
                }}
              />
            )}
          />
          <TableContainer sx={{ width: 'calc(100% + 48px)', marginX: '-24px', pb: 3 }}>
            <div className="px-8">
              {expenses?.length} Seleccionado{expenses?.length > 1 ? 's' : ''}
            </div>
            <Table sx={{ minWidth: 750 }} aria-label="customized table">
              <TableHead>
                {getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell key={header.id} component="th">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {getRowModel().rows?.map((row) => (
                  <TableRow hover key={row.id} selected={expenses.some((i) => i === row.getVisibleCells()[0].row.original._id)}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} component="td" scope="row">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
            rowsPerPageOptions={[3, 5, 10]}
            component="div"
            count={getRowCount()}
            rowsPerPage={getState().pagination.pageSize}
            page={getState().pagination.pageIndex}
            onPageChange={(e, newPage) => setPageIndex(newPage)}
            onRowsPerPageChange={(e) => setPageSize(Number(e.target.value))}
          />
          <div className="flex flex-col items-end gap-3 mt-2">
            <FormControl error={!!errors.expenses?.message}>
              {errors.expenses?.message && <FormHelperText>{errors.expenses?.message}</FormHelperText>}
            </FormControl>

            <Button className="" type="submit" variant="contained" disabled={isPendingCreate}>
              Actualizar Informe
            </Button>
          </div>
        </div>
      </form> */}

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

            <Button type="button" className="w-48" onClick={handleEdit} disabled={isPendingEdit}>
              Actualizar Informe
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

export default PageEditReport
