// import { columnsExpenses, ModalCreateExpenses, ModalUpdateExpenses } from '@components/corporation'
import { Card, FileUpload, Modal, Show, Spinner } from '@components/shared'
import { useToggle } from '@hooks/useToggle'
import { IExpense } from '@interfaces/expense'
import {
  Fab,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip
} from '@mui/material'
import { getExpenses } from '@services/expense'
import { useQuery } from '@tanstack/react-query'

import { columnsExpense } from '@components/corporation/expenses/table/columnsExpense'
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { Plus, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FileUploadReadOnly } from '@components/shared/Files/FileUploadReadOnly'
import { ModalDeleteExpense } from '@components/corporation/expenses/modals/ModalDeleteExpense'

const PageExpensesSubmitter = () => {
  const [isOpenModalFile, openModalFile, closeModalFile] = useToggle()
  const [isOpenModalDelete, openModalDelete, closeModalDelete] = useToggle()
  const [dataSelected, setDataSelected] = useState<IExpense | null>(null)
  const [dataSelectedFile, setDataSelectedFile] = useState<string | undefined>(undefined)
  const [filteredExpenses, setFilteredExpenses] = useState<IExpense[]>([])
  const navigate = useNavigate()
  const { watch, control } = useForm({
    defaultValues: {
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
    queryFn: getExpenses
  })

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
    columns: columnsExpense(setDataSelectedFile, setDataSelected, openModalFile, openModalDelete),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const handleCreate = () => {
    navigate('/create-expense')
  }

  return (
    <Show condition={isLoadingExpenses} loadingComponent={<Spinner />}>
      <div className="flex justify-between">
        <div className="flex gap-5">
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

          {/* <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="select-company-label">Empresa</InputLabel>
            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="select-company-label"
                  id="select-company"
                  label="Empresa"
                  defaultValue="all"
                  MenuProps={{
                    disablePortal: true
                  }}>
                  {companies.length > 0 && <MenuItem value={'all'}>Todos</MenuItem>}
                  {companies.length === 0 && <MenuItem value={''}>No existen Expensess en esa empresa</MenuItem>}
                  {companies.map((i) => (
                    <MenuItem key={i._id} value={i._id}>
                      {i?.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl> */}
        </div>

        <Tooltip title="Crear Gasto">
          <Fab color="primary" onClick={handleCreate} size="small" sx={{ boxShadow: 'none', width: 32, height: 32, minHeight: 32 }}>
            <Plus className="w-5 h-5" />
          </Fab>
        </Tooltip>
      </div>
      <TableContainer sx={{ width: 'calc(100% + 48px)', marginX: '-24px', pb: 3 }}>
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
              <TableRow hover key={row.id}>
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
      <Modal isOpen={isOpenModalFile} onClose={closeModalFile}>
        <Card className="w-[500px] max-h-[95vh] overflow-hidden">
          <FileUploadReadOnly value={dataSelectedFile} />
        </Card>
      </Modal>

      <ModalDeleteExpense
        {...{
          isOpen: isOpenModalDelete,
          onClose: closeModalDelete,
          data: dataSelected
        }}
      />
    </Show>
  )
}

export default PageExpensesSubmitter
