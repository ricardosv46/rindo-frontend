// import { columnsReports, ModalCreateReports, ModalUpdateReports } from '@components/corporation'
import { Card, Modal, Show, Spinner } from '@components/shared'
import { useToggle } from '@hooks/useToggle'

import { useMutation, useQuery } from '@tanstack/react-query'

import { ModalDeleteReport } from '@components/corporation/reports/modals/ModalDeleteReport'
import { columnsReport } from '@components/corporation/reports/table/columnsReport'
import { FileUploadReadOnly } from '@components/shared/Files/FileUploadReadOnly'
import { IReport } from '@interfaces/report'
import { getReports, getReportsApproved } from '@services/report'
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { Plus, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@store/auth'
import { Role } from '@interfaces/user'
import { IFilterResponse, IFormFilters } from '@interfaces/filters'
import { Button } from '@components/ui/button'
import { FormSearchInput } from '@components/shared/Forms/FormSearchInput'
import { IconFileExcel } from '@tabler/icons-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { TablePagination } from '@components/shared/TablePagination/TablePagination'

const PageReports = () => {
  const { user } = useAuth()
  const [isOpenModalFile, openModalFile, closeModalFile] = useToggle()
  const [isOpenModalDelete, openModalDelete, closeModalDelete] = useToggle()
  const [dataSelected, setDataSelected] = useState<IReport | null>(null)
  const [dataSelectedFile, setDataSelectedFile] = useState<string | undefined>(undefined)
  const [filteredReports, setFilteredReports] = useState<IReport[]>([])
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const initialValues: IFormFilters = {
    search: '',
    pageSize: '10',
    dateRange: null,
    pageIndex: 1
  }
  const {
    watch: watchFilter,
    control: controlFilter,
    handleSubmit: handleSubmitFilter,
    reset: resetFilter,
    setValue: setValueFilter
  } = useForm<IFormFilters>({
    defaultValues: initialValues
  })

  const getReportsData = async (props: IFormFilters) => {
    try {
      if (pathname.includes('reviewed')) {
        const data = await getReportsApproved(props)
        return data
      }
      const data = await getReports(props)
      return data
    } catch (error) {
      throw error
    }
  }

  const {
    data: dataReports,
    isPending: isLoadingReports,
    mutate: mutateExpenses
  } = useMutation<IFilterResponse<IReport[]>, Error, IFormFilters>({
    mutationFn: getReportsData,
    mutationKey: ['getReports']
  })

  const { search, pageSize, dateRange, pageIndex } = watchFilter()

  const { getHeaderGroups, getRowModel, setPageSize, getRowCount, getState, setPageIndex } = useReactTable({
    data: dataReports?.data ?? [],
    columns: columnsReport(setDataSelected, openModalDelete, user?.role as Role),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true
  })

  useEffect(() => {
    // Si cambia pageSize, reseteamos a la primera página
    if (pageSize !== initialValues.pageSize) {
      setValueFilter('pageIndex', 1)
    }

    mutateExpenses({
      search,
      pageSize,
      dateRange,
      pageIndex: pageSize !== initialValues.pageSize ? 1 : pageIndex
    })
  }, [pageSize, pageIndex, pathname])

  const handleCreate = () => {
    navigate('/create-report')
  }

  const handleReset = () => {
    resetFilter()
    mutateExpenses(initialValues)
  }

  const onSubmit = (data: IFormFilters) => {
    mutateExpenses(data)
  }

  const handleDownload = () => {
    console.log('download')
  }

  const handleChangePageSize = (value: string) => {
    setValueFilter('pageSize', value)
  }

  const handleFirst = () => {
    setValueFilter('pageIndex', 1)
  }

  const handlePrevious = () => {
    setValueFilter('pageIndex', pageIndex - 1)
  }

  const handleNext = () => {
    setValueFilter('pageIndex', pageIndex + 1)
  }

  const handleLast = () => {
    setValueFilter('pageIndex', dataReports?.pagination.totalPages ?? 1)
  }

  return (
    <Show condition={isLoadingReports} loadingComponent={<Spinner />}>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Reportes</h2>
          {user?.role === 'SUBMITTER' && (
            <Button type="button" className="gap-1" onClick={handleCreate}>
              <Plus className="w-4 h-4" />
              <span>Nuevo Reporte</span>
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmitFilter(onSubmit)} className="flex flex-col justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <FormSearchInput name="search" control={controlFilter} placeholder="Buscar" />
            {/* <FormDatePickerWithRange control={control} name="dateRange" /> */}
            <Button type="submit" className="w-24 gap-1">
              <span>Filtrar</span>
            </Button>
            <Button className="w-24 gap-1" color="red" type="button" onClick={handleReset}>
              <span>Limpiar</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" color="green" className="gap-1" onClick={handleDownload}>
              <IconFileExcel className="w-4 h-4" />
              Descargar Reporte
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
        total={dataReports?.pagination?.total ?? 0}
        pageIndex={pageIndex}
        totalPages={dataReports?.pagination.totalPages ?? 1}
        pageSize={pageSize}
        onChangePageSize={handleChangePageSize}
        onFirst={handleFirst}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onLast={handleLast}
      />

      <Modal isOpen={isOpenModalFile} onClose={closeModalFile}>
        <Card className="w-[500px] max-h-[95vh] overflow-hidden">
          <FileUploadReadOnly value={dataSelectedFile} />
        </Card>
      </Modal>

      <ModalDeleteReport
        {...{
          isOpen: isOpenModalDelete,
          onClose: closeModalDelete,
          data: dataSelected
        }}
      />
    </Show>
  )
}

export default PageReports
