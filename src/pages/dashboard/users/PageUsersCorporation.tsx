import { downloadFile } from '@/lib/utils'
import { ModalCreateUser, ModalDeleteUser, ModalUpdateUser, columnsUser } from '@components/corporation'
import { FormSearchInput, FormSelect, Show, Spinner, TablePagination } from '@components/shared'
import { Option } from '@components/shared/Forms/FormSelect'
import { Button } from '@components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { useToggle } from '@hooks/useToggle'
import { IArea } from '@interfaces/area'
import { IUser } from '@interfaces/user'

import { getAreas } from '@services/area'
import { getCompanies } from '@services/company'
import { createUserByExcel, downloadTemplateUser, getUsers } from '@services/user'
import { IconFileExcel } from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { Plus, UploadCloud } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

interface IFormFilterUsers {
  search: string
  role: string
  company: string
  area: string
}

const ROLES = [
  { label: 'Todos', value: 'all' },
  { label: 'RENDIDOR', value: 'SUBMITTER' },
  { label: 'APROBADOR', value: 'APPROVER' },
  { label: 'APROBADOR GLOBAL', value: 'GLOBAL_APPROVER' }
]

const PageUsersCorporation = () => {
  // const [filteredData, setFilteredData] = useState<IUser[]>([])
  const [isOpenModalCreate, openModalCreate, closeModalCreate] = useToggle()
  const [isOpenModalDelete, openModalDelete, closeModalDelete] = useToggle()
  const [isOpenModalUpdate, openModalUpdate, closeModalUpdate] = useToggle()

  const [dataSelected, setDataSelected] = useState<IUser | null>(null)
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([])
  const [filteredAreas, setFilteredAreas] = useState<IArea[]>([])
  const initialValues = {
    search: '',
    role: 'all',
    company: 'all',
    area: ''
  }
  const { watch, control, setValue, handleSubmit, reset } = useForm<IFormFilterUsers>({
    defaultValues: initialValues
  })

  const {
    data: users = [],
    isLoading,
    refetch: refetchUsers,
    isFetching: isFetchingUsers
  } = useQuery({
    queryKey: ['getUsers'],
    queryFn: getUsers
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

  const { company, area, role, search } = watch()

  useEffect(() => {
    if (isFetchingAreas) return
    const all = company === 'all'
    setValue('area', 'all')

    const data = all ? areas : areas.filter((area) => watch().company === area?.company?._id)
    setFilteredAreas(data)
  }, [company, isFetchingAreas])

  // useEffect(() => {

  const usersFiltered = () => {
    if (isFetchingAreas && isFetchingUsers) return []

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

    return newData
  }

  const {
    getHeaderGroups,
    getRowModel,
    setPageSize,
    getRowCount,
    getState,
    setPageIndex,
    firstPage,
    lastPage,
    nextPage,
    previousPage,
    getPageCount
  } = useReactTable({
    data: filteredUsers,
    columns: columnsUser(areas, setDataSelected, openModalUpdate, openModalDelete),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const onSubmit = () => {
    setFilteredUsers(usersFiltered())
  }

  useEffect(() => {
    if (isFetchingUsers) return
    setFilteredUsers(users)
  }, [isFetchingUsers])

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

  const handleChangePageSize = (value: string) => {
    setPageSize(Number(value))
  }

  const onClearFilter = () => {
    setFilteredUsers(users || [])
    reset(initialValues)
  }

  const valuesCompanies: Option[] = useMemo(() => {
    const data = companies.map((i) => ({ label: i.name, value: i._id }))
    const initial = companies.length > 0 ? { label: 'Todos', value: 'all' } : { label: 'No existen empresas', value: '-' }
    return [initial, ...data] as Option[]
  }, [companies])

  const valuesAreas: Option[] = useMemo(() => {
    const data = filteredAreas.map((i) => ({ label: i.name, value: i._id }))
    const initial = filteredAreas.length > 0 ? { label: 'Todos', value: 'all' } : { label: 'No existen areas en esa empresa', value: '-' }
    return [initial, ...data] as Option[]
  }, [filteredAreas])

  return (
    <Show condition={isLoading || isLoadingAreas || isLoadingCompanies} loadingComponent={<Spinner />}>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Usuarios</h2>

          <div className="flex items-center gap-2">
            <Button type="button" color="green" className="gap-1" onClick={() => mutateDownload()} disabled={isPendingDownload}>
              <IconFileExcel className="w-4 h-4" />
              Descargar Plantilla
            </Button>

            <Button type="button" color="green" className="gap-1" onClick={openFileDialog} disabled={isPendingCreateUsers}>
              <UploadCloud className="w-4 h-4" />
              Subir Archivo
            </Button>

            <Button type="button" className="gap-1" onClick={openModalCreate}>
              <Plus className="w-4 h-4" />
              Nuevo Usuario
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <FormSearchInput className="w-60" name="search" control={control} placeholder="Buscar" />
            <FormSelect name="role" className="w-60" control={control} placeholder="Rol" options={ROLES} />
            <FormSelect
              name="company"
              className="w-60"
              control={control}
              placeholder="Empresa"
              options={valuesCompanies}
              disabledOptionsExceptions={valuesCompanies[0].value === '-'}
            />
            <FormSelect
              name="area"
              className="w-60"
              control={control}
              placeholder="Area"
              options={valuesAreas}
              disabled={company === 'all'}
              disabledOptionsExceptions={valuesAreas[0].value === '-'}
            />

            {/* <FormDatePickerWithRange control={control} name="dateRange" /> */}
            <Button type="submit" className="w-24 gap-1">
              <span>Filtrar</span>
            </Button>
            <Button className="w-24 gap-1" color="red" type="button" onClick={onClearFilter}>
              <span>Limpiar</span>
            </Button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 hover:bg-gray-50">
            {getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="hover:bg-gray-50">
            {getRowModel().rows?.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="font-medium" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        total={getRowCount()}
        pageIndex={getState().pagination.pageIndex + 1}
        totalPages={getPageCount()}
        pageSize={String(getState().pagination.pageSize)}
        onChangePageSize={handleChangePageSize}
        onFirst={firstPage}
        onPrevious={previousPage}
        onNext={nextPage}
        onLast={lastPage}
      />
      <ModalCreateUser {...{ isOpen: isOpenModalCreate, onClose: closeModalCreate, companies, areas }} />
      <ModalUpdateUser {...{ isOpen: isOpenModalUpdate, onClose: closeModalUpdate, data: dataSelected, companies, areas }} />
      <ModalDeleteUser {...{ isOpen: isOpenModalDelete, onClose: closeModalDelete, data: dataSelected }} />
    </Show>
  )
}

export default PageUsersCorporation
