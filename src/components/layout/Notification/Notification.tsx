import { IconButtonPurple, Chip } from '@components/shared'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IconBell } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useToggle } from '@hooks/useToggle'

export const Notification = () => {
  const [isOpenNotification, openNotification, closeNotification, toggleNotification] = useToggle()

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeNotification()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const [age, setAge] = useState('')

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string)
  }

  return (
    <div className="sm:relative " ref={dropdownRef}>
      <IconButtonPurple aria-haspopup="true" onClick={toggleNotification} aria-expanded={isOpenNotification}>
        <IconBell stroke={1.5} size="20px" />
      </IconButtonPurple>

      <div
        className={`max-w-[330px] w-full sm:w-[330px] z-10  sm:top-10 top-16 border absolute right-0 mt-2 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-in-out transform origin-top-right ${
          isOpenNotification ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}>
        <div className="p-4">
          <p className="font-semibold">Todas tus notificaciones</p>

          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={age} label="Age" onChange={handleChange}>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </div>

        <ScrollArea className="h-[447px]">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex w-full gap-5 p-4 border-t border-gray-300">
              <div
                className="flex items-center justify-center w-10 h-10 text-white transition-all duration-300 ease-in-out transform rounded-full bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-opacity-50"
                aria-haspopup="true">
                <span className="text-lg font-semibold">JH</span>
              </div>
              <div className="flex flex-col flex-1 gap-3">
                <div className="flex justify-between">
                  <p className="mt-2 text-sm font-medium">Jhoana</p>
                  <p className="text-xs font-medium text-primary-300">11/10/2024 16:22</p>
                </div>
                <p className="text-xs font-medium text-primary-300">Él usuario Jhoana ha cerrado el informe correctamente</p>

                <Chip label="Leido" color="green" className="mt-2" button />
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}
