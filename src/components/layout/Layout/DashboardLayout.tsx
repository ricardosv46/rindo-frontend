import { Outlet } from 'react-router-dom'
import { Header } from '../Header/Header'
import { Sidebar } from '../Sidebar/Sidebar'
import { Card } from '../../shared/Card/Card'
import { ScrollArea } from '@/components/ui/scroll-area'

export const DashboardLayout = () => {
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <ScrollArea className="h-[calc(100vh-72px)] lg:h-[calc(100vh-91px)] w-full">
          <div className="min-h-full p-6 overflow-hidden bg-rindo scroll-auto">
            <Card className="p-0 overflow-hidden">
              <Outlet />
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
