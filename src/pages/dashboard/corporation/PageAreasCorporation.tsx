import { ModalCreateArea, ModalUpdateArea } from '@components/corporation'
import { Show, Spinner } from '@components/shared'
import { useToggle } from '@hooks/useToggle'
import { IArea } from '@interfaces/area'
import {
  Fab,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
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
import { getAreas, updateArea } from '@services/area'
import { getCompanies } from '@services/company'
import { IconEdit } from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'

import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Plus, SearchIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

const PageAreasCorporation = () => {
  const [isOpenModalUpdate, openModalUpdate, closeModalUpdate] = useToggle()
  const [isOpenModalCreate, openModalCreate, closeModalCreate] = useToggle()

  const [dataSelected, setDataSelected] = useState<IArea | null>(null)
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

  const columnHelper = createColumnHelper<IArea>()

  const columns = [
    {
      header: 'ID',
      id: 'id',
      cell: (info: any) => info.row.index + 1
    },
    columnHelper.accessor('name', {
      header: 'Nombre',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('company', {
      header: 'Empresa',
      cell: (info) => info.getValue()?.name,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true
        const company = row.getValue(columnId) as { _id: string }
        return company?._id === filterValue
      },
      enableColumnFilter: true
    }),
    columnHelper.accessor('status', {
      header: 'Estado',
      cell: (info) => {
        const data = info.row.original

        const { mutate: mutateUpdate, isPending } = useMutation({
          mutationFn: updateArea,
          onError: (error: string) => {
            toast.error(error)
          },
          onSuccess: async ({ message }) => {
            toast.success(message)
            refetch()
          }
        })

        const handleUpdate = async (e: any) => {
          mutateUpdate({ status: e.target.checked, id: data?._id })
        }

        return <Switch title="Cambiar estado" color="primary" disabled={isPending} checked={info.getValue()} onChange={handleUpdate} />
      }
    }),

    {
      header: 'Nro de aprobadores',
      id: 'approvers',
      cell: (info: any) => info.row.original.approvers.length
    },

    {
      header: 'Acción',
      id: 'accion',
      cell: (info: any) => {
        const data = info.row.original

        const handleUpdate = () => {
          setDataSelected(data)
          openModalUpdate()
        }

        return (
          <div className="flex gap-5">
            <IconButton onClick={handleUpdate}>
              <IconEdit className="text-primary-600" />
            </IconButton>
          </div>
        )
      }
    }
  ]

  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const { getHeaderGroups, getRowModel, setPageSize, getRowCount, getState, setPageIndex } = useReactTable({
    data: areas,
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

  return (
    <Show condition={isLoadingAreas || isLoadingCompanies} loadingComponent={<Spinner />}>
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
            <InputLabel id="select-company">Empresa</InputLabel>
            <Select
              labelId="select-company-label"
              id="select-company"
              label="Empresa"
              value={columnFilters.find((filter) => filter.id === 'company')?.value || 'all'}
              onChange={(e) => setColumnFilters([{ id: 'company', value: e.target.value === 'all' ? '' : e.target.value }])}>
              <MenuItem value={'all'}>Todos</MenuItem>
              {companies.map((i) => (
                <MenuItem key={i._id} value={i._id}>
                  {i?.name}
                </MenuItem>
              ))}
            </Select>
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
