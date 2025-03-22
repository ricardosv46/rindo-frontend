import { ChipStatusExpense, ChipStatusReport, columnsExpenseByReport, columnsExpenseByReportReadOnly } from '@components/corporation'
import { ChipIcon } from '@components/corporation/expenses/components/ChipIcon'
import { Card, Modal, Show, Spinner } from '@components/shared'
import { FileUploadReadOnly } from '@components/shared/Files/FileUploadReadOnly'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDebounce } from '@hooks/useDebounce'
import { useToggle } from '@hooks/useToggle'
import { IArea } from '@interfaces/area'
import { IHistory } from '@interfaces/expense'
import { IReportExpenses } from '@interfaces/report'
import { formatNumber } from '@lib/utils'
import {
  Button,
  Divider,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from '@mui/material'
import { getArea } from '@services/area'
import { editExpenseStatus } from '@services/expense'
import { editReportApprove, editReportSendProgress, getReportExpenses } from '@services/report'
import { useAuth } from '@store/auth'
import { IconFileExcel } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { SearchIcon, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { z } from 'zod'

export interface IFormReport {
  search: string
  expenses: string[]
  comment: string
  title: string
}

export const validationSchema = z.object({
  search: z.string().optional(),
  expenses: z.array(z.string()).optional(),
  comment: z.string().optional(),
  title: z.string().optional()
})

const PageDetailReport = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dataSelectedFile, setDataSelectedFile] = useState<string | undefined>(undefined)
  const [dataSelectedHistory, setDataSelectedHistory] = useState<IHistory[]>([])
  const [isOpenModalFile, openModalFile, closeModalFile] = useToggle()
  const [isOpenModalHistory, openModalHistory, closeModalHistory] = useToggle()
  const [isOpenModalComment, openModalComment, closeModalComment] = useToggle()
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue
  } = useForm<IFormReport>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      search: '',
      expenses: [],
      comment: '',
      title: ''
    },
    mode: 'onChange'
  })
  const { search, expenses, comment, title } = watch()

  const { id } = useParams()

  const getReportData = async () => {
    try {
      const data = await getReportExpenses({ id: id! })
      return data
    } catch (error) {
      throw error
    }
  }

  const {
    data: report = {} as IReportExpenses,
    isFetching: isFetchingReport,
    refetch: refetchReport
  } = useQuery({
    queryKey: ['getReportExpenses', id],
    queryFn: getReportData,
    enabled: !!id
  })

  const {
    data: area = {} as IArea,
    isFetching: isFetchingArea,
    refetch: refetchArea
  } = useQuery({
    queryKey: ['getArea', report?.area],
    queryFn: () => getArea({ id: report?.area! }),
    enabled: !!report?.area
  })

  const isVisibleButton = useMemo(() => {
    return area?.approvers?.some((approver) => approver.order === report?.index && approver.approver === user?._id)
  }, [area?.approvers, report?.index, user?._id])

  const queryClient = useQueryClient()
  const { mutate: mutateEditSendProgress, isPending: isPendingSendProgress } = useMutation({
    mutationFn: editReportSendProgress,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getReports'] })
      navigate('/reports')
    }
  })

  const { mutate: mutateEditApprove, isPending: isPendingApprove } = useMutation({
    mutationFn: editReportApprove,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getReports'] })
      navigate('/reports')
    }
  })

  const { mutate: mutateEditStatus, isPending: isPendingStatus } = useMutation({
    mutationFn: editExpenseStatus,
    onError: (error: string) => {
      toast.error(error)
    },
    onSuccess: async ({ message }) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['getReportExpenses'] })
      closeModalComment()
      setValue('title', '')
      setValue('expenses', [])
      setValue('comment', '')
    }
  })

  const handleContinue = async () => {
    if (report?.status === 'DRAFT') {
      mutateEditSendProgress({ id: report?._id })
    } else {
      mutateEditApprove({ id: report?._id })
    }
  }

  const debouncedSearchTerm = useDebounce(search, 300)

  const filteredData = useMemo(() => {
    if (!report?.expenses) return []
    return report?.expenses?.filter((expense) => {
      const term = debouncedSearchTerm?.toLowerCase() ?? ''
      const searchMatch = expense.description?.toLowerCase().includes(term) || expense.companyName?.toLowerCase().includes(term)
      return searchMatch
    })
  }, [report?.expenses, search, debouncedSearchTerm])

  const handleSeletedForm = (expenses: string[]) => {
    setValue('expenses', expenses, { shouldValidate: true })
  }

  const validateSelection = useMemo(() => {
    return (user?.role === 'GLOBAL_APPROVER' || user?.role === 'APPROVER') && isVisibleButton
  }, [user?.role, isVisibleButton])

  const { getHeaderGroups, getRowModel, setPageSize, getRowCount, getState, setPageIndex } = useReactTable({
    data: filteredData,
    columns: columnsExpenseByReport({
      setDataSelectedFile,
      openModalFile,
      dataSelected: expenses,
      setDataSelected: handleSeletedForm,
      filteredExpenses: filteredData,
      selection: validateSelection,
      history: true,
      setDataSelectedHistory,
      openModalHistory
    }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const calculateTotals = () => {
    const totals = report?.expenses?.reduce(
      (acc, expense) => {
        if (expense.currency === 'USD') {
          acc.usd += Number(expense.total) || 0
        } else if (expense.currency === 'PEN') {
          acc.pen += Number(expense.total) || 0
        }
        return acc
      },
      { usd: 0, pen: 0 }
    )
    return totals
  }

  const totals = calculateTotals()

  const handleApproveExpenses = () => {
    mutateEditStatus({ id: report?._id, status: 'APPROVED', expenses })
  }

  const handleModalRejectExpenses = () => {
    setValue('title', 'Rechazar')
    setValue('comment', '')
    openModalComment()
  }

  const handleRejectExpenses = () => {
    mutateEditStatus({ id: report?._id, status: 'REJECTED', expenses, comment })
  }

  const handleModalReviewExpenses = () => {
    setValue('title', 'Revisar')
    setValue('comment', '')
    openModalComment()
  }

  const handleReviewExpenses = () => {
    mutateEditStatus({ id: report?._id, status: 'IN_REVIEW', expenses, comment })
  }

  const onSubmitModal = async (values: IFormReport) => {
    if (values?.title === 'Rechazar') {
      handleRejectExpenses()
    } else if (values?.title === 'Revisar') {
      handleReviewExpenses()
    }
  }

  const disabledButtonApprove = useMemo(() => {
    if (!report?.expenses) return true
    return expenses.every((expenseId) => {
      const expense = report?.expenses?.find((exp) => exp._id === expenseId)
      return expense?.status === 'APPROVED'
    })
  }, [report?.expenses, expenses])

  const disabledButtonReject = useMemo(() => {
    if (!report?.expenses || expenses.length !== 1) return true
    const expense = report?.expenses?.find((exp) => exp._id === expenses[0])
    return expense?.status === 'REJECTED'
  }, [report?.expenses, expenses])

  const disabledButtonReview = useMemo(() => {
    if (!report?.expenses || expenses.length !== 1) return true
    const expense = report?.expenses?.find((exp) => exp._id === expenses[0])
    return expense?.status === 'IN_REVIEW'
  }, [report?.expenses, expenses])

  const disabledButtonFinish = useMemo(() => {
    if (report?.status === 'DRAFT') return false
    if (!report?.expenses?.length) return true
    return !report.expenses.every((exp) => exp.status === 'APPROVED' || exp.status === 'REJECTED')
  }, [report?.status, report?.expenses])

  return (
    <Show condition={isFetchingReport} loadingComponent={<Spinner />}>
      <form className="flex flex-col gap-5 py-2">
        <div className="">
          <div className="flex justify-between ">
            <p className="text-lg font-bold ">{report?.name}</p>
            <Button className="" type="button" variant="contained" color="success" startIcon={<IconFileExcel />}>
              Descargar reporte
            </Button>
          </div>
          <ChipStatusReport status={report?.status!} />
          <p className="my-5 ">Detalle de gastos ({report?.expenses?.length})</p>
          <div className="flex justify-between pb-5">
            <Controller
              name="search"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
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
            <div className="flex gap-2">
              <Button variant="contained" disabled={disabledButtonApprove} color="success" onClick={handleApproveExpenses}>
                Aprobar
              </Button>
              <Button variant="contained" disabled={disabledButtonReject} color="error" onClick={handleModalRejectExpenses}>
                Rechazar
              </Button>
              <Button variant="contained" disabled={disabledButtonReview} color="warning" onClick={handleModalReviewExpenses}>
                Revisar
              </Button>
            </div>
          </div>

          <TableContainer>
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
                  <TableRow hover key={row.id} selected={expenses?.some((i) => i === row.getVisibleCells()[0].row.original._id)}>
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
          <div className="flex justify-end px-40 py-5 my-5 bg-blue-300 rounded-lg shadow-lg">
            <div className="grid w-2/12 grid-cols-2 font-medium text-primary-600">
              <div className="flex flex-col gap-2">
                <p>Total PEN:</p>
                <p>Total USD:</p>
              </div>
              <div className="flex flex-col gap-2">
                <p>{formatNumber(String(totals?.pen))}</p>
                <p>{formatNumber(String(totals?.usd))}</p>
              </div>
            </div>
          </div>
          {(report?.status === 'DRAFT' || (report?.status === 'IN_PROCESS' && isVisibleButton)) && (
            <div className="flex flex-col items-end gap-3 mt-2">
              <Button
                className=""
                type="button"
                variant="contained"
                disabled={isPendingSendProgress || isPendingApprove || disabledButtonFinish}
                onClick={handleContinue}>
                {report?.status === 'DRAFT' ? 'Enviar a revisión' : 'Finalizar revisión'}
              </Button>
            </div>
          )}
        </div>
      </form>

      <Modal isOpen={isOpenModalFile} onClose={closeModalFile}>
        <Card className="w-[500px] max-h-[95vh] overflow-hidden">
          <FileUploadReadOnly value={dataSelectedFile} />
        </Card>
      </Modal>
      <Modal isOpen={isOpenModalHistory} onClose={closeModalHistory}>
        <Card className="w-[500px] max-h-[95vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Historial</h2>
          </div>

          <div className="flex flex-col gap-10 p-5">
            {dataSelectedHistory?.map((history) => (
              <div className="flex gap-5">
                <div className="flex flex-col justify-center gap-1 text-center">
                  <p>{history?.description}</p>
                  <p>{history.date}</p>
                </div>
                <ChipIcon status={history.status as 'APPROVED' | 'REJECTED' | 'IN_REVIEW'} />
                <div className="flex flex-col gap-2">
                  <ChipStatusExpense status={history.status!} />
                  <p>{history.comment}</p>
                  <p>
                    {history.createdBy?.name} {history.createdBy?.lastName}
                  </p>
                  <p>{history.createdBy?.email}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Modal>
      <Modal isOpen={isOpenModalComment} onClose={closeModalComment}>
        <Card className="w-[400px] max-h-[95vh] overflow-hidden">
          <p className="pb-6">{title} gasto</p>
          <Divider sx={{ width: 'calc(100% + 48px)', marginX: '-24px', mb: 4 }} />
          <form onSubmit={handleSubmit(onSubmitModal)} className="flex flex-col gap-5 max-h-[calc(100vh-150px)] py-2 overflow-auto">
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  color="primary"
                  type="text"
                  label="Comentario"
                  size="small"
                  error={!!errors.comment}
                  helperText={errors.comment?.message}
                />
              )}
            />

            <Divider />
            <Button type="submit" variant="contained" disabled={isPendingStatus}>
              {title}
            </Button>
          </form>
        </Card>
      </Modal>
    </Show>
  )
}

export default PageDetailReport
