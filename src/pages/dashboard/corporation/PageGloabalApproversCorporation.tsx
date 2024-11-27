import { ModalCreateGlobalApprover, ModalDeleteGlobalApprover, ModalUpdateGlobalApprover } from '@components/corporation'
import { Chip, Show, Spinner } from '@components/shared'
import { useToggle } from '@hooks/useToggle'
import { IUser } from '@interfaces/user'
import {
  Button,
  Fab,
  IconButton,
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
import { getGlobalApprovers } from '@services/user'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Plus, SearchIcon } from 'lucide-react'
import { useState } from 'react'

const PageGloabalApproversCorporation = () => {
  const [isOpenModalCreate, openModalCreate, closeModalCreate] = useToggle()
  const [isOpenModalDelete, openModalDelete, closeModalDelete] = useToggle()
  const [isOpenModalUpdate, openModalUpdate, closeModalUpdate] = useToggle()

  const [dataSelected, setDataSelected] = useState<IUser | null>(null)
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['getGlobalApprovers'],
    queryFn: getGlobalApprovers,
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
    columnHelper.accessor('role', {
      header: 'Rol',
      cell: (info) => <Chip label={info.getValue()!} color="blue" />
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
          setDataSelected(data)
          openModalUpdate()
        }

        const handleDelete = () => {
          setDataSelected(data)
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

  const [globalFilter, setGlobalFilter] = useState('')
  const { getHeaderGroups, getRowModel, setPageSize, getRowCount, getState, setPageIndex } = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter: globalFilter
    },
    onGlobalFilterChange: setGlobalFilter
  })

  return (
    <Show condition={isLoading} loadingComponent={<Spinner />}>
      <div className="flex justify-between">
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
        <Tooltip title="Crear Usuario">
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

      <ModalCreateGlobalApprover {...{ isOpen: isOpenModalCreate, onClose: closeModalCreate }} />
      <ModalUpdateGlobalApprover {...{ isOpen: isOpenModalUpdate, onClose: closeModalUpdate, data: dataSelected }} />
      <ModalDeleteGlobalApprover {...{ isOpen: isOpenModalDelete, onClose: closeModalDelete, data: dataSelected }} />
    </Show>
  )
}

export default PageGloabalApproversCorporation