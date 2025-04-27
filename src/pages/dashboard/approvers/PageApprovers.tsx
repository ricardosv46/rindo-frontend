import { columnsApprover, ModalAddApprover, ModalDeleteApprover } from '@components/corporation'
import { FormSearchInput, FormSelect, Show, Spinner, TablePagination } from '@components/shared'
import { Option } from '@components/shared/Forms/FormSelect'
import { Button } from '@components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { useToggle } from '@hooks/useToggle'
import { IArea } from '@interfaces/area'
import { IUser } from '@interfaces/user'

import { getAreas } from '@services/area'
import { getCompanies } from '@services/company'
import { getApprovers } from '@services/user'
import { useQuery } from '@tanstack/react-query'

import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
const PageApprovers = () => {
  const [isOpenModalAdd, openModalAdd, closeModalAdd] = useToggle()
  const [isOpenModalDelete, openModalDelete, closeModalDelete] = useToggle()

  const [dataSelected, setDataSelected] = useState<IUser | null>(null)
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([])
  const [filteredAreas, setFilteredAreas] = useState<IArea[]>([])
  const initialValues = {
    search: '',
    company: 'all',
    area: 'all'
  }
  const { watch, control, setValue, reset, handleSubmit } = useForm({
    defaultValues: initialValues
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

  const usersFiltered = () => {
    if (isFetchingAreas && isFetchingUsers) return []
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
    return dataOrdered
  }

  useEffect(() => {
    if (isFetchingUsers) return
    setFilteredUsers(users)
  }, [isFetchingUsers])

  const {
    getHeaderGroups,
    getRowModel,
    setPageSize,
    getRowCount,
    getState,
    setPageIndex,
    getPageCount,
    firstPage,
    lastPage,
    nextPage,
    previousPage
  } = useReactTable({
    data: filteredUsers,
    columns: columnsApprover(areas, setDataSelected, openModalDelete, area),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const handleChangePageSize = (value: string) => {
    setPageSize(Number(value))
  }

  const onSubmit = () => {
    setFilteredUsers(usersFiltered())
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
    <Show condition={isLoadingUsers || isLoadingAreas || isLoadingCompanies} loadingComponent={<Spinner />}>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Aprobadores</h2>

          <div className="flex items-center gap-2">
            <Button type="button" className="gap-1" onClick={openModalAdd}>
              <Plus className="w-4 h-4" />
              Agregar Aprobador
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <FormSearchInput className="w-60" name="search" control={control} placeholder="Buscar" />
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

export default PageApprovers
