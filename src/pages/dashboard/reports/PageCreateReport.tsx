import { columnsExpenseByReport } from '@components/corporation/reports/table/columnsExpenseByReport'
import { Card, Modal, Show, Spinner } from '@components/shared'
import { FileUploadReadOnly } from '@components/shared/Files/FileUploadReadOnly'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToggle } from '@hooks/useToggle'
import { IExpense } from '@interfaces/expense'
import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from '@mui/material'
import { getExpenses } from '@services/expense'
import { createReport } from '@services/report'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'

export interface IFormCreateReport {
  name: string
  search: string
  expenses: string[]
}

export const validationSchema = z.object({
  name: z.string().min(1, 'El Razón social es obligatoria.'),
  search: z.string().optional(),
  expenses: z.array(z.string()).min(1, 'Debe seleccionar al menos un gasto.')
})

const PageCreateReport = () => {
  const navigate = useNavigate()
  const [filteredExpenses, setFilteredExpenses] = useState<IExpense[]>([])
  const [dataSelectedFile, setDataSelectedFile] = useState<string | undefined>(undefined)
  const [isOpenModalFile, openModalFile, closeModalFile] = useToggle()
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue
  } = useForm<IFormCreateReport>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: '',
      search: '',
      expenses: []
    },
    mode: 'onChange'
  })

  const getExpensesDraft = async () => {
    try {
      const data = await getExpenses()
      const expnesesDraft = data?.filter((i) => i?.status === 'DRAFT')
      return expnesesDraft
    } catch (error) {
      throw error
    }
  }

  const {
    data: dataeExpenses = [],
    isLoading: isLoadingExpenses,
    isFetching: isFetchingExpenses,
    refetch
  } = useQuery({
    queryKey: ['getExpenses'],
    queryFn: getExpensesDraft
  })

  const queryClient = useQueryClient()
  const { mutate: mutateCreate, isPending: isPendingCreate } = useMutation({
    mutationFn: createReport,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getReports'] })
      navigate('/reports')
    }
  })

  const onSubmit = async (values: IFormCreateReport) => {
    const { search, ...props } = values
    mutateCreate(props)
  }

  const { search, expenses } = watch()

  useEffect(() => {
    if (isFetchingExpenses) return

    if (search === '') {
      setFilteredExpenses(dataeExpenses)
      return
    }

    const newData = dataeExpenses.filter((expense) => {
      const searchMatch =
        expense.description?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        expense.companyName?.toLowerCase().includes(search.toLocaleLowerCase())
      return searchMatch
    })

    setFilteredExpenses(newData)
  }, [search, isFetchingExpenses])

  const handleSeletedForm = (expenses: string[]) => {
    setValue('expenses', expenses, { shouldValidate: true })
  }

  const { getHeaderGroups, getRowModel, setPageSize, getRowCount, getState, setPageIndex } = useReactTable({
    data: filteredExpenses,
    columns: columnsExpenseByReport({
      setDataSelectedFile,
      openModalFile,
      dataSelected: expenses,
      setDataSelected: handleSeletedForm,
      filteredExpenses
    }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <Show condition={isLoadingExpenses} loadingComponent={<Spinner />}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 py-2">
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
