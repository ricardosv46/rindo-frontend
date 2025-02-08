import { HtmlHTMLAttributes } from 'react'

interface IReadOnlyField extends HtmlHTMLAttributes<HTMLDivElement> {
  label?: string
  value?: string
}

export const ReadOnlyField = ({ label, value, ...props }: IReadOnlyField) => {
  return (
    <div {...props}>
      <p className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">{label}</p>
      <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg   w-full p-2.5  dark:placeholder-gray-400  ">
        {value}
      </div>
    </div>
  )
}
