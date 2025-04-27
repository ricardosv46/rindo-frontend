import { ModalCreateCorporation, ModalDeleteCorporation } from '@components/admin'
import { Chip, CustomTooltip, FormSearchInput, Show, Spinner, TablePagination } from '@components/shared'
import { Button } from '@components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { useToggle } from '@hooks/useToggle'
import { IUser } from '@interfaces/user'

import { getUsers } from '@services/user'
import { IconTrash } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Plus, SearchIcon, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const PageUsersAdmin = () => {
  const [isOpenModalCreate, openModalCreate, closeModalCreate] = useToggle()
  const [isOpenModalDelete, openModalDelete, closeModalDelete] = useToggle()
  const [dataSelected, setDataSelected] = useState<IUser | null>(null)
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([])
  const {
    data: users = [],
    isLoading,
    isFetching
  } = useQuery({
    queryKey: ['getUsers'],
    queryFn: getUsers
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
    columnHelper.accessor('email', {
      header: 'Correo',
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

        const handleDelete = () => {
          setDataSelected(data)
          openModalDelete()
        }
        return (
          <CustomTooltip title="Eliminar">
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={handleDelete}>
              <Trash className={'text-red-600'} />
            </Button>
          </CustomTooltip>
        )
      }
    }
  ]

  const initialValues = {
    search: ''
  }
  const { watch, control, handleSubmit, reset } = useForm({
    defaultValues: initialValues
  })

  const { search } = watch()

  const filteredData = () => {
    if (isFetching) return []

    const newData = users.filter((companie) => {
      const searchMatch =
        companie.name?.toLowerCase().includes(search.toLocaleLowerCase()) ||
        companie.email?.toLowerCase().includes(search.toLocaleLowerCase())

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
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const onSubmit = () => {
    setFilteredUsers(filteredData())
  }

  const onClearFilter = () => {
    setFilteredUsers(users || [])
    reset(initialValues)
  }

  const handleChangePageSize = (value: string) => {
    setPageSize(Number(value))
  }

  useEffect(() => {
    if (isFetching) return
    setFilteredUsers(users)
  }, [isFetching])

  return (
    <Show condition={isLoading} loadingComponent={<Spinner />}>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Corporativos</h2>

          <div className="flex items-center gap-2">
            <Button type="button" className="gap-1" onClick={openModalCreate}>
              <Plus className="w-4 h-4" />
              Nueva Corporativo
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

      <ModalCreateCorporation {...{ isOpen: isOpenModalCreate, onClose: closeModalCreate }} />
      <ModalDeleteCorporation {...{ isOpen: isOpenModalDelete, onClose: closeModalDelete, data: dataSelected }} />
    </Show>
  )
}

export default PageUsersAdmin
