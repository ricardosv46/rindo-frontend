import { EditStep } from '@components/corporation/expenses/steps/EditStep'
import { Show, Spinner } from '@components/shared'
import { useToggle } from '@hooks/useToggle'
import { IExpense } from '@interfaces/expense'
import { getExpense } from '@services/expense'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const PageEditExpensesSubmitter = () => {
  const { id } = useParams()

  const {
    mutate: mutateGetExpense,
    isPending,
    data: expense = {} as IExpense
  } = useMutation({
    mutationFn: getExpense
  })

  useEffect(() => {
    mutateGetExpense({ id: id! })
  }, [])

  return (
    <Show condition={isPending} loadingComponent={<Spinner />}>
      <EditStep data={expense} />
    </Show>
  )
}

export default PageEditExpensesSubmitter
