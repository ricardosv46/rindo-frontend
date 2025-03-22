import { EditStep } from '@components/corporation'
import { Show, Spinner } from '@components/shared'
import { IExpense } from '@interfaces/expense'
import { getExpense } from '@services/expense'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

const PageEditExpenses = () => {
  const { id } = useParams()

  const {
    data: expense = {} as IExpense,
    isFetching: isFetchingExpense,
    refetch: refetchExpense
  } = useQuery({
    queryKey: ['getReport', id],
    queryFn: () => getExpense({ id: id! }),
    enabled: !!id
  })

  return (
    <Show condition={isFetchingExpense} loadingComponent={<Spinner />}>
      <EditStep data={expense} />
    </Show>
  )
}

export default PageEditExpenses
