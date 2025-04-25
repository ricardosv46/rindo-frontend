import { Dayjs } from 'dayjs'

export interface IFormFilters {
  search: string
  pageSize: string
  dateRange: {
    from: Dayjs
    to: Dayjs
  } | null
  pageIndex: number
}

export interface IFilterResponse<T> {
  data: T
  pagination: {
    total: number
    pageSize: number
    currentPage: number
    totalPages: number
  }
}
