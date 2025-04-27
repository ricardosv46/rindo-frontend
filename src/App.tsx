import { RootRouter } from '@routes/RootRouter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
        retry: false
        // staleTime: 0,
        // gcTime: 0
      }
    }
  })
  return (
    <QueryClientProvider client={queryClient}>
      <RootRouter />
      <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} className="z-[99999]" />
    </QueryClientProvider>
  )
}

export default App
