import React from 'react'
export const ChipIcon = ({ status }: { status: 'APPROVED' | 'REJECTED' | 'IN_REVIEW' }) => {
  const getColor = () => {
    if (status === 'APPROVED') return 'bg-green-500'
    if (status === 'REJECTED') return 'bg-red-500'
    if (status === 'IN_REVIEW') return 'bg-orange-200'
  }

  const getBorderColor = () => {
    if (status === 'APPROVED') return 'border-green-500'
    if (status === 'REJECTED') return 'border-red-500'
    if (status === 'IN_REVIEW') return 'border-orange-200'
  }

  return (
    <div className="flex flex-col items-center justify-start">
      <div className={`p-1 bg-white border-2 ${getBorderColor()} rounded-full`}>
        <div className={`w-[12.5px] h-[12.5px] rounded-full ${getColor()}`}></div>
      </div>
      <div className={`w-0.5 h-32 ${getColor()}`}></div>
    </div>
  )
}
