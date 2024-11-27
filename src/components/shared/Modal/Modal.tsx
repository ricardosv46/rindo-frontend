import React, { ReactNode } from 'react'
import { Overlay } from '../Overlay/Overlay'
import { Portal } from '../Portal/Portal'
import { CircleX } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  closeDisabled?: boolean
  buttonClose?: boolean
}

const classNames = (cln: Array<string | undefined>) => {
  return cln.join(' ').trim()
}

export const Modal = ({ isOpen, onClose, children, closeDisabled = false, buttonClose = true }: ModalProps) => {
  return (
    <Portal>
      <div
        className={classNames([
          isOpen ? `opacity-100 z-[9999]` : 'opacity-0 -z-10',
          'fixed top-0 w-full h-screen grid place-items-center'
        ])}>
        <Overlay
          show={isOpen}
          onClick={() => {
            if (!closeDisabled) {
              onClose()
            }
          }}
        />
        {isOpen && (
          <div className="relative z-20 grid place-items-center">
            {buttonClose && (
              <button className="absolute top-2 right-2 " onClick={onClose}>
                <CircleX className="text-primary-600" />
              </button>
            )}
            {children}
          </div>
        )}
      </div>
    </Portal>
  )
}
