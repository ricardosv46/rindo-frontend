import { createTheme, ThemeProvider } from '@mui/material'
import { RootRouter } from '@routes/RootRouter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const theme = createTheme({
  // que no se ponga en mayusculas
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    }
  },
  // paleta de colores material
  palette: {
    primary: {
      light: '#A98DCE',
      main: '#693599',
      dark: '#693599',
      contrastText: '#fff'
    },
    secondary: {
      light: '#F4AD00',
      main: '#F49100',
      dark: '#F49100',
      contrastText: '#fff'
    }
  }
})
const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
        retry: false,
        staleTime: 0,
        gcTime: 0
      }
    }
  })
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <RootRouter />
      </ThemeProvider>
      <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} className="z-[99999]" />
    </QueryClientProvider>
  )
}

export default App
