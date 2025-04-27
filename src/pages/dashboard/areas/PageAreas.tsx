import { columnsArea, ModalCreateArea, ModalUpdateArea } from '@components/corporation'
import { FormSearchInput, FormSelect, Show, Spinner, TablePagination } from '@components/shared'
import { Option } from '@components/shared/Forms/FormSelect'
import { Button } from '@components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { useDebounce } from '@hooks/useDebounce'
import { useToggle } from '@hooks/useToggle'
import { IArea } from '@interfaces/area'

import { getAreas } from '@services/area'
import { getCompanies } from '@services/company'
import { useQuery } from '@tanstack/react-query'

import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { Plus, SearchIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

const PageAreas = () => {
  const [isOpenModalUpdate, openModalUpdate, closeModalUpdate] = useToggle()
  const [isOpenModalCreate, openModalCreate, closeModalCreate] = useToggle()

  const [dataSelected, setDataSelected] = useState<IArea | null>(null)
  const [filteredAreas, setFilteredAreas] = useState<IArea[]>([])
  const initialValues = {
    search: '',
    company: 'all'
  }
  const { watch, control, handleSubmit, reset } = useForm({
    defaultValues: initialValues
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

  // const debouncedSearchTerm = useDebounce(search, 300)

  const filteredData = () => {
    if (isFetchingAreas) return []

    const newData = areas.filter((area) => {
      const term = search?.toLowerCase() ?? ''
      const companyMatch = company === 'all' || area.company?._id === company
      const searchMatch = area.name?.toLowerCase().includes(term) || area.company?.name?.toLowerCase().includes(term)
      return companyMatch && searchMatch
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
    getPageCount,
    firstPage,
    previousPage,
    nextPage,
    lastPage
  } = useReactTable({
    data: filteredAreas,
    columns: columnsArea(setDataSelected, openModalUpdate, refetch),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const handleChangePageSize = (value: string) => {
    setPageSize(Number(value))
  }

  const onSubmit = () => {
    setFilteredAreas(filteredData())
  }

  const onClearFilter = () => {
    setFilteredAreas(areas || [])
    reset(initialValues)
  }

  const valuesCompanies: Option[] = useMemo(() => {
    const data = companies.map((i) => ({ label: i.name, value: i._id }))
    const initial = companies.length > 0 ? { label: 'Todos', value: 'all' } : { label: 'No existen empresas', value: '-' }
    return [initial, ...data] as Option[]
  }, [companies])

  useEffect(() => {
    if (isFetchingAreas) return
    setFilteredAreas(areas)
  }, [isFetchingAreas])

  return (
    <Show condition={isLoadingAreas || isLoadingCompanies} loadingComponent={<Spinner />}>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Usuarios</h2>

          <div className="flex items-center gap-2">
            <Button type="button" className="gap-1" onClick={openModalCreate}>
              <Plus className="w-4 h-4" />
              Nueva Area
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
      <ModalCreateArea {...{ isOpen: isOpenModalCreate, onClose: closeModalCreate, companies }} />
      <ModalUpdateArea {...{ isOpen: isOpenModalUpdate, onClose: closeModalUpdate, data: dataSelected }} />
    </Show>
  )
}

export default PageAreas
