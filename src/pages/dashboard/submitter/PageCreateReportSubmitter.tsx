import { columnsExpense } from '@components/corporation/expenses/table/columnsExpense'
import { columnsExpenseByReport } from '@components/corporation/expenses/table/columnsExpenseByReport'
import { Card, Modal, Show, Spinner } from '@components/shared'
import { FileUploadReadOnly } from '@components/shared/Files/FileUploadReadOnly'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToggle } from '@hooks/useToggle'
import { IExpense } from '@interfaces/expense'
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material'
import { getExpenses } from '@services/expense'
import { useQuery } from '@tanstack/react-query'
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { watch } from 'fs'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

export interface IFormCreateReport {
  name: string
  search: string
}

export const validationSchema = z.object({
  name: z.string().min(1, 'El Razón social es obligatoria.'),
  search: z.string().optional()
})

const PageCreateReportSubmitter = () => {
  const [filteredExpenses, setFilteredExpenses] = useState<IExpense[]>([])
  const [dataSelectedFile, setDataSelectedFile] = useState<string | undefined>(undefined)
  const [dataSelected, setDataSelected] = useState<IExpense[]>([])
  const [isOpenModalFile, openModalFile, closeModalFile] = useToggle()

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch
  } = useForm<IFormCreateReport>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: '',
      search: ''
    }
  })

  const {
    data: expenses = [],
    isLoading: isLoadingExpenses,
    isFetching: isFetchingExpenses,
    refetch
  } = useQuery({
    queryKey: ['getExpenses'],
    queryFn: getExpenses,
    retry: false,
    refetchOnWindowFocus: false
  })

  const onSubmit = async (values: IFormCreateReport) => {
    console.log({ values })
  }

  const { search } = watch()

  useEffect(() => {
    if (isFetchingExpenses) return

    if (search === '') {
      setFilteredExpenses(expenses)
      return
    }

    const newData = expenses.filter((expense) => {
      const searchMatch =
        expense.description?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        expense.companyName?.toLowerCase().includes(search.toLocaleLowerCase())
      return searchMatch
    })

    setFilteredExpenses(newData)
  }, [search, isFetchingExpenses])

  const { getHeaderGroups, getRowModel, setPageSize, getRowCount, getState, setPageIndex } = useReactTable({
    data: filteredExpenses,
    columns: columnsExpenseByReport(setDataSelectedFile, openModalFile, dataSelected, setDataSelected, filteredExpenses),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  console.log({ dataSelected })

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
        <TableContainer sx={{ width: 'calc(100% + 48px)', marginX: '-24px', pb: 3 }}>
          <div className="px-8">
            {dataSelected?.length} Seleccionado{dataSelected?.length > 1 ? 's' : ''}
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
                <TableRow hover key={row.id} selected={dataSelected.some((i) => i._id === row.getVisibleCells()[0].row.original._id)}>
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

        <Button type="submit" variant="contained">
          Crear
        </Button>
      </form>

      <Modal isOpen={isOpenModalFile} onClose={closeModalFile}>
        <Card className="w-[500px] max-h-[95vh] overflow-hidden">
          <FileUploadReadOnly value={dataSelectedFile} />
        </Card>
      </Modal>
    </Show>
  )
}

export default PageCreateReportSubmitter
