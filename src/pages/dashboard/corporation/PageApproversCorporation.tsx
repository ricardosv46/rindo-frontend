import { columnsApprover, ModalAddApprover, ModalDeleteApprover } from '@components/corporation'
import { Show, Spinner } from '@components/shared'
import { useToggle } from '@hooks/useToggle'
import { IArea } from '@interfaces/area'
import { IUser } from '@interfaces/user'
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
import { getApprovers } from '@services/user'
import { useQuery } from '@tanstack/react-query'

import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { Plus, SearchIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

const PageApproversCorporation = () => {
  const [isOpenModalAdd, openModalAdd, closeModalAdd] = useToggle()
  const [isOpenModalDelete, openModalDelete, closeModalDelete] = useToggle()

  const [dataSelected, setDataSelected] = useState<IUser | null>(null)
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([])
  const [filteredAreas, setFilteredAreas] = useState<IArea[]>([])

  const { watch, control, setValue } = useForm({
    defaultValues: {
      search: '',
      company: 'all',
      area: 'all'
    }
  })

  const {
    data: users = [],
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers
  } = useQuery({
    queryKey: ['getApprovers'],
    queryFn: getApprovers
  })

  const {
    data: areas = [],
    isLoading: isLoadingAreas,
    isFetching: isFetchingAreas
  } = useQuery({
    queryKey: ['getAreas'],
    queryFn: getAreas
  })

  const {
    data: companies = [],
    isLoading: isLoadingCompanies,
    isFetched: isFetchedCompanies
  } = useQuery({
    queryKey: ['getCompanies'],
    queryFn: getCompanies
  })

  const { company, area, search } = watch()

  useEffect(() => {
    if (isFetchingAreas) return
    const all = company === 'all'
    setValue('area', 'all')

    const data = all ? areas : areas.filter((area) => watch().company === area?.company?._id)
    setFilteredAreas(data)
  }, [company, isFetchingAreas])

  useEffect(() => {
    if (isFetchingAreas && isFetchingUsers) return

    const areaUsed = areas.find((i) => i?._id === area)
    const approvers = areaUsed?.approvers?.map((i) => i.approver)
    const areaMatch = area === 'all'

    const newData = users.filter((user) => {
      const globalApprover = user.role === 'GLOBAL_APPROVER'
      const companyMatch = company === 'all' || user.company?._id === company || globalApprover
      const userMatch = areaMatch ? true : approvers?.includes(user?._id)
      const searchMatch =
        user.name?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        user.lastname?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        user.phone?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        user.document?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        user.company?.name?.toLowerCase().includes(search.toLocaleLowerCase())
      return companyMatch && userMatch && searchMatch
    })

    const dataOrdered = areaMatch ? newData : newData.sort((a, b) => approvers?.indexOf(a?._id!)! - approvers?.indexOf(b?._id!)!)

    setFilteredUsers(dataOrdered)
  }, [company, area, search, isFetchingAreas, isFetchingUsers])

  const { getHeaderGroups, getRowModel, setPageSize, getRowCount, getState, setPageIndex } = useReactTable({
    data: filteredUsers,
    columns: columnsApprover(areas, setDataSelected, openModalDelete, area),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <Show condition={isLoadingUsers || isLoadingAreas || isLoadingCompanies} loadingComponent={<Spinner />}>
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
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="select-company-label">Area</InputLabel>
            <Controller
              name="area"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="select-company-label"
                  id="select-company"
                  label="Empresa"
                  defaultValue=""
                  disabled={company === 'all'}
                  MenuProps={{
                    disablePortal: true
                  }}>
                  {filteredAreas.length > 0 && <MenuItem value={'all'}>Todos</MenuItem>}
                  {filteredAreas.length === 0 && <MenuItem value={''}>No existen areas en esa empresa</MenuItem>}
                  {filteredAreas.map((i) => (
                    <MenuItem key={i._id} value={i._id}>
                      {i?.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </div>

        <Tooltip title="Agregar Aprobador">
          <span>
            <Fab
              color="primary"
              disabled={area === 'all'}
              onClick={openModalAdd}
              size="small"
              sx={{ boxShadow: 'none', width: 32, height: 32, minHeight: 32 }}>
              <Plus className="w-5 h-5" />
            </Fab>
          </span>
        </Tooltip>
      </div>
      <TableContainer sx={{ width: 'calc(100% + 48px)', marginX: '-24px', pb: 3 }}>
        <Table className="min-w-[1600px]">
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

      <ModalAddApprover
        {...{
          isOpen: isOpenModalAdd,
          onClose: closeModalAdd,
          company: watch()?.company,
          area: watch()?.area,
          users,
          areas
        }}
      />
      <ModalDeleteApprover
        {...{
          isOpen: isOpenModalDelete,
          onClose: closeModalDelete,
          data: dataSelected,
          area: watch()?.area
        }}
      />
    </Show>
  )
}

export default PageApproversCorporation
