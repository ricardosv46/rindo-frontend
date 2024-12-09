import { MultipleStep } from '@components/corporation/expenses/steps/MultipleStep'
import { SingleStep } from '@components/corporation/expenses/steps/SingleStep'
import { Image } from '@icons/Image'
import { Images } from '@icons/Images'
import { Button } from '@mui/material'
import { useState } from 'react'

const PageCreateExpensesSubmitter = () => {
  const [expenseSelect, setExpenseSelect] = useState<'' | 'multiple' | 'single'>('')

  const multiple = () => {
    setExpenseSelect('multiple')
  }

  const single = () => {
    setExpenseSelect('single')
  }

  const reset = () => {
    setExpenseSelect('')
  }

  return (
    <div>
      {expenseSelect === '' && (
        <div className="grid flex-1 h-[calc(100vh-187px)] grid-cols-2 place-self-center place-items-center gap-3">
          <button
            onClick={single}
            className="flex flex-col justify-center items-center w-[400px]  h-[400px] rounded-lg shadow-lg gap-5 hover:cursor-pointer  hover:bg-sky-100">
            <Image />
            <h1 className="text-3xl font-bold text-center ">Crear Gasto</h1>
          </button>
          <button
            onClick={multiple}
            className="flex flex-col justify-center items-center w-[400px]  h-[400px] rounded-lg shadow-lg gap-5 hover:cursor-pointer  hover:bg-sky-100">
            <Images />
            <h1 className="text-3xl font-bold text-center ">Crear Gastos</h1>
          </button>
        </div>
      )}
      <Button onClick={reset} className="pb-5">
        Atras
      </Button>

      {expenseSelect === 'multiple' && <MultipleStep />}
      {expenseSelect === 'single' && <SingleStep />}
    </div>
  )
}

export default PageCreateExpensesSubmitter
