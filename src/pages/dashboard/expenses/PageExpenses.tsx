// import { columnsExpenses, ModalCreateExpenses, ModalUpdateExpenses } from '@components/corporation'
import { TablePagination } from '@components/shared/TablePagination/TablePagination'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FormDatePickerWithRange } from '@components/shared/Forms/FormDatePickerWithRange'
import { FormSearchInput } from '@components/shared/Forms/FormSearchInput'
import { ModalDeleteExpense } from '@components/corporation/expenses/modals/ModalDeleteExpense'
import { columnsExpense } from '@components/corporation/expenses/table/columnsExpense'
import { Card, Modal, Show, Spinner } from '@components/shared'
import { FileUploadReadOnly } from '@components/shared/Files/FileUploadReadOnly'
import { useToggle } from '@hooks/useToggle'
import { IExpense } from '@interfaces/expense'
import { IFilterResponse, IFormFilters } from '@interfaces/filters'
import { getExpenses, getExpensesReview } from '@services/expense'
import { useAuth } from '@store/auth'
import { IconFileExcel } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'

const PageExpenses = () => {
  const [isOpenModalFile, openModalFile, closeModalFile] = useToggle()
  const [isOpenModalDelete, openModalDelete, closeModalDelete] = useToggle()
  const [dataSelected, setDataSelected] = useState<IExpense | null>(null)
  const [dataSelectedFile, setDataSelectedFile] = useState<string | undefined>(undefined)
  const { user } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const initialValues: IFormFilters = {
    search: '',
    pageSize: '10',
    dateRange: null,
    pageIndex: 1
  }
  const { watch, control, handleSubmit, reset, setValue } = useForm<IFormFilters>({
    defaultValues: initialValues
  })

  const { search, pageSize, dateRange, pageIndex } = watch()

  const getExpensesData = async (props: IFormFilters) => {
    try {
      if (pathname === '/review') {
        const data = await getExpensesReview(props)
        return data
      }

      const data = await getExpenses(props)
      return data
    } catch (error) {
      throw error
    }
  }

  const {
    data: dataExpenses,
    isPending: isLoadingExpenses,
    mutate: mutateExpenses
  } = useMutation<IFilterResponse<IExpense[]>, Error, IFormFilters>({
    mutationFn: getExpensesData,
    mutationKey: ['getExpenses']
  })

  const { getHeaderGroups, getRowModel } = useReactTable({
    data: dataExpenses?.data ?? [],
    columns: columnsExpense(setDataSelectedFile, setDataSelected, openModalFile, openModalDelete),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true
  })

  useEffect(() => {
    // Si cambia pageSize, reseteamos a la primera página
    if (pageSize !== initialValues.pageSize) {
      setValue('pageIndex', 1)
    }

    mutateExpenses({
      search,
      pageSize,
      dateRange,
      pageIndex: pageSize !== initialValues.pageSize ? 1 : pageIndex
    })
  }, [pageSize, pageIndex, pathname])

  const onSubmit = (data: IFormFilters) => {
    mutateExpenses(data)
  }

  const handleCreate = () => {
    navigate('/create-expense')
  }

  const handleReset = () => {
    reset()
    mutateExpenses(initialValues)
  }

  const handleDownload = () => {
    console.log('download')
  }
  const handleChangePageSize = (value: string) => {
    setValue('pageSize', value)
  }
  const handleFirst = () => {
    setValue('pageIndex', 1)
  }

  const handlePrevious = () => {
    setValue('pageIndex', pageIndex - 1)
  }

  const handleNext = () => {
    setValue('pageIndex', pageIndex + 1)
  }

  const handleLast = () => {
    setValue('pageIndex', dataExpenses?.pagination.totalPages ?? 1)
  }

  return (
    <Show condition={isLoadingExpenses} loadingComponent={<Spinner />}>
      <Modal isOpen={isOpenModalFile} onClose={closeModalFile}>
        <Card className="w-[500px] max-h-[95vh] overflow-hidden">
          <FileUploadReadOnly value={dataSelectedFile} />
        </Card>
      </Modal>

      <ModalDeleteExpense
        {...{
          isOpen: isOpenModalDelete,
          onClose: closeModalDelete,
          data: dataSelected
        }}
      />

      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Gastos</h2>
          {user?.role === 'SUBMITTER' && (
            <Button type="button" className="gap-1" onClick={handleCreate}>
              <Plus className="w-4 h-4" />
              <span>Nuevo Gasto</span>
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <FormSearchInput name="search" control={control} placeholder="Buscar" />
            <FormDatePickerWithRange control={control} name="dateRange" />
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
        total={dataExpenses?.pagination?.total ?? 0}
        pageIndex={pageIndex}
        totalPages={dataExpenses?.pagination.totalPages ?? 1}
        pageSize={pageSize}
        onChangePageSize={handleChangePageSize}
        onFirst={handleFirst}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onLast={handleLast}
      />
    </Show>
  )
}

export default PageExpenses
