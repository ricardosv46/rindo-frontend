import { ROLES } from '@/lib/utils'
import { ModalCreateUser, ModalDeleteUser, ModalUpdateUser } from '@components/corporation'
import { Chip, Show, Spinner } from '@components/shared'
import { useToggle } from '@hooks/useToggle'
import { IUser } from '@interfaces/user'
import {
  Fab,
  FormControl,
  IconButton,
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
import { getUsers } from '@services/user'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { EyeIcon, Plus, SearchIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

const PageUsersCorporation = () => {
  const [isOpenModalCreate, openModalCreate, closeModalCreate] = useToggle()
  const [isOpenModalDelete, openModalDelete, closeModalDelete] = useToggle()
  const [isOpenModalUpdate, openModalUpdate, closeModalUpdate] = useToggle()

  const [userSelected, setUserSelected] = useState<IUser | null>(null)
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['getUsers'],
    queryFn: getUsers,
    retry: false,
    refetchOnWindowFocus: false
  })

  const {
    data: areas = [],
    isLoading: isLoadingAreas,
    refetch
  } = useQuery({
    queryKey: ['getAreas'],
    queryFn: getAreas,
    retry: false,
    refetchOnWindowFocus: false
  })

  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['getCompanies'],
    queryFn: getCompanies,
    retry: false,
    refetchOnWindowFocus: false
  })

  const columnHelper = createColumnHelper<IUser>()

  const columns = [
    {
      header: 'ID',
      id: 'index',
      cell: (info: any) => info.row.index + 1
    },
    columnHelper.accessor('name', {
      header: 'Nombre',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('lastname', {
      header: 'Apellido',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('email', {
      header: 'Correo',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('phone', {
      header: 'Celular',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('document', {
      header: 'Documento',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('company', {
      header: 'Empresa',
      cell: (info) => info.getValue()?.name ?? 'Todas',
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true
        const company = row.getValue(columnId) as { _id: string }
        return company?._id === filterValue
      },
      enableColumnFilter: true
    }),
    columnHelper.accessor('areas', {
      header: 'Areas',
      cell: (info) => {
        const [isOpenAreas, openModalAreas, closeModalAreas] = useToggle()

        const data = info.row.original

        let name = ''
        if (data?.role === 'SUBMITTER') name = areas.filter((i) => i._id === info.getValue()?.[0])[0]?.name ?? ''

        if (data?.role === 'APPROVER')
          name = info?.getValue()?.length === 1 ? areas.filter((i) => i._id === info.getValue()?.[0])[0]?.name ?? '' : ''

        if (data?.role === 'GLOBAL_APPROVER') name = '-'

        const dropdownRef = useRef<HTMLDivElement>(null)

        useEffect(() => {
          function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
              closeModalAreas()
            }
          }

          document.addEventListener('mousedown', handleClickOutside)
          return () => {
            document.removeEventListener('mousedown', handleClickOutside)
          }
        }, [])

        return (
          <div className="relative flex items-center gap-1" ref={dropdownRef}>
            {name}
            {data?.role === 'APPROVER' && name === '' && (
              <IconButton onClick={openModalAreas}>
                <EyeIcon className="text-primary-600" />
              </IconButton>
            )}

            <div
              className={`z-[9999] absolute right-0 mt-2 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-in-out transform origin-top-right ${
                isOpenAreas ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
              }`}>
              <div className="p-2 ">
                {areas
                  .filter((i) => info.getValue()?.includes(i?._id!))
                  .map((i) => (
                    <p>{i?.name}</p>
                  ))}
              </div>
            </div>
          </div>
        )
      },
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true
        const areas = row.getValue(columnId) as string[]
        return areas?.includes(filterValue)
      },
      enableColumnFilter: true
    }),
    columnHelper.accessor('role', {
      header: 'Rol',
      cell: (info) => (
        <Chip
          label={ROLES[info.getValue()!]}
          color={info.getValue() === 'APPROVER' ? 'blue' : info.getValue() === 'GLOBAL_APPROVER' ? 'purple' : 'yellow'}
        />
      ),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true
        const role = row.getValue(columnId)
        return role === filterValue
      },
      enableColumnFilter: true
    }),
    columnHelper.accessor('verify_email', {
      header: 'Confirmado',
      cell: (info) => (
        <>
          {info.getValue() && <Chip label="Si" color="green" />}
          {!info.getValue() && <Chip label="No" color="red" />}
        </>
      )
    }),
    {
      header: 'Acción',
      id: 'accion',
      cell: (info: any) => {
        const data = info.row.original

        const handleUpdate = () => {
          setUserSelected(data)
          openModalUpdate()
        }

        const handleDelete = () => {
          setUserSelected(data)
          openModalDelete()
        }

        return (
          <div className="flex gap-5">
            <IconButton onClick={handleUpdate}>
              <IconEdit className="text-primary-600" />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <IconTrash className="text-primary-600" />
            </IconButton>
          </div>
        )
      }
    }
  ]

  const handleFilterChange = (id: string, value: string) => {
    setColumnFilters((prevFilters) => {
      const existingFilter = prevFilters.find((filter) => filter.id === id)
      if (existingFilter) {
        return prevFilters.map((filter) => (filter.id === id ? { ...filter, value } : filter))
      } else {
        return [...prevFilters, { id, value }]
      }
    })
  }

  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const { getHeaderGroups, getRowModel, setPageSize, getRowCount, getState, setPageIndex } = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter: globalFilter,
      columnFilters: columnFilters
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters
  })

  const filteredAreas = useMemo(() => {
    const selected = columnFilters.find((filter) => filter.id === 'company')?.value

    const data = selected ? areas.filter((area) => selected === area?.company?._id) : areas
    return data
  }, [columnFilters])

  return (
    <Show condition={isLoading || isLoadingAreas || isLoadingCompanies} loadingComponent={<Spinner />}>
      <div className="flex justify-between">
        <div className="flex gap-5">
          <TextField
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            size="small"
            sx={{ pb: 3 }}
            name="Buscar"
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
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="select-rol">Rol</InputLabel>
            <Select
              labelId="select-rol-label"
              id="select-rol"
              label="Rol"
              value={columnFilters.find((filter) => filter.id === 'role')?.value || 'all'}
              onChange={(e) => {
                const roleId = e.target.value as string
                handleFilterChange('role', roleId === 'all' ? '' : roleId)
              }}>
              <MenuItem value={'all'}>Todos</MenuItem>
              <MenuItem value={'SUBMITTER'}>RENDIDOR</MenuItem>
              <MenuItem value={'APPROVER'}>APROBADOR</MenuItem>
              <MenuItem value={'GLOBAL_APPROVER'}>APROBADOR GLOBAL</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="select-company">Empresa</InputLabel>
            <Select
              labelId="select-company-label"
              id="select-company"
              label="Empresa"
              value={columnFilters.find((filter) => filter.id === 'company')?.value || 'all'}
              onChange={(e) => {
                const companyId = e.target.value as string
                handleFilterChange('company', companyId === 'all' ? '' : companyId)
              }}>
              <MenuItem value={'all'}>Todos</MenuItem>
              {companies.map((i) => (
                <MenuItem key={i._id} value={i._id}>
                  {i?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="select-company">Area</InputLabel>
            <Select
              labelId="select-company-label"
              id="select-company"
              label="Area"
              disabled={!columnFilters.find((filter) => filter.id === 'company')?.value}
              value={columnFilters.find((filter) => filter.id === 'areas')?.value || 'all'}
              onChange={(e) => {
                const areaId = e.target.value as string
                handleFilterChange('areas', areaId === 'all' ? '' : areaId)
              }}>
              {filteredAreas.length > 0 && <MenuItem value={'all'}>Todos</MenuItem>}
              {filteredAreas.length === 0 && <MenuItem value={''}>No existen areas en esa empresa</MenuItem>}
              {filteredAreas.map((i) => (
                <MenuItem key={i._id} value={i._id}>
                  {i?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <Tooltip title="Crear Usuario">
          <Fab color="primary" onClick={openModalCreate} size="small" sx={{ boxShadow: 'none', width: 32, height: 32, minHeight: 32 }}>
            <Plus className="w-5 h-5" />
          </Fab>
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

      <ModalCreateUser {...{ isOpen: isOpenModalCreate, onClose: closeModalCreate, companies, areas }} />
      <ModalUpdateUser {...{ isOpen: isOpenModalUpdate, onClose: closeModalUpdate, data: userSelected, companies, areas }} />
      <ModalDeleteUser {...{ isOpen: isOpenModalDelete, onClose: closeModalDelete, data: userSelected }} />
    </Show>
  )
}

export default PageUsersCorporation
