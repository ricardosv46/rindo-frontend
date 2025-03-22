import { EditStep } from '@components/corporation/expenses/steps/EditStep'
import { ShowStep } from '@components/corporation/expenses/steps/ShowStep'
import { Show, Spinner } from '@components/shared'
import { useToggle } from '@hooks/useToggle'
import { IExpense } from '@interfaces/expense'
import { getExpense } from '@services/expense'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const PageDetailExpense = () => {
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
      <ShowStep data={expense} />
    </Show>
  )
}

export default PageDetailExpense
