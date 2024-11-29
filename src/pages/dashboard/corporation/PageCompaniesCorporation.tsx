import { ModalCreateCompany, ModalDeleteCompany } from '@components/corporation'
import { columnsCompany } from '@components/corporation/companies/table/columnsCompany'
import { Show, Spinner } from '@components/shared'
import { useToggle } from '@hooks/useToggle'
import { ICompany } from '@interfaces/company'
import { IUser } from '@interfaces/user'
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
import { getCompanies } from '@services/company'
import { useQuery } from '@tanstack/react-query'

import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { Plus, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

const PageCompaniesCorporation = () => {
  const [isOpenModalCreate, openModalCreate, closeModalCreate] = useToggle()
  const [isOpenModalDelete, openModalDelete, closeModalDelete] = useToggle()

  const [dataSelected, setDataSelected] = useState<ICompany | null>(null)
  const [filteredCompanies, setFilteredCompanies] = useState<IUser[]>([])

  const { watch, control } = useForm({
    defaultValues: {
      search: ''
    }
  })

  const {
    data: companies = [],
    isLoading,
    isFetching: isFetchingCompanies
  } = useQuery({
    queryKey: ['getCompanies'],
    queryFn: getCompanies,
    retry: false,
    refetchOnWindowFocus: false
  })

  const { search } = watch()
  useEffect(() => {
    if (isFetchingCompanies) return

    const newData = companies.filter((companie) => {
      const searchMatch =
        companie.name?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        companie.ruc?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        companie.username?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        companie.token?.toLowerCase().includes(search.toLocaleLowerCase())

      return searchMatch
    })

    setFilteredCompanies(newData)
  }, [search, isFetchingCompanies])

  const { getHeaderGroups, getRowModel, setPageSize, getRowCount, getState, setPageIndex } = useReactTable({
    data: filteredCompanies,
    columns: columnsCompany(setDataSelected, openModalDelete),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <Show condition={isLoading} loadingComponent={<Spinner />}>
      <div className="flex justify-between">
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
        <Tooltip title="Crear Empresa">
          <Fab color="primary" onClick={openModalCreate} size="small" sx={{ boxShadow: 'none', width: 32, height: 32, minHeight: 32 }}>
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

      <ModalCreateCompany {...{ isOpen: isOpenModalCreate, onClose: closeModalCreate }} />
      <ModalDeleteCompany {...{ isOpen: isOpenModalDelete, onClose: closeModalDelete, data: dataSelected }} />
    </Show>
  )
}

export default PageCompaniesCorporation
