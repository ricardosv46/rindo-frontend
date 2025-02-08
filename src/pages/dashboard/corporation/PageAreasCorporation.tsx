import { columnsArea, ModalCreateArea, ModalUpdateArea } from '@components/corporation'
import { Show, Spinner } from '@components/shared'
import { useToggle } from '@hooks/useToggle'
import { IArea } from '@interfaces/area'
import {
  Fab,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
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
import { getAreas } from '@services/area'
import { getCompanies } from '@services/company'
import { useQuery } from '@tanstack/react-query'

import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { Plus, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

const PageAreasCorporation = () => {
  const [isOpenModalUpdate, openModalUpdate, closeModalUpdate] = useToggle()
  const [isOpenModalCreate, openModalCreate, closeModalCreate] = useToggle()

  const [dataSelected, setDataSelected] = useState<IArea | null>(null)
  const [filteredAreas, setFilteredAreas] = useState<IArea[]>([])
  const { watch, control } = useForm({
    defaultValues: {
      search: '',
      company: 'all'
    }
  })

  const {
    data: areas = [],
    isLoading: isLoadingAreas,
    isFetching: isFetchingAreas,
    refetch
  } = useQuery({
    queryKey: ['getAreas'],
    queryFn: getAreas
  })

  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['getCompanies'],
    queryFn: getCompanies
  })

  const { search, company } = watch()

  useEffect(() => {
    if (isFetchingAreas) return

    const newData = areas.filter((area) => {
      const companyMatch = company === 'all' || area.company?._id === company
      const searchMatch =
        area.name?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        area.company?.name?.toLowerCase().includes(search.toLocaleLowerCase())
      return companyMatch && searchMatch
    })

    setFilteredAreas(newData)
  }, [company, search, isFetchingAreas])

  const { getHeaderGroups, getRowModel, setPageSize, getRowCount, getState, setPageIndex } = useReactTable({
    data: filteredAreas,
    columns: columnsArea(setDataSelected, openModalUpdate, refetch),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <Show condition={isLoadingAreas || isLoadingCompanies} loadingComponent={<Spinner />}>
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

          <FormControl sx={{ minWidth: 120 }} size="small">
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
                  {companies.length === 0 && <MenuItem value={''}>No existen areas en esa empresa</MenuItem>}
                  {companies.map((i) => (
                    <MenuItem key={i._id} value={i._id}>
                      {i?.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </div>

        <Tooltip title="Crear Area">
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

      <ModalCreateArea {...{ isOpen: isOpenModalCreate, onClose: closeModalCreate, companies }} />
      <ModalUpdateArea {...{ isOpen: isOpenModalUpdate, onClose: closeModalUpdate, data: dataSelected }} />
    </Show>
  )
}

export default PageAreasCorporation
