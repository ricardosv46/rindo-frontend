import { ModalCreateCompany, ModalDeleteCompany } from '@components/corporation'
import { columnsCompany } from '@components/corporation/companies/table/columnsCompany'
import { FormSearchInput, Show, Spinner, TablePagination } from '@components/shared'
import { Button } from '@components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { useToggle } from '@hooks/useToggle'
import { ICompany } from '@interfaces/company'
import { IUser } from '@interfaces/user'

import { getCompanies } from '@services/company'
import { useQuery } from '@tanstack/react-query'

import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { Plus, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

const PageCompanies = () => {
  const [isOpenModalCreate, openModalCreate, closeModalCreate] = useToggle()
  const [isOpenModalDelete, openModalDelete, closeModalDelete] = useToggle()

  const [dataSelected, setDataSelected] = useState<ICompany | null>(null)
  const [filteredCompanies, setFilteredCompanies] = useState<ICompany[]>([])
  const initialValues = {
    search: ''
  }
  const { watch, control, handleSubmit, reset } = useForm({
    defaultValues: initialValues
  })

  const {
    data: companies = [],
    isLoading,
    isFetching: isFetchingCompanies
  } = useQuery({
    queryKey: ['getCompanies'],
    queryFn: getCompanies
  })

  const { search } = watch()

  const filteredData = () => {
    if (isFetchingCompanies) return []

    const newData = companies.filter((companie) => {
      const searchMatch =
        companie.name?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        companie.ruc?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        companie.username?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        companie.token?.toLowerCase().includes(search.toLocaleLowerCase())

      return searchMatch
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
    data: filteredCompanies,
    columns: columnsCompany(setDataSelected, openModalDelete),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const onSubmit = () => {
    setFilteredCompanies(filteredData())
  }

  const onClearFilter = () => {
    setFilteredCompanies(companies || [])
    reset(initialValues)
  }

  const handleChangePageSize = (value: string) => {
    setPageSize(Number(value))
  }

  useEffect(() => {
    if (isFetchingCompanies) return
    setFilteredCompanies(companies)
  }, [isFetchingCompanies])

  return (
    <Show condition={isLoading} loadingComponent={<Spinner />}>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Empresas</h2>

          <div className="flex items-center gap-2">
            <Button type="button" className="gap-1" onClick={openModalCreate}>
              <Plus className="w-4 h-4" />
              Nueva Empresa
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <FormSearchInput className="w-60" name="search" control={control} placeholder="Buscar" />

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
      <ModalCreateCompany {...{ isOpen: isOpenModalCreate, onClose: closeModalCreate }} />
      <ModalDeleteCompany {...{ isOpen: isOpenModalDelete, onClose: closeModalDelete, data: dataSelected }} />
    </Show>
  )
}

export default PageCompanies
