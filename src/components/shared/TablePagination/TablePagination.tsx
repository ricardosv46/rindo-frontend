import { Button } from '@/components/ui/button'
import { FormSelect } from '@components/shared/Forms/FormSelect'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Control } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { cn } from '@lib/utils'

interface TablePaginationProps {
  total: number
  pageIndex: number
  totalPages: number
  pageSize: string
  onChangePageSize: (value: string) => void
  onFirst: () => void
  onPrevious: () => void
  onNext: () => void
  onLast: () => void
}

export function TablePagination({
  total,
  pageIndex,
  pageSize,
  totalPages,
  onChangePageSize,
  onFirst,
  onPrevious,
  onNext,
  onLast
}: TablePaginationProps) {
  const disabledPrevious = pageIndex === 1 || total === 0
  const disabledNext = pageIndex === totalPages || total === 0
  const options = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' }
  ]
  return (
    <div className="flex flex-col items-center justify-between gap-4 p-4 text-gray-600 border-t sm:flex-row">
      <span className="text-sm">Total de elementos: {total}</span>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-sm">
          <span>Filas por página:</span>

          <Select
            value={pageSize}
            onValueChange={(value) => {
              onChangePageSize(value)
            }}>
            <SelectTrigger className={cn('!h-[31.5px]', 'w-16 h-8')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm">
          Página {total === 0 ? '0' : pageIndex} de {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <Button color="blue" type="button" onClick={onFirst} disabled={disabledPrevious}>
            <ChevronsLeft className="w-4 h-4" />
            <span className="sr-only">Primera página</span>
          </Button>
          <Button color="blue" type="button" disabled={disabledPrevious} onClick={onPrevious}>
            <ChevronLeft className="w-4 h-4" />
            <span className="sr-only">Anterior</span>
          </Button>
          <Button color="blue" type="button" onClick={onNext} disabled={disabledNext}>
            <ChevronRight className="w-4 h-4" />
            <span className="sr-only">Siguiente</span>
          </Button>
          <Button color="blue" type="button" onClick={onLast} disabled={disabledNext}>
            <ChevronsRight className="w-4 h-4" />
            <span className="sr-only">Última página</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
