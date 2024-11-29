import { downloadFile } from '@/lib/utils'
import { ModalCreateUser, ModalDeleteUser, ModalUpdateUser, columnsUser } from '@components/corporation'
import { Show, Spinner } from '@components/shared'
import { useToggle } from '@hooks/useToggle'
import { IArea } from '@interfaces/area'
import { IUser } from '@interfaces/user'
import {
  Button,
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
import { createUserByExcel, downloadTemplateUser, getUsers } from '@services/user'
import { useMutation, useQuery } from '@tanstack/react-query'

import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { CloudDownload, CloudUploadIcon, Plus, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const PageUsersCorporation = () => {
  const [isOpenModalCreate, openModalCreate, closeModalCreate] = useToggle()
  const [isOpenModalDelete, openModalDelete, closeModalDelete] = useToggle()
  const [isOpenModalUpdate, openModalUpdate, closeModalUpdate] = useToggle()

  const [dataSelected, setDataSelected] = useState<IUser | null>(null)
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([])
  const [filteredAreas, setFilteredAreas] = useState<IArea[]>([])

  const { watch, control, setValue } = useForm({
    defaultValues: {
      search: '',
      role: 'all',
      company: 'all',
      area: 'all'
    }
  })

  const {
    data: users = [],
    isLoading,
    refetch: refetchUsers,
    isFetching: isFetchingUsers
  } = useQuery({
    queryKey: ['getUsers'],
    queryFn: getUsers,
    retry: false,
    refetchOnWindowFocus: false
  })

  const {
    data: areas = [],
    isLoading: isLoadingAreas,
    isFetching: isFetchingAreas,
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

  const { company, area, role, search } = watch()

  useEffect(() => {
    if (isFetchingAreas) return
    const all = company === 'all'
    setValue('area', 'all')

    const data = all ? areas : areas.filter((area) => watch().company === area?.company?._id)
    setFilteredAreas(data)
  }, [company, isFetchingAreas])

  useEffect(() => {
    if (isFetchingAreas && isFetchingUsers) return

    const newData = users.filter((user) => {
      const roleMatch = role === 'all' || user.role === role
      const companyMatch = company === 'all' || user.company?._id === company
      const areaMatch = area === 'all' || user.areas?.includes(area)
      const searchMatch =
        user.name?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        user.lastname?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        user.phone?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        user.document?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        user.company?.name?.toLowerCase().includes(search.toLocaleLowerCase())
      return roleMatch && companyMatch && areaMatch && searchMatch
    })

    setFilteredUsers(newData)
  }, [company, area, search, role, isFetchingAreas, isFetchingUsers])

  const { getHeaderGroups, getRowModel, setPageSize, getRowCount, getState, setPageIndex } = useReactTable({
    data: filteredUsers,
    columns: columnsUser(areas, setDataSelected, openModalUpdate, openModalDelete),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const { mutate: mutateCreateByExcel, isPending: isPendingCreateUsers } = useMutation({
    mutationFn: createUserByExcel,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message, success, data }) => {
      if (!success) {
        downloadFile(data, 'Usuarios Fallidos.xlsx')
        toast.error(message)
        refetchUsers()
      } else {
        toast.success(message)
        refetchUsers()
      }
    }
  })

  const openFileDialog = (): void => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xls,.xlsx'
    input.onchange = (e: Event): void => {
      const target = e.target as HTMLInputElement
      const files = target?.files
      if (files && files.length > 0) {
        mutateCreateByExcel({ file: files[0] })
      }
    }
    input.click()
  }

  const { mutate: mutateDownload, isPending: isPendingDownload } = useMutation({
    mutationFn: downloadTemplateUser,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async (blob) => {
      downloadFile(blob, 'TemplateUser.xlsx')
      toast.success('Archivo Descargado')
    }
  })

  return (
    <Show condition={isLoading || isLoadingAreas || isLoadingCompanies} loadingComponent={<Spinner />}>
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
            <InputLabel id="select-role-label">Rol</InputLabel>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="select-role-label"
                  id="select-company"
                  label="Empresa"
                  defaultValue="all"
                  MenuProps={{
                    disablePortal: true
                  }}>
                  <MenuItem value={'all'}>Todos</MenuItem>
                  <MenuItem value={'SUBMITTER'}>RENDIDOR</MenuItem>
                  <MenuItem value={'APPROVER'}>APROBADOR</MenuItem>
                  <MenuItem value={'GLOBAL_APPROVER'}>APROBADOR GLOBAL</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="select-area-label">Empresa</InputLabel>
            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="select-area-label"
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

        <div className="flex items-center gap-5">
          <Button
            variant="contained"
            startIcon={<CloudDownload />}
            onClick={() => mutateDownload()}
            disabled={isPendingDownload}
            className="relative">
            Descargar Pantilla
          </Button>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={openFileDialog}
            disabled={isPendingCreateUsers}
            className="relative">
            Subir archivo
          </Button>
          <Tooltip title="Crear Usuario">
            <Fab color="primary" onClick={openModalCreate} size="small" sx={{ boxShadow: 'none', width: 32, height: 32, minHeight: 32 }}>
              <Plus className="w-5 h-5" />
            </Fab>
          </Tooltip>
        </div>
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
      <ModalUpdateUser {...{ isOpen: isOpenModalUpdate, onClose: closeModalUpdate, data: dataSelected, companies, areas }} />
      <ModalDeleteUser {...{ isOpen: isOpenModalDelete, onClose: closeModalDelete, data: dataSelected }} />
    </Show>
  )
}

export default PageUsersCorporation
